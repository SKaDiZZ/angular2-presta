import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Import presta configuration
import { Angular2PrestaConfiguration } from './angular2-presta.configuration';
import { Angular2PrestaQuery } from './angular2-presta.query';
import { Angular2PrestaImageSize } from './angular2-presta.image.size';

@Injectable({
  providedIn: 'root'
})
export class Angular2PrestaService {

  TAG = 'Angular2Presta: ';

  constructor(
    @Inject('prestaConfiguration') private config: Angular2PrestaConfiguration,
    private http: HttpClient
  ) {}

  /*
   * [requestConstructor : analyze Query object, construct and return request url]
   * @param  {PrestaQuery}  q [Query object]
   * @return {[string]}   [request url]
   */
  requestConstructor(q: Angular2PrestaQuery): string {

    // check if params are set, if not set default values
    if (!q.resource) {
      q.resource = 'products';
    }

    // Check if display is set if not return results with all properties
    !q.display ? q.display = `&display=full` : q.display = `&display=[${q.display}]`;

    // Generate filter query from Query.filter object if it is defined
    let filterQuery = '';

    if (q.filter) {
      for (const property in q.filter) {
        if (property) {
          filterQuery += `&filter[${property}]=[${q.filter[property]}]`;
        }
      }
    }

    !q.sort ? q.sort = '' : q.sort = `&sort=[${q.sort}]`;
    !q.limit ? q.limit = '' : q.limit = `&limit=${q.limit}`;

    if (!q.search) {

      return this.config.shopUrl +
        q.resource +
        '?ws_key=' + this.config.apiKey +
        '&output_format=JSON' +
        q.display +
        filterQuery +
        q.sort +
        q.limit;

    } else {

      return this.config.shopUrl + 'search' +
        '?ws_key=' + this.config.apiKey +
        '&output_format=JSON&language=1' +
        q.display +
        filterQuery +
        '&query=' + q.search;

    }
  }

  fetchForm(resource: string): Observable<any> {
    return this.http.get(`${this.config.shopUrl}${resource}?schema=blank&ws_key=${this.config.apiKey}`, { responseType: 'text' });
  }

  /*
   * [get results from presta shop web service]
   * @param  {PrestaQuery}           q [query object]
   * @return {Observable<any>}   [results object array]
   */
  get(q: Angular2PrestaQuery): Observable <any> {
    return this.http.get(this.requestConstructor(q))
      .pipe(
        map(resp => resp[q.resource]),
        catchError(this.handleError)
      );
  }

  /*
   * [search]
   * @param  {PrestaQuery}           q [query object with search term provided]
   * @return {Observable<Response>}   [return results object array]
   */
  search(q: Angular2PrestaQuery): Observable <any> {
    return this.http.get(this.requestConstructor(q))
      .pipe(
        map(resp => resp[q.resource]),
        catchError(this.handleError)
      );
  }

  /*
   * [getImage used by PrestaImage component to get images from Presta Shop Web Service]
   * @param  {string} resource   [general, products, categories, manufacturers, suppliers, stores]
   * @param  {number} resourceID [ID of resurce to get images for]
   * @param  {number} imageID    [ID of image to get]
   * @param  {string} imageSize  [cart, small, medium, large, thickbox, home, category]
   * @return {string}            [url]
   */
  getImage(resource: string, resourceID: number, imageID?: number, imageSize?: string): string {

    // check if imageApiKey is defined if not use default apiKey (not recomended for security reasons)
    let key = '';
    !this.config.imageApiKey ? key = this.config.apiKey : key = this.config.imageApiKey;

    // check if image size is defined if not get large images by default
    if (!imageSize) {
      imageSize = Angular2PrestaImageSize.large;
    }

    if (resource === 'products') {

      return this.config.shopUrl + 'images/' +
        resource + '/' +
        resourceID + '/' +
        imageID + '/' +
        Angular2PrestaImageSize[imageSize] +
        '?ws_key=' + key;

    } else {

      return this.config.shopUrl + 'images/' +
        resource + '/' +
        resourceID +
        '?ws_key=' + key;

    }

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(this.TAG + 'An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `${this.TAG} Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(`${this.TAG} Something bad happened; please try again later.`);
  }

}

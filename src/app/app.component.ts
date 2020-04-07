import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// import service and query
import { Angular2PrestaService, Angular2PrestaQuery } from 'angular2-presta';

@Component({
  selector: 'app-root',
  template: `
    <div *ngFor="let product of product$ | async">
      <a2p-image [resource]="query.resource" [resourceID]="product.id" [imageID]="product.id_default_image" [size]="'medium'"></a2p-image>
      <h1 [innerHTML]="product.name"></h1>
      <p [innerHTML]="product.description_short"></p>
      <p>{{ product.price | currency }}<p>
    </div>`,
  styles: []
})
export class AppComponent implements OnInit {

   // products observable
  product$: Observable<any>;

  query: Angular2PrestaQuery = {
     // define resource products, categories ...
    // check full list http://doc.prestashop.com/display/PS16/Web+service+reference
    resource: 'products',
    // return only fields you need
    display : 'id,id_default_image,name,price,description_short,condition',
    // filter results
    filter: {
      name: 'blouse',
      condition: 'new'
    },
    // sort results
    sort: 'name_ASC',
    // limit number of results or define range
    limit: '1'
  };

  // Inject Angular2PrestaService
  constructor(private _service: Angular2PrestaService) {}

  ngOnInit() {
    // Use get function provided by Angular2PrestaService
    this.product$ = this._service.get(this.query);
  }

}

![angular2-presta](https://imagizer.imageshack.us/v2/888x214q90/922/yZyztX.png)

# angular2-presta

Angular services for consuming PrestaShop API ...

This library should help developers coding Angular and Ionic apps consuming PrestaShop API.

## Installation

To install this library, run:

```bash
$ npm install angular2-presta --save
```

## Bootstrap

and then from your Angular App Module:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import HttpClientModule
import { HttpClientModule } from '@angular/common/http';

// Import PrestaModule module
import { PrestaModule, PrestaConfiguration, PrestaService } from 'angular2-presta';

import { AppComponent } from './app.component';

// Add your presta web service api key and shop url
export const prestaConfiguration: PrestaConfiguration = {
  apiKey: 'YOUR_PRESTA_API_KEY',
  imageApiKey: 'YOUR_PRESTA_API_KEY', // ApiKey only with images GET permissions for security reasons
  shopUrl: 'http://yourshop.com/api/'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PrestaModule.forRoot(prestaConfiguration)
  ],
  // provide presta service as global
  providers: [PrestaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Using PrestaService

```typescript
import { Component, OnDestroy } from '@angular/core';

// Import presta service and Query
import { PrestaService, PrestaQuery } from './presta/presta.module';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  // store subscription to presta webservice so we can unsuscribe later
  subscription: any;

  // List of products
  products: Observable<any>;

  // construct query
  query: PrestaQuery = {
    // define resource products, categories ...
    // check full list http://doc.prestashop.com/display/PS16/Web+service+reference
    resource : 'products',
    // return only fields you need
    display  : 'id,id_default_image,name,price,description_short,condition',
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

  constructor(private _prestaService: PrestaService) {

    // pass Query to presta service and subscribe to get results
    this.subscription = this._prestaService.get(this.query)
                       .subscribe(
                          data => this.products = data[this.query.resource],
                          error => `Error getting ${this.query.resource}: ${error.status} -> ${error.message}`
                        );
    }

  // don't forget to unsuscribe
  ngOnDestroy() {
    this.subscription.unsuscribe();
  }

}
```

## Constructing Query

For now only GET method is supported, no posting or updating data is available.

Query options:

- **resource**: string -> Select type of results: products, categories, customers ...
- **display** : string -> Allows you to limit result fields to only those you need, by default it will return all fields
- **filter**: Object -> object defining fields and values to filter results by
- **sort**: string -> sort results by: 'id_ASC', 'id_DESC', 'name_ASC', 'name_DESC' ...
- **limit**: string -> limit number of results, or define range of results '5', '9,5'
- **search**: string -> search term to use for presta web service search

### Get product categories

```typescript
query: PrestaQuery = {
    resource: 'categories'
  };
```

### Get products by category

```typescript
query: PrestaQuery = {
    resource: 'products',
    filter: {
      id_category_default: '11'
    }
  };
```

### Get product by id

```typescript
query: PrestaQuery = {
    resource: 'products',
    filter: {
      id: '1'
    }
  };

  this._prestaService.get(query)
                     .subscribe(data => this.products = data[query.resource]);
```

## Using search

Search Query can accept search and resource fields. By default search will return list of products if no other resource is defined.

```typescript
import { PrestaQuery, PrestaService } from 'angular2-presta';
import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PrestaService]
})
export class AppComponent implements OnDestroy {

    // store subscription to presta webservice so we can unsuscribe later
    subscription: any;

    // List of products
    products: Observable<any>;

    // construct query
    query: PrestaQuery = {
      resource : 'products',
      search: 'dress'
    };

    constructor(private _prestaService: PrestaService) {

      // pass Query to presta service and subscribe to get results
      this.subscription = this._prestaService.search(this.query)
                         .subscribe(
                            data => this.products = data[this.query.resource]
                           );

    }

    // don't forget to unsuscribe
    ngOnDestroy() {
      this.subscription.unsuscribe();
    }

  }
```

### Search categories

```typescript
query: PrestaQuery = {
    resource: 'categories'
    search: 'dresses'
  };

this._prestaService.search(query)
                   .subscribe(data => this.categories = data[query.resource]);
```

## Outputing data

Some of the Presta web service results come with html tags included to remove tags we will use innerHtml directive.

```html
<ul *ngIf="items">
  <li *ngFor="let item of items">
    <h1 [innerHTML]="item.name"></h1>
    <p [innerHTML]="item.description_short"></p>
    <p>{{ item.price | currency }}<p>
  </li>
</ul>
```

## Working with images

Before you try to use images you should generate one special API KEY, only with one permission to GET images. This is most secure method, because your API KEY will be included in every call to fetch image so it's easy to obtain it by third person.

Include your images API KEY into PrestaConfiguration object in AppModule:

```typescript
// Add your presta web service api key and shop url
export const prestaConfiguration: PrestaConfiguration = {
  apiKey: 'YOUR_PRESTA_API_KEY',
  imageApiKey: 'YOUR_PRESTA_API_KEY', // ApiKey only with images GET permissions for security reasons
  shopUrl: 'http://yourshop.com/api/'
}
```

We will use presta-image component to output product images. Presta image component has few inputs from which it constructs url from which it will construct image url.

## Presta image component
## @Inputs
  - **resource**: string -> for which you want to get image available are
      - general : General shop images
      - products : Product images
      - categories : Category images
      - customizations : Customization images
      - manufacturers : Manufacturer images
      - suppliers : Supplier images
      - stores : Store images

  - **resourceID**: number -> unique resource ID for example product or category ID

  - **imageID**: number -> image ID is required for product images because products have more then one image for other resource images you don't need to define it

  - **size** string -> define one of available image sizes ( cart, small, medium, large,thickbox, home, category). Size is optional and if you leave it undefined component will display large images by default.

Get product images in your html template using presta-image component:

```html
<ul *ngIf="products">
  <li *ngFor="let item of products">

    <!-- use presta-img component to get products default image and display it as large image -->
    <presta-image [resource]="query.resource" [resourceID]="item.id" [imageID]="item.id_default_image" [size]="'medium'"></presta-image>

    <h1 [innerHTML]="item.name"></h1>
    <p [innerHTML]="item.description_short"></p>
    <p>{{ item.price | currency }}<p>

        <!-- get all images for this product and use small image size -->
        <ul *ngIf="item.associations.images">
          <li *ngFor="let image of item.associations.images">
            <presta-image [resource]="query.resource" [resourceID]="item.id" [imageID]="image.id" [size]="'small'"></presta-image>
          </li>
        </ul>

  </li>
</ul>
```

Get images for other resources using presta-image component

```html
<!-- get category image passing category id -->
<presta-image [resource]="'categories'" [resourceID]="10"></presta-image>

<!-- get store image passing store id -->
<presta-image [resource]="'stores'" [resourceID]="1"></presta-image>

<!-- get supplier image passing supplier id -->
<presta-image [resource]="'suppliers'" [resourceID]="1"></presta-image>

<!-- get manufacturers image passing manufacturer id -->
<presta-image [resource]="'manufacturers'" [resourceID]="1"></presta-image>
```

## Roadmap

- [x] GET requests, filtering, sorting
- [x] SEARCH support
- [x] IMAGES support
- [ ] POST requests
- [ ] UPDATE requests
- [ ] DELETE requests

## Latest updates

### v0.1.11
  - Added presta prefix to interfaces, enums etc.
  - Presta Service is using new HttpClient from now
  - Fixed bugs with presta-image component making it faster and more reliable
  - Updated readme with new examples

### v0.1.9
  - Upadated presta-img component for better image loading
  - presta-img now requires image size to be defined using ImageSize enum values to reduce errors
  - All packages updated
  - Better error catching
  - Tested with Prestashop 1.7

### v0.1.7
  - Fixed module exports
  - Documentation improved

### v0.1.6
  - Added images support by new PrestaImage component
  - Fixed limit not working

### v0.1.4 - v0.1.5
  - Updated documentation

### v0.1.3
  - Added support for search, code optimized, many fixes

### v0.1.2
  - Added support for more then one filter

## Aditional resources

- [Presta Shop web service: Documentation](http://doc.prestashop.com/display/PS16/Using+the+PrestaShop+Web+Service)
- [Presta Shop web service: Tutorial](http://doc.prestashop.com/display/PS16/Web+service+tutorial)
- [Presta Shop web service: Advanced usage](http://doc.prestashop.com/display/PS16/Chapter+8+-+Advanced+use)
- [Presta Shop web service: Image management](http://doc.prestashop.com/display/PS16/Chapter+9+-+Image+management)
- [Presta Shop web service: Reference](http://doc.prestashop.com/display/PS16/Web+service+reference)

## License

MIT © [Samir Kahvedzic](mailto:akirapowered@gmail.com)
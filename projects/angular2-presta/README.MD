# angular2-presta

**Angular2Presta** library will help developers writing **Angular** and **Ionic** applications using **Prestashop Webservice**.

![angular2-presta](https://raw.githubusercontent.com/SKaDiZZ/angular2-presta/master/src/assets/a2plogo.png?raw=true "Logo")

## Installation

To install this library, run:

```bash
$ npm install angular2-presta --save
```

## Enable CORS on your prestashop webservice

If you are woring on Ionic mobile application or if you are working on angular or ionic application and you are using localhost to test you will need to enable CORS on your prestashop webservice by adding required headers in your dispatcher.php file.

Please check video guide I made on youtube:

<div align="center">

[![enable CORS](https://img.youtube.com/vi/s25RURLwnNY/0.jpg)](https://www.youtube.com/embed/s25RURLwnNY)

</div>

### Enable CORS on Apache server

Modify your .htaccess file:

```bash
<IfModule mod_headers.c>
   Header always set Access-Control-Allow-Origin "*"
   Header always set Access-Control-Allow-Headers "Content-Type, Authorization, Io-Format, Accept"
   Header always set Access-Control-Allow-Methods "GET,POST,HEAD,DELETE,PUT,OPTIONS"
</IfModule>

<IfModule mod_rewrite.c>
  # Added a rewrite to respond with a 200 SUCCESS on every OPTIONS request
  RewriteEngine On
  RewriteCond %{REQUEST_METHOD} OPTIONS
  RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

Thanx @amoncusir for contributing this example.

## Using angular2-presta with Ionic 3

Latest version of angular2-presta library is updated to work with Angular versions from Angular 6. Ionic 3 is using Angular 5.2.11 at time of this release. If your project is using Ionic 3 you have to use older version of angular2-presta which supports Angular 5. Ionic 4 applications will work fine with latest version of angular2-presta library.

To install angular2-presta 0.1.14:

```bash
npm install angular2-presta@0.1.14 --save
```

You can find documentation for this version on [NPM](https://www.npmjs.com/package/angular2-presta/v/0.1.14)

I made short video how to use angular2-presta with Ionic :

<div align="center">

[![enable CORS](https://img.youtube.com/vi/_oEzNRGiC2E/0.jpg)](https://www.youtube.com/embed/_oEzNRGiC2E)

</div>

## Bootstrap

Import Angular2PrestaModule and Angular2PrestaConfiguration into your app.module.ts file:

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {
  Angular2PrestaModule,
  Angular2PrestaConfiguration,
} from "angular2-presta";

import { AppComponent } from "./app.component";

const a2pConfig: Angular2PrestaConfiguration = {
  apiKey: "YOUR_PRESTA_API_KEY",
  imageApiKey: "OPTIONAL_IMAGE_API_KEY",
  shopUrl: "https://yourshop.com/api/",
};

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, Angular2PrestaModule.forRoot(a2pConfig)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Angular2PrestaConfiguration

To connect your application with your prestashop website you need to provide **Angular2PrestaService** with configuration. This is done by defining **Angular2PrestaConfiguration** object and passing this object to **Angular2PrestaModule** in imports array.

```typescript
const a2pConfig: Angular2PrestaConfiguration = {
  apiKey: "YOUR_PRESTA_API_KEY", // prestashop webservice API key
  imageApiKey: "OPTIONAL_IMAGE_API_KEY", // images API key
  shopUrl: "https://yourshop.com/api/", // url of your shop : please use https
};
```

## Angular2PrestaService

**Angular2Presta** is actually service library providing methods to call prestashop webservice and return resources based on your query. You can say it is HTTP client for prestaahop webservice.

```typescript
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

// import service and query
import { Angular2PrestaService, Angular2PrestaQuery } from "angular2-presta";

@Component({
  selector: "app-root",
  template: ` <div *ngFor="let product of product$ | async">
    <a2p-image
      [resource]="query.resource"
      [resourceID]="product.id"
      [imageID]="product.id_default_image"
      [size]="'medium'"
    ></a2p-image>
    <h1 [innerHTML]="product.name"></h1>
    <p [innerHTML]="product.description_short"></p>
    <p>{{ product.price | currency }}</p>
    <p></p>
  </div>`,
  styles: [],
})
export class AppComponent implements OnInit {
  // products observable
  product$: Observable<any>;

  query: Angular2PrestaQuery = {
    // define resource products, categories ...
    // check full list http://doc.prestashop.com/display/PS16/Web+service+reference
    resource: "products",
    // return only fields you need
    display: "id,id_default_image,name,price,description_short,condition",
    // filter results
    filter: {
      name: "blouse",
      condition: "new",
    },
    // sort results
    sort: "name_ASC",
    // limit number of results or define range
    limit: "1",
  };

  // Inject Angular2PrestaService
  constructor(private _service: Angular2PrestaService) {}

  ngOnInit() {
    // Use get function provided by Angular2PrestaService
    this.product$ = this._service.get(this.query);
  }
}
```

## Constructing Angular2PrestaQuery

For now only **GET** method is supported, no posting or updating data is available.

| Option       | Type   | Description                                                                                    |
| ------------ | ------ | ---------------------------------------------------------------------------------------------- |
| **resource** | string | Select type of results: products, categories, customers ...                                    |
| **display**  | string | Allows you to limit result fields to only those you need, by default it will return all fields |
| **filter**   | Object | object defining fields and values to filter results by                                         |
| **sort**     | string | sort results by: 'id_ASC', 'id_DESC', 'name_ASC', 'name_DESC' ...                              |
| **limit**    | string | limit number of results, or define range of results '5', '9,5'                                 |
| **search**   | string | search term to use for presta web service search                                               |

### Get product categories

```typescript
query: Angular2PrestaQuery = {
  resource: "categories",
};
```

### Get products by category

```typescript
query: Angular2PrestaQuery = {
  resource: "products",
  filter: {
    id_category_default: "11",
  },
};
```

### Get product by id

```typescript
query: Angular2PrestaQuery = {
  resource: "products",
  filter: {
    id: "1",
  },
};
```

## Using search

Search Query can accept **search** and **resource** fields. By default search will return list of products if no other resource is defined.

```typescript
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

// import service and query
import { Angular2PrestaService, Angular2PrestaQuery } from "angular2-presta";

@Component({
  selector: "app-root",
  template: ` <div *ngFor="let product of product$ | async">
    <a2p-image
      [resource]="query.resource"
      [resourceID]="product.id"
      [imageID]="product.id_default_image"
      [size]="'medium'"
    ></a2p-image>
    <h1 [innerHTML]="product.name"></h1>
    <p [innerHTML]="product.description_short"></p>
    <p>{{ product.price | currency }}</p>
    <p></p>
  </div>`,
  styles: [],
})
export class AppComponent implements OnInit {
  // products observable
  product$: Observable<any>;

  // Search products for dress
  query: Angular2PrestaQuery = {
    resource: "products",
    search: "dress",
  };

  // Inject Angular2PrestaService
  constructor(private _service: Angular2PrestaService) {}

  ngOnInit() {
    // Use search function provided by Angular2PrestaService
    this.product$ = this._service.search(this.query);
  }
}
```

### Search categories

```typescript
query: Angular2PrestaQuery = {
    resource: 'categories'
    search: 'dresses'
  };
```

## Outputing data

Some of prestashop webservice results come with html tags included to remove tags you can use **innerHtml** directive.

```html
<li *ngFor="let product of product$ | async">
  <h1 [innerHTML]="product.name"></h1>
  <p [innerHTML]="product.description_short"></p>
  <p>{{ product.price | currency }}</p>
  <p></p>
</li>
```

## Working with images

Before you try to use images you should generate one special **API KEY**, only with one permission to **GET** images. This is most secure method, because your **API KEY** will be included in every call to fetch image so it could be easily obtained by a third person.

Include your images **API KEY** into **Angular2PrestaConfiguration** object in your **app.module.ts** file:

```typescript
// Add your presta web service api key and shop url
const a2pConfig: Angular2PrestaConfiguration = {
  apiKey: "YOUR_PRESTA_API_KEY",
  imageApiKey: "YOUR_PRESTA_API_KEY", // ApiKey only with images GET permissions for security reasons
  shopUrl: "https://yourshop.com/api/", // Please use https
};
```

You can use **a2p-image** component to output product images. **Angular2PrestaImageComponent** has few inputs. It will use data from them to construct image url to fetch images and display them in your application.

## Angular2PrestaImageComponent

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

Get product images in your html template using **a2p-image** component:

```html
<li *ngFor="let product of product$ | async">
  <!-- use presta-img component to get products default image and display it as large image -->
  <a2p-image
    [resource]="query.resource"
    [resourceID]="product.id"
    [imageID]="product.id_default_image"
    [size]="'medium'"
  ></a2p-image>

  <h1 [innerHTML]="product.name"></h1>
  <p [innerHTML]="product.description_short"></p>
  <p>{{ product.price | currency }}</p>
  <p>
    <!-- get all images for this product and use small image size -->
  </p>

  <ul *ngIf="product.associations.images">
    <li *ngFor="let image of product.associations.images">
      <a2p-image
        [resource]="query.resource"
        [resourceID]="product.id"
        [imageID]="product.id"
        [size]="'small'"
      ></a2p-image>
    </li>
  </ul>
</li>
```

Get images for other resources using presta-image component

```html
<!-- get category image passing category id -->
<a2p-image [resource]="'categories'" [resourceID]="10"></a2p-image>

<!-- get store image passing store id -->
<a2p-image [resource]="'stores'" [resourceID]="1"></a2p-image>

<!-- get supplier image passing supplier id -->
<a2p-image [resource]="'suppliers'" [resourceID]="1"></a2p-image>

<!-- get manufacturers image passing manufacturer id -->
<a2p-image [resource]="'manufacturers'" [resourceID]="1"></a2p-image>
```

## Delete resource

```typescript
export class AppComponent implements OnInit {
  // Inject Angular2PrestaService
  constructor(private _service: Angular2PrestaService) {}

  deleteProduct(productId: number) {
    // Delete resource
    this._service.delete("products", productId).subscribe();
  }
}
```

## Roadmap

- [x] GET requests, filtering, sorting
- [x] SEARCH support
- [x] IMAGES support
- [ ] POST requests
- [ ] UPDATE requests
- [x] DELETE requests

## Changelog

### v0.1.25

- Updated to Angular 12
- Security fixes for packages

### v0.1.23

- Updated NPM dependencies
- Security fixes

### v0.1.22

- Delete added to angular2-presta service, now you can delete resources by passing resource name and resource id
- Updated NPM dependencies
- Security fixes

### v0.1.21

- Security update

### v0.1.20

- Updated dependencies to support Angular 8

### v0.1.19

- Updated documentation
- Updated dependencies to latest version
- Fixed few security issuess reported by npm audit

### v0.1.18

- Updated documentation with directions for Ionic and Angular 5 users

### v0.1.17

- More examples added
- Fixed incorrect description on npm website

### v0.1.16

- Renamed service, components and interfaces to match Angular naming conventions
- Added catchError support in service
- Updated and fixed documentation

### v0.1.15

- Fixed few security issues
- Upgraded to support Angular 6
- Updated readme examples

### v0.1.14

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

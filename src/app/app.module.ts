import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Angular2PrestaModule, Angular2PrestaConfiguration } from 'angular2-presta';

import { AppComponent } from './app.component';

const a2pConfig: Angular2PrestaConfiguration = {
  apiKey: '',
  imageApiKey: '',
  shopUrl: ''
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Angular2PrestaModule.forRoot(a2pConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

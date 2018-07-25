import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Angular2PrestaModule, Angular2PrestaConfiguration } from 'angular2-presta';

import { AppComponent } from './app.component';

const a2pConfig: Angular2PrestaConfiguration = {
  apiKey: 'Y9RJG1CFB28JRPP6YGUPQV53SDCCV61P',
  imageApiKey: 'LKDHFPDSW6F1KKZ2V6BKZ9QWN4775UKB',
  shopUrl: 'https://presta.virtuooza.com/api/'
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

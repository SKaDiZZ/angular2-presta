import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Angular2PrestaConfiguration } from './angular2-presta.configuration';
import { Angular2PrestaImageComponent } from './angular2-presta-image.component';
import { Angular2PrestaService } from './angular2-presta.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [Angular2PrestaImageComponent],
  exports: [Angular2PrestaImageComponent]
})
export class Angular2PrestaModule {
  static forRoot(prestaConfiguration: Angular2PrestaConfiguration): ModuleWithProviders {
    return {
      ngModule: Angular2PrestaModule,
      providers: [
        Angular2PrestaService,
        {provide: 'prestaConfiguration', useValue: prestaConfiguration}
      ]
    };
  }
}

import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { PrestaConfiguration } from './presta.configuration';
import { PrestaService } from './presta.service';
import { PrestaImageComponent } from './presta.image.component';

export * from './presta.configuration';
export * from './presta.query';
export * from './presta.image.size';
export * from './presta.service';
export * from './presta.image.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PrestaImageComponent
  ],
  exports: [
    PrestaImageComponent
  ]
})
export class PrestaModule {
  static forRoot(prestaConfiguration: PrestaConfiguration): ModuleWithProviders {
    return {
      ngModule: PrestaModule,
      providers: [
        PrestaService,
        {provide: 'prestaConfiguration', useValue: prestaConfiguration}
      ]
    };
  }
}

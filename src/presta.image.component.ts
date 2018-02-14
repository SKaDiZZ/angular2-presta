import { Component, OnInit, Input } from '@angular/core';
import { PrestaService } from './presta.service';
import { PrestaImageSize } from './presta.image.size';

@Component({
  selector: 'presta-image',
  template: `<img class="presta-image" [src]="image" />`
})
export class PrestaImageComponent implements OnInit {

  image: any;

  @Input() resource: string;
  @Input() resourceID: number;
  @Input() imageID?: number;
  @Input() size?: string;

  constructor(private _prestaService: PrestaService) {}

  ngOnInit() {

    this.image = this._prestaService.getProductImage(this.resource, this.resourceID, this.imageID, this.size);

  }

}

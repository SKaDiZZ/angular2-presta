import { Component, OnInit, Input } from '@angular/core';
import { Angular2PrestaService } from './angular2-presta.service';

@Component({
  selector: 'a2p-image',
  template: `<img class="presta-image" [src]="image" />`,
  styles: []
})
export class Angular2PrestaImageComponent implements OnInit {

  @Input() resource: string;
  @Input() resourceID: number;
  @Input() imageID?: number;
  @Input() size?: string;

  image: string;

  constructor(private _a2ps: Angular2PrestaService) { }

  ngOnInit() {
    this.image = this._a2ps.getImage(this.resource, this.resourceID, this.imageID, this.size);
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Angular2PrestaImageComponent } from './angular2-presta-image.component';

describe('Angular2PrestaImageComponent', () => {
  let component: Angular2PrestaImageComponent;
  let fixture: ComponentFixture<Angular2PrestaImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Angular2PrestaImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Angular2PrestaImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

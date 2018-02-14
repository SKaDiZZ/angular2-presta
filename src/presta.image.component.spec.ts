import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Presta.ImageComponent } from './presta.image.component';

describe('Presta.ImageComponent', () => {
  let component: Presta.ImageComponent;
  let fixture: ComponentFixture<Presta.ImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Presta.ImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Presta.ImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
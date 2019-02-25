import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgContentSettingsComponent } from './svg-content-settings.component';

describe('SvgContentSettingsComponent', () => {
  let component: SvgContentSettingsComponent;
  let fixture: ComponentFixture<SvgContentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgContentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgContentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

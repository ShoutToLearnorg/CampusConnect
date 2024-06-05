import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllusersPage } from './allusers.page';

describe('AllusersPage', () => {
  let component: AllusersPage;
  let fixture: ComponentFixture<AllusersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllusersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

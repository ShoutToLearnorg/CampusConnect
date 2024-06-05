import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDataPage } from './user-data.page';

describe('UserDataPage', () => {
  let component: UserDataPage;
  let fixture: ComponentFixture<UserDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

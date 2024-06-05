import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMessagePage } from './send-message.page';

describe('SendMessagePage', () => {
  let component: SendMessagePage;
  let fixture: ComponentFixture<SendMessagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

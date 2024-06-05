// custom-tab-bar.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-tab-bar',
  templateUrl: './custom-tab-bar.component.html',
  styleUrls: ['./custom-tab-bar.component.scss'],
})
export class CustomTabBarComponent {
  @Output() tabSelected: EventEmitter<string> = new EventEmitter<string>();
  activeTab: string = 'home';

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabSelected.emit(tab);
  }
}

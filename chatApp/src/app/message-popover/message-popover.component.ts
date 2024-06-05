import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-popover',
  templateUrl: './message-popover.component.html',
  styleUrls: ['./message-popover.component.scss'],
})
export class MessagePopoverComponent {
  @Input() message: any;
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component'; // Import the Comments Modal

import { CommunityPage } from './community.page';
import { RelativeDatePipe } from '../pipe/relative-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule
  ],
  declarations: [CommunityPage,CommentsModalComponent,RelativeDatePipe],
})
export class CommunityPageModule {}

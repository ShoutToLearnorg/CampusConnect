import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllusersPageRoutingModule } from './allusers-routing.module';

import { AllusersPage } from './allusers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllusersPageRoutingModule
  ],
  declarations: [AllusersPage]
})
export class AllusersPageModule {}

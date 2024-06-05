import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDataPage } from './user-data.page';

const routes: Routes = [
  {
    path: '',
    component: UserDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDataPageRoutingModule {}

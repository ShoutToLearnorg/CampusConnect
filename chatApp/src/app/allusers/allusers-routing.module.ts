import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllusersPage } from './allusers.page';

const routes: Routes = [
  {
    path: '',
    component: AllusersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllusersPageRoutingModule {}

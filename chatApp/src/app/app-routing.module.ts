import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth-guard.service';
import { LoginGuard } from '../../services/login.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard, LoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'allusers',
    loadChildren: () => import('./allusers/allusers.module').then(m => m.AllusersPageModule),
    canActivate: [AuthGuard, LoginGuard]
  },
  {
    path: 'send-message/:username',
    loadChildren: () => import('./send-message/send-message.module').then(m => m.SendMessagePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },

  {
    path: 'community',
    loadChildren: () => import('./community/community.module').then( m => m.CommunityPageModule),
    canActivate: [AuthGuard]
  },
  

  {
    path: ':username',
    loadChildren: () => import('./user-data/user-data.module').then(m => m.UserDataPageModule),
  },
  
  

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

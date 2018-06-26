import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { UsersViewComponent } from './users-view/users-view.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersCreateComponent } from './users-create/users-create.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    MatListModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule.forChild([
      { path: '', component: UsersViewComponent,  children: [
        { path: '', pathMatch: 'full', redirectTo: 'list'},
        { path: 'list', pathMatch: 'full', component: UsersListComponent },
        { path: 'new', pathMatch: 'full', component: UsersCreateComponent }
      ]},

    ])
  ],
  declarations: [UsersViewComponent, UsersListComponent, UsersCreateComponent]
})
export class IotUsersModule { }

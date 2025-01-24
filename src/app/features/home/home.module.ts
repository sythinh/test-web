import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { HomeRoutingModule } from './home-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './component/home.component';
import { HomeDialogComponent } from './component/home-dialog/home-dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeDialogComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatToolbarModule,
    RouterModule.forChild([
        { path: '', component: HomeComponent }
    ])
  ]
})
export class HomeModule { }
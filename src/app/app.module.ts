import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth/auth.service';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { Ng2Webstorage } from 'ngx-webstorage';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, //fix this in chapter 10
    Ng2Webstorage
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

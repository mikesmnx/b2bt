import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { AppTableComponent } from './components/app-table/app-table.component';
import { PseudoSocketService } from './services/pseudo-socket.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AppSettingsComponent,
    AppTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [PseudoSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

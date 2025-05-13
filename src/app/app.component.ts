import { Component, inject, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EditModelComponent } from './shared-components/edit-model.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'day-hotel';
  constructor() {
    setInterval(() => {
      window.location.reload();
    }, 3600000); // 1 hour = 3600000 milliseconds
  }
}

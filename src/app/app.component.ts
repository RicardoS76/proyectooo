// app.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarLateralComponent } from './navbar-lateral/navbar-lateral.component';
import { NgIf } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavbar = true;

  constructor(private router: Router, private auth: AuthService) {

    this.router.events.subscribe(() => {
      this.showNavbar = !this.router.url.includes('login');
    });
    this.auth.restoreSession();
  }
}

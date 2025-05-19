import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(FormsModule)],
});

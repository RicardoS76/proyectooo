import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes  } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';


export const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes ),
    provideClientHydration(),
  ],
};

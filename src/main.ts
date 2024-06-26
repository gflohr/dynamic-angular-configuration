import { bootstrapApplication } from '@angular/platform-browser';
import { createAppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

createAppConfig(location)
	.then(appConfig => bootstrapApplication(AppComponent, appConfig))
	.catch(err => console.error(err));

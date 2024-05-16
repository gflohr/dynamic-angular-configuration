import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CONFIGURATION, Configuration } from './configuration';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	description: string;
	answer: number;

	constructor(
		@Inject(CONFIGURATION)
		private configuration: Configuration,
	) {
		this.description = this.configuration.description;
		this.answer = this.configuration.answers?.all as number;
	}
}

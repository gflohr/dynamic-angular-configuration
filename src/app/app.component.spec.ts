import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CONFIGURATION, Configuration } from './configuration';

const configuration: Configuration = {
	production: false,
	description: 'This is a test bed.',
	answers: {
		all: 2304,
	},
};

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [{ provide: CONFIGURATION, useValue: configuration }],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it('should render title', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toBe(
			'Dynamic Angular Configuration',
		);
	});

	it('should render a description', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('#description')?.textContent).toBe(
			configuration.description,
		);
	});

	it('should give the answer to the ultimate question of life, the universe, and everything', () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		const pattern = new RegExp(` ${configuration.answers?.all}\.\n$`);
		expect(compiled.querySelector('#answer')?.textContent).toMatch(pattern);
	});
});

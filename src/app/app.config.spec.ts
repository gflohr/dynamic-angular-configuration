import { TestBed } from '@angular/core/testing';
import { createAppConfig, parseConfiguration } from './app.config';
import { Configuration } from './configuration';

const devConfiguration: Configuration = {
	production: false,
	description: 'This is a dev test bed!',
};

const prodConfiguration: Configuration = {
	production: true,
	description: 'This is a prod test bed!',
};

const location = new URL('http://localhost') as unknown as Location;

describe('createAppConfig', () => {
	let fetchSpy: jasmine.Spy<
		((
			input: RequestInfo | URL,
			init?: RequestInit | undefined,
		) => Promise<Response>) & {
			(
				input: RequestInfo | URL,
				init?: RequestInit | undefined,
			): Promise<Response>;
			(
				input: string | Request | URL,
				init?: RequestInit | undefined,
			): Promise<Response>;
		}
	>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
		}).compileComponents();
		fetchSpy = spyOn(window, 'fetch');
	});

	afterEach(() => {
		fetchSpy.calls.reset();
	});

	it('should create an ApplicationConfig', async () => {
		const response = new Response(JSON.stringify(devConfiguration));
		fetchSpy.and.resolveTo(response);

		const appConfig = await createAppConfig(location);
		expect(appConfig).toBeDefined();
	});

	it('should select /assets/config.dev.json on dev', async () => {
		location.hostname = 'localhost';

		const response = new Response(JSON.stringify(devConfiguration));
		fetchSpy.and.resolveTo(response);

		await createAppConfig(location);
		expect(window.fetch).toHaveBeenCalledWith('./assets/config.dev.json');
	});

	it('should select /assets/config.prod.json on prod', async () => {
		location.hostname = 'www.example.com';

		const response = new Response(JSON.stringify(prodConfiguration));
		fetchSpy.and.resolveTo(response);

		await createAppConfig(location);
		expect(window.fetch).toHaveBeenCalledWith('./assets/config.prod.json');
	});

	it('should fill the configuration with defaults', () => {
		const configuration = parseConfiguration(devConfiguration);

		expect(configuration).toBeDefined();

		expect(
			Object.prototype.hasOwnProperty.call(configuration, 'answers'),
		).toBeTrue();
		expect(configuration.answers).toEqual(jasmine.any(Object));
		expect(
			Object.prototype.hasOwnProperty.call(configuration.answers, 'all'),
		).toBeTrue();
		expect(configuration.answers?.all).toEqual(jasmine.any(Number));
	});

	it('should reject invalid configurations', () => {
		const invalid = {
			production: false,
			// Too short.
			description: 'foo',
			// Not an email address.
			email: 'me at home',
			answers: {
				// Must be a positive number.
				all: 0,
			},
		};

		const consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
		expect(() => parseConfiguration(invalid)).toThrow();
		expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
		consoleErrorSpy.and.callThrough();
	});
});

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import * as v from 'valibot';

import { routes } from './app.routes';
import {
	CONFIGURATION,
	Configuration,
	ConfigurationSchema,
} from './configuration';

export const createAppConfig = async (
	location: Location,
): Promise<ApplicationConfig> => {
	const configurationPath = locateConfiguration(location);
	const response = await fetch(configurationPath);
	const json = await response.json();
	const configuration = parseConfiguration(json);

	return {
		providers: [
			{ provide: CONFIGURATION, useValue: configuration },
			provideRouter(routes),
		],
	};
};

const locateConfiguration = (location: Location): string => {
	console.log(`location.hostname is ${location.hostname}`);
	if (location.hostname === 'localhost') {
		return './assets/config.dev.json';
	} else {
		return './assets/config.prod.json';
	}
};

export const parseConfiguration = (configuration: unknown): Configuration => {
	try {
		return v.parse(ConfigurationSchema, configuration);
	} catch (e) {
		const v = e as v.ValiError;
		const issues = v.issues;
		console.error('Configuration error(s):');
		for (const issue of issues) {
			const path =
				issue.path?.map((segment: any) => segment.key).join('.') ??
				'[path not set]';
			console.error(`  error: ${path}: ${issue.message}`);
		}
		throw new Error('Application not started!');
	}
};

import * as v from 'valibot';
import { InjectionToken } from '@angular/core';

export const ConfigurationSchema = v.object({
	production: v.boolean(),
	description: v.string([v.minLength(5)]),
	email: v.optional(v.string([v.email()])),
	answers: v.optional(
		v.object({
			all: v.optional(v.number([v.minValue(1)]), 42),
		}),
		{},
	),
});

export type Configuration = v.Input<typeof ConfigurationSchema>;

export const CONFIGURATION = new InjectionToken<Configuration>('Configuration');

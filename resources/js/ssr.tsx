import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import ReactDOMServer from "react-dom/server";
import { RouteName } from "ziggy-js";
import { route } from "../../vendor/tightenco/ziggy/src/js";

import { ThemeProvider } from "@/providers/theme";

import RootLayout from "@/layouts/root-layout";

import { Toaster } from "@/components/ui/sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createServer((page) =>
	createInertiaApp({
		page,
		render: ReactDOMServer.renderToString,
		title: (title) => `${title} - ${appName}`,
		resolve: (name) =>
			resolvePageComponent(
				`./routes/${name}.tsx`,
				import.meta.glob("./routes/**/*.tsx"),
			),
		setup: ({ App, props }) => {
			/* eslint-disable */
			// @ts-expect-error
			global.route<RouteName> = (name, params, absolute) =>
				route(name, params as any, absolute, {
					...page.props.ziggy,
					location: new URL(page.props.ziggy.location),
				});
			/* eslint-enable */

			return (
				<ThemeProvider>
					<RootLayout>
						<App {...props} />
					</RootLayout>
					<Toaster />
				</ThemeProvider>
			);
		},
	}),
);

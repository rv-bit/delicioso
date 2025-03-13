import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { RouteName } from "ziggy-js";
import { route } from "../../vendor/tightenco/ziggy/src/js";

import { Toaster } from "@/components/ui/sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const ssrPort = import.meta.env.VITE_SSR_PORT || 13714; // Add this line

console.log("Starting SSR server on port", ssrPort);

createServer(
	(page) =>
		createInertiaApp({
			page,
			render: ReactDOMServer.renderToString,
			title: (title) => `${title} - ${appName}`,
			resolve: (name) => resolvePageComponent(`./routes/${name}.tsx`, import.meta.glob("./routes/**/*.tsx")),
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
					<React.Fragment>
						<App {...props} />
						<Toaster />
					</React.Fragment>
				);
			},
		}),
	ssrPort,
);

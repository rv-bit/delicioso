import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./routes/${name}.tsx`, import.meta.glob("./routes/**/*.tsx")),
	setup({ el, App, props }) {
		if (import.meta.env.SSR) {
			hydrateRoot(
				el,
				<React.Fragment>
					<App {...props} />
					<Toaster />
				</React.Fragment>,
			);
			return;
		}

		createRoot(el).render(
			<React.Fragment>
				<App {...props} />
				<Toaster />
			</React.Fragment>,
		);
	},
	progress: {
		color: "#4B5563",
	},
});

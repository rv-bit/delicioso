import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./routes/${name}.tsx`, import.meta.glob("./routes/**/*.tsx")),
	setup({ el, App, props }) {
		const appFragment = (
			<React.Fragment>
				<QueryClientProvider client={queryClient}>
					<App {...props} />
					<Toaster />
				</QueryClientProvider>
			</React.Fragment>
		);

		if (import.meta.env.SSR) {
			hydrateRoot(el, appFragment);
			return;
		}

		createRoot(el).render(appFragment);
	},
	progress: {
		color: "#4B5563",
	},
});

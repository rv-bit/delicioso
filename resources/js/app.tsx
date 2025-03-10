import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";

import { ThemeProvider } from "@/providers/theme";

import RootLayout from "@/layouts/root-layout";

import { Toaster } from "@/components/ui/sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) =>
		resolvePageComponent(
			`./routes/${name}.tsx`,
			import.meta.glob("./routes/**/*.tsx"),
		),
	setup({ el, App, props }) {
		if (import.meta.env.SSR) {
			hydrateRoot(el, <App {...props} />);
			return;
		}

		createRoot(el).render(
			<ThemeProvider>
				<RootLayout
					auth={props.initialPage.props.auth}
					ziggy={props.initialPage.props.ziggy}
				>
					<App {...props} />
				</RootLayout>
				<Toaster />
			</ThemeProvider>,
		);
	},
	progress: {
		color: "#4B5563",
	},
});

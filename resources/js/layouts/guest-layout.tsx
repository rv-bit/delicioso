import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

import { APP_NAME } from "@/lib/constants";

export default function Guest({ children }: PropsWithChildren) {
	return (
		<main
			style={{
				height: "100svh",
				width: "100%",
				flex: "1 1 0%",
				overflowY: "auto",
				overflowX: "hidden",
			}}
			className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
		>
			<Link href="/" name="homepage" aria-label="Go To Homepage" className="font-bricolage text-3xl font-semibold -tracking-wide lowercase italic">
				{APP_NAME}
			</Link>

			<div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">{children}</div>
		</main>
	);
}

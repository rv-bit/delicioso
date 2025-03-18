import { Head } from "@inertiajs/react";

import RootLayout from "@/layouts/root-layout";

export default function Collections({ category }: { category: string }) {
	console.log(category);

	return (
		<RootLayout footer={true}>
			<Head title="Collections" />

			<section id="main-section" className="mx-auto flex max-w-7xl flex-col gap-2 px-2"></section>
		</RootLayout>
	);
}

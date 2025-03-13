import { Head } from "@inertiajs/react";

import RootLayout from "@/layouts/root-layout";

import MainSection from "./components/main-section";
import TabsSection from "./components/tabs-section";

export default function Welcome({ tabsSectionData }: { tabsSectionData: Array<{ title: string; img: string; imgPreview: string; href?: string }> }) {
	return (
		<RootLayout footer={true}>
			<Head title="Welcome" />

			<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
				<MainSection />
				<TabsSection data={tabsSectionData} />
			</div>
		</RootLayout>
	);
}

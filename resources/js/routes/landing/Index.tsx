import { Head } from "@inertiajs/react";

import RootLayout from "@/layouts/root-layout";

import BestSellersSection from "./components/best-sellers";
import JournalSection from "./components/journal-section";
import MainSection from "./components/main-section";
import TabsSection from "./components/tabs-section";

export default function Welcome({ tabsSectionCategories }: { tabsSectionCategories: Array<{ title: string; img: string; imgPreview: string; href?: string }> }) {
	return (
		<RootLayout footer={true}>
			<Head title="Welcome" />

			<section id="main-section" className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
				<MainSection />
				<TabsSection categories={tabsSectionCategories} />
			</section>

			<JournalSection />
			<BestSellersSection />
		</RootLayout>
	);
}

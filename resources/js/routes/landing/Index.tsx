import { Head } from "@inertiajs/react";
import React from "react";

import RootLayout from "@/layouts/root-layout";

import BestSellersSection from "./components/best-sellers";
import CategorySection from "./components/category-section";
import JournalSection from "./components/journal-section";

const metadata = {
	headline: "Fresh, Artisanal, Irresistible...",
	description:
		"Browse our delicious range of cakes and discover refreshing NEW flavours you'll love! Choose from zesty lemon Cake au Citron, our popular Pistachio cake, delicate Blackcurrant Mousse cake, and Carrot cake adorned with cream cheese icing and pecans, to brighten up your next occasion.",
	descriptionContinued: "Place an order on our website by 12 noon and one of our freshly made cakes will be yours to enjoy the following day. Be sure to order in advance for Mother's Day too!",
};

export default function Welcome({ tabsSectionCategories }: { tabsSectionCategories: Array<{ title: string; img: string; imgPreview: string; href?: string }> }) {
	const [loadedBanner, setLoadedBanner] = React.useState(false);

	return (
		<RootLayout footer={true}>
			<Head title="Welcome" />

			<section id="main-section" className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
				<span className="flex flex-col items-center justify-center gap-2">
					<div className="relative h-full min-h-[31.2rem] w-full overflow-hidden rounded-xs">
						{!loadedBanner && (
							<div className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-gray-200">
								<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
									<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
								</svg>
							</div>
						)}

						<img
							src="/media/landing/banner/banner-2000.webp"
							srcSet="/media/landing/banner/banner-2000.webp 1025w, /media/landing/banner/banner-1024.webp 1024w, /media/landing/banner/banner-768.webp 768w, /media/landing/banner/banner-640.webp 640w"
							sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1025px"
							alt="Cake Banner"
							onLoad={() => {
								requestAnimationFrame(() => {
									setLoadedBanner(true);
								});
							}}
							className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300 ${loadedBanner ? "opacity-100" : "opacity-0"}`}
						/>
					</div>

					<span className="mt-5 flex flex-col items-center gap-2">
						<h1 className="font-prata text-center text-5xl font-medium italic">{metadata.headline}</h1>
						<hr className="h-4 w-1/4 rounded-md border-t-3 border-black/80" />
						<p className="text-muted-foreground text-center">
							{metadata.description}
							<br />
							{metadata.descriptionContinued}
						</p>
					</span>
				</span>

				<CategorySection categories={tabsSectionCategories} />
			</section>

			<JournalSection />
			<BestSellersSection />
		</RootLayout>
	);
}

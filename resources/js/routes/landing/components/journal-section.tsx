import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Link } from "@inertiajs/react";
import React from "react";

const metadata = {
	// this will come from the front end, by the latest journal, and take the heading / title and description of the journal
	headline: "Wheat Project Diaries Chapter 4: The Baker's Touch",
	description: `The final chapter in our Wheat Project diaries – through which we’ve looked at our initiative to bake with more organically farmed heritage grains from the perspectives of our farmers and miller – concludes with how the baker’s role translates all the care taken in the fields into healthy,nutritious and flavorful loaves…`,
};

export default function JournalSection() {
	const isTablet = useMediaQuery("(max-width: 990px)");

	const [loadedBanner, setLoadedBanner] = React.useState(false);

	if (isTablet) {
		return (
			<section id="journal-section-mobile" className="mx-auto mt-10 flex w-full flex-col items-center justify-start gap-2">
				<span className="w-full px-2">
					<h1 className="text-left text-3xl uppercase">Journal</h1>
				</span>

				<div className="relative h-full min-h-[25rem] w-full">
					<div className="absolute z-10 h-full w-full overflow-hidden rounded-xs">
						<picture>
							{!loadedBanner && (
								<div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200">
									<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
										<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
									</svg>
								</div>
							)}

							<source srcSet="/media/landing/section-journal/journal-640.webp" media="(max-width: 640px)" />
							<source srcSet="/media/landing/section-journal/journal-768.webp" media="(max-width: 768px)" />
							<source srcSet="/media/landing/section-journal/journal-1024.webp" media="(max-width: 1024px)" />

							<img
								alt="Journal"
								src="/media/landing/section-journal/journal-1266.webp"
								loading="lazy"
								className="absolute inset-0 h-full w-full object-cover"
								onLoad={(e) => {
									requestAnimationFrame(() => {
										setLoadedBanner(true);
									});
								}}
							/>
						</picture>
					</div>
				</div>

				<div className="flex size-full items-start justify-start">
					<div className="flex h-fit w-full flex-col items-start justify-start gap-2 overflow-hidden rounded-xs bg-gray-100 p-4">
						<div className="flex h-full w-full flex-col items-start justify-start gap-2">
							<h2 className="text-left text-5xl tracking-wide">{metadata.headline}</h2>
							<p className="text-md text-left">{metadata.description}</p>
						</div>

						<Link href="/" className="size-full">
							<Button className="group border-tequila-200 bg-rajah-200 hover:bg-rajah-200 hover:inset-ring-rajah-200 relative size-auto w-1/2 overflow-hidden rounded-none border-2 p-3 py-3.5 inset-ring-2 inset-ring-black/30 transition-shadow delay-75 duration-300">
								<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
								<span className="font-bold text-black uppercase">Read More</span>
							</Button>
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="journal-section" className="mx-auto mt-10 flex w-full flex-col items-center justify-start gap-2">
			<span className="w-full max-w-7xl px-2">
				<h1 className="text-left text-3xl uppercase">Journal</h1>
			</span>
			<div className="relative h-full min-h-[35rem] w-full">
				<div className="absolute z-10 h-full w-full overflow-hidden rounded-xs">
					<picture>
						{!loadedBanner && (
							<div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200">
								<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
									<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
								</svg>
							</div>
						)}

						<source srcSet="/media/landing/section-journal/journal-640.webp" media="(max-width: 640px)" />
						<source srcSet="/media/landing/section-journal/journal-768.webp" media="(max-width: 768px)" />
						<source srcSet="/media/landing/section-journal/journal-1024.webp" media="(max-width: 1024px)" />

						<img
							alt="Journal"
							src="/media/landing/section-journal/journal-1266.webp"
							loading="lazy"
							className="absolute inset-0 h-full w-full object-cover"
							onLoad={(e) => {
								requestAnimationFrame(() => {
									setLoadedBanner(true);
								});
							}}
						/>
					</picture>
				</div>

				<div className="absolute z-20 flex size-full items-start justify-start p-10">
					<div className="flex h-fit w-2/6 max-w-11/12 min-w-[27rem] flex-col items-start justify-start gap-2 overflow-hidden rounded-xs bg-gray-100 p-4 shadow-lg shadow-black">
						<div className="flex h-full w-full flex-col items-start justify-start gap-2">
							<h2 className="text-left text-5xl tracking-wide">{metadata.headline}</h2>
							<p className="text-md text-left">{metadata.description}</p>
						</div>

						<Link href="/" className="size-full">
							<Button className="group border-tequila-200 bg-rajah-200 hover:bg-rajah-200 hover:inset-ring-rajah-200 relative size-auto w-1/2 overflow-hidden rounded-none border-2 p-3 py-3.5 inset-ring-2 inset-ring-black/30 transition-shadow delay-75 duration-300">
								<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
								<span className="font-bold text-black uppercase">Read More</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

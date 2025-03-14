import { motion } from "framer-motion";
import React from "react";

const metadata = {
	headline: "Fresh, Artisanal, Irresistible...",
	description:
		"Browse our delicious range of cakes and discover refreshing NEW flavours you'll love! Choose from zesty lemon Cake au Citron, our popular Pistachio cake, delicate Blackcurrant Mousse cake, and Carrot cake adorned with cream cheese icing and pecans, to brighten up your next occasion.",
	descriptionContinued: "Place an order on our website by 12 noon and one of our freshly made cakes will be yours to enjoy the following day. Be sure to order in advance for Mother's Day too!",
};

export default function MainSection() {
	const [loadedBanner, setLoadedBanner] = React.useState(false);

	const headline = metadata.headline;
	const words = headline.split(" ");

	return (
		<span className="flex flex-col items-center justify-center gap-2">
			<div className="relative h-full min-h-[31.2rem] w-full overflow-hidden rounded-xs">
				<picture>
					{!loadedBanner && (
						<div className="absolute inset-0 z-30 flex h-full w-full items-center justify-center bg-gray-200">
							<svg className="size-20 animate-pulse text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
								<path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
							</svg>
						</div>
					)}

					<source srcSet="/media/landing/banner/banner-640.webp" media="(max-width: 640px)" />
					<source srcSet="/media/landing/banner/banner-768.webp" media="(max-width: 768px)" />
					<source srcSet="/media/landing/banner/banner-1024.webp" media="(max-width: 1024px)" />

					<img
						src="/media/landing/banner/banner-2000.webp"
						className={`absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300 ${loadedBanner ? "opacity-100" : "opacity-0"}`}
						alt="Cake Banner"
						loading="lazy"
						onLoad={() => {
							requestAnimationFrame(() => {
								setLoadedBanner(true);
							});
						}}
					/>
				</picture>
			</div>

			<span className="mt-5 flex flex-col items-center gap-2">
				<span className="flex flex-wrap items-center justify-center space-x-3">
					{words.map((word, index) => (
						<motion.h1
							initial={{ filter: "blur(15px)", opacity: 0, y: 5 }}
							animate={{ filter: "blur(0)", opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 * index }}
							key={index}
							className="font-prata text-5xl font-medium italic"
						>
							{word}
						</motion.h1>
					))}
				</span>
				<hr className="h-4 w-1/4 rounded-md border-t-3 border-black/80" />
				<p className="text-muted-foreground text-center">
					Browse our delicious range of cakes and discover refreshing NEW flavours you'll love! Choose from zesty lemon Cake au Citron, our popular Pistachio cake, delicate Blackcurrant
					Mousse cake, and Carrot cake adorned with cream cheese icing and pecans, to brighten up your next occasion.
				</p>
				<p className="text-center"></p>
				<p className="text-muted-foreground text-center">
					Place an order on our website by 12 noon and one of our freshly made cakes will be yours to enjoy the following day. Be sure to order in advance for Mother's Day too!
				</p>
			</span>
		</span>
	);
}

import { motion } from "framer-motion";

const metadata = {
	headline: "Fresh, Artisanal, Irresistible...",
	description:
		"Browse our delicious range of cakes and discover refreshing NEW flavours you'll love! Choose from zesty lemon Cake au Citron, our popular Pistachio cake, delicate Blackcurrant Mousse cake, and Carrot cake adorned with cream cheese icing and pecans, to brighten up your next occasion.",
	descriptionContinued: "Place an order on our website by 12 noon and one of our freshly made cakes will be yours to enjoy the following day. Be sure to order in advance for Mother's Day too!",
};

export default function MainSection() {
	const headline = metadata.headline;
	const words = headline.split(" ");

	return (
		<span className="flex flex-col items-center justify-center gap-2">
			<img src="/media/landing/Cake_Banner_Mar_2025.webp" alt="" className="object-cover" loading="lazy" />

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

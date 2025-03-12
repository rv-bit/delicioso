import { Link } from "@inertiajs/react";
import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import InputFocus from "./ui/input-anim";

import { AmexIcon, AppleIcon, MasterIcon, PaypalIcon, VisaIcon } from "./icons/payments";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "./icons/socials";

const metadata = [
	{
		title: "Explore",
		children: [
			{ title: "About Us", route: "/about" },
			{ title: "Contact Us", route: "/contact" },
			{ title: "Careers", route: "/careers" },
		],
	},
	{
		title: "Cakes",
		children: [
			{ title: "Wedding Cakes", route: "/wedding-cakes" },
			{ title: "Birthday Cakes", route: "/birthday-cakes" },
			{ title: "Custom Cakes", route: "/custom-cakes" },
		],
	},
	{
		title: "Company",
		children: [
			{ title: "Our Story", route: "/our-story" },
			{ title: "Blog", route: "/blog" },
			{ title: "Press", route: "/press" },
		],
	},
	{
		title: "Customer",
		children: [
			{ title: "Contact Information", route: "/contact-information" },
			{ title: "My Account", route: "/login" },
			{ title: "FAQ", route: "/faq" },
			{ title: "Privacy Policy", route: "/privacy-policy" },
			{ title: "Terms of Service", route: "/terms-of-service" },
			{ title: "Cookie Policy", route: "/cookie-policy" },
			{ title: "Shipping", route: "/shipping" },
			{ title: "Returns", route: "/returns" },
		],
	},
];

export default function Footer() {
	const isTablet = useMediaQuery("(max-width: 990px)");

	const [newsLetterData, setNewsLetterData] = React.useState<string>();

	if (isTablet) {
		return (
			<footer
				style={{
					height: "auto",
					width: "100%",
					flex: "1 1 0%",
				}}
				className="border-border border-t bg-[#1B1B1B]"
			>
				<div className="mx-auto flex max-w-7xl p-10 pb-5">
					<span className="flex w-full flex-col items-start gap-10">
						<Accordion type="single" collapsible className="w-full">
							{metadata.map((item, index) => (
								<AccordionItem key={index} value={item.title} className="border-border/25 hover:text-white">
									<AccordionTrigger className="pb-2">
										<h1 className="text-2xl font-semibold tracking-tight text-white">{item.title}</h1>
									</AccordionTrigger>

									<AccordionContent>
										<ul className="flex flex-col gap-1">
											{item.children.map((child, index) => (
												<li key={index}>
													<Link href={child.route} className="text-primary-foreground text-md tracking-tight">
														{child.title}
													</Link>
												</li>
											))}
										</ul>
									</AccordionContent>
								</AccordionItem>
							))}

							<AccordionItem value="Join our news letter" className="border-border/25 hover:text-white">
								<AccordionTrigger className="pb-2">
									<h1 className="text-2xl font-semibold tracking-tight text-white">Join our news letter</h1>
								</AccordionTrigger>

								<AccordionContent>
									<span className="flex flex-col gap-2">
										<p className="text-muted-foreground text-sm">Get the latest news and updates from us.</p>

										<InputFocus
											id="email"
											type="email"
											name="Email"
											value={newsLetterData}
											onChange={(e) => setNewsLetterData(e.target.value)}
											className="rounded-none border-white/60 px-3 py-7.5 pb-5 text-white"
											labelClassName="text-white"
										/>

										<Button className="group border-tequila-200 bg-rajah-200 hover:bg-rajah-200 hover:inset-ring-rajah-200 relative w-full overflow-hidden rounded-none border-2 px-3 py-6 inset-ring-2 inset-ring-black transition-shadow delay-75 duration-300">
											<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
											<span className="font-bold text-black uppercase">Submit</span>
										</Button>
									</span>
								</AccordionContent>
							</AccordionItem>
						</Accordion>

						<span className="justify flex flex-col items-start gap-4">
							<span className="flex items-center justify-end gap-2">
								<a href="https://www.facebook.com/profile.php?id=100087050144571" target="_blank">
									<FacebookIcon className="size-8" />
								</a>
								<YoutubeIcon className="size-8" />
								<InstagramIcon className="size-8" />
							</span>

							<div className="flex items-center justify-start gap-2">
								<VisaIcon className="text-rajah-400 size-12" />
								<MasterIcon className="text-rajah-400 size-12" />
								<AmexIcon className="text-rajah-400 size-12" />
								<AppleIcon className="text-rajah-400 size-12" />
								<PaypalIcon className="text-rajah-400 size-12" />
							</div>
						</span>
					</span>
				</div>
			</footer>
		);
	}

	return (
		<footer
			style={{
				height: "auto",
				width: "100%",
			}}
			className="border-border mt-10 border-t bg-[#151515]"
		>
			<div className="mx-auto flex max-w-7xl flex-col p-10 pb-5">
				<span className="flex items-start justify-center gap-2">
					{metadata.map((item, index) => (
						<div key={index} className="flex w-full max-w-50 flex-col gap-1 transition-all delay-75 duration-150 ease-in-out max-xl:max-w-40">
							<h1 className="text-2xl font-semibold tracking-tight text-white">{item.title}</h1>

							<ul className="flex flex-col gap-1">
								{item.children.map((child, index) => (
									<li key={index}>
										<Link href={child.route} className="text-muted-foreground text-sm tracking-tight hover:underline">
											{child.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					<div className="flex flex-col gap-1">
						<h1 className="text-left text-2xl font-semibold tracking-tight text-white">Join our news letter</h1>
						<p className="text-muted-foreground text-left text-sm">Get the latest news and updates from us.</p>

						<span className="flex flex-col gap-2">
							<InputFocus
								id="email"
								type="email"
								name="Email"
								value={newsLetterData}
								onChange={(e) => setNewsLetterData(e.target.value)}
								className="rounded-none border-white/60 px-3 py-7.5 pb-5 text-white"
								labelClassName="text-white"
							/>

							<Button className="group border-tequila-200 bg-rajah-200 hover:bg-rajah-200 hover:inset-ring-rajah-200 relative w-full overflow-hidden rounded-none border-2 px-3 py-6 inset-ring-2 inset-ring-black transition-shadow delay-75 duration-300">
								<div className="absolute -left-16 h-[100px] w-10 -rotate-45 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm duration-700 group-hover:left-[150%] group-hover:delay-200 group-hover:duration-700" />
								<span className="font-bold text-black uppercase">Submit</span>
							</Button>
						</span>
					</div>
				</span>

				<hr className="border-border/25 my-5" />

				<span className="flex items-center justify-between gap-2">
					<div className="flex items-center justify-start gap-2">
						<VisaIcon className="text-rajah-400 size-12" />
						<MasterIcon className="text-rajah-400 size-12" />
						<AmexIcon className="text-rajah-400 size-12" />
						<AppleIcon className="text-rajah-400 size-12" />
						<PaypalIcon className="text-rajah-400 size-12" />
					</div>

					<span className="flex items-center justify-end gap-2">
						<a href="https://www.facebook.com/profile.php?id=100087050144571" target="_blank">
							<FacebookIcon className="size-8" />
						</a>
						<YoutubeIcon className="size-8" />
						<InstagramIcon className="size-8" />
					</span>
				</span>
			</div>
		</footer>
	);
}

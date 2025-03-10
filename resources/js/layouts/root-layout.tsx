import React from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";

import Footer from "@/components/footer";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import CheckoutBackground from "@/components/icons/checkout-background";
import { PageProps } from "@/types";
import { Menu, ShoppingCart } from "lucide-react";

const components: { title: string; href: string; description: string }[] = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description:
			"A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description:
			"For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description:
			"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description:
			"A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description:
			"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

export default function RootLayout({
	auth,
	children,
}: PageProps<{ children: React.ReactNode }>) {
	const isMobile = useIsMobile();

	console.log("isMobile", isMobile, auth);

	if (isMobile) {
		return (
			<React.Fragment>
				<div
					style={{
						height: "var(--topbar-height)",
						position: "fixed",
						zIndex: 10,
					}}
					className="bg-background border-border flex w-full items-center justify-between border-b"
				>
					<div className="mx-2 flex w-full items-center justify-end">
						<Sheet>
							<SheetTrigger>
								<Menu />
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>
										Are you absolutely sure?
									</SheetTitle>
									<SheetDescription>
										This action cannot be undone. This will
										permanently delete your account and
										remove your data from our servers.
									</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
				</div>

				<main
					style={{
						minHeight:
							"calc(100svh - var(--topbar-height) - 0.25rem)",
						width: "100%",
						flex: "1 1 0%",
						paddingTop: "calc(var(--topbar-height) + 1rem)",
						overflowY: "auto",
						overflowX: "hidden",
					}}
				>
					{children}
				</main>

				<Footer />
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			<div
				style={{
					height: "var(--topbar-height)",
					position: "fixed",
					zIndex: 10,
				}}
				className="bg-background border-border flex w-full items-center justify-between border-b"
			>
				<NavigationMenu className="mx-2 flex w-full min-w-auto items-center justify-center">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger variant={"link"}>
								Getting started
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<li className="row-span-3">
										<NavigationMenuLink asChild>
											<a
												className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-pink-300/50 to-pink-200/20 p-6 no-underline outline-none select-none focus:shadow-md"
												href="/"
											>
												<div className="mt-4 mb-2 text-lg font-medium">
													shadcn/ui
												</div>
												<p className="text-muted-foreground text-sm leading-tight">
													Beautifully designed
													components built with Radix
													UI and Tailwind CSS.
												</p>
											</a>
										</NavigationMenuLink>
									</li>
									<ListItem href="/docs" title="Introduction">
										Re-usable components built using Radix
										UI and Tailwind CSS.
									</ListItem>
									<ListItem
										href="/docs/installation"
										title="Installation"
									>
										How to install dependencies and
										structure your app.
									</ListItem>
									<ListItem
										href="/docs/primitives/typography"
										title="Typography"
									>
										Styles for headings, paragraphs,
										lists...etc
									</ListItem>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger variant={"link"}>
								Components
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
									{components.map((component) => (
										<ListItem
											key={component.title}
											title={component.title}
											href={component.href}
										>
											{component.description}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				<div className="mx-2 flex w-fit items-center justify-end gap-2">
					<Button
						variant={"link"}
						className="relative size-10 [&_svg:not([class*='size-'])]:size-auto"
					>
						<CheckoutBackground
							className="absolute z-10 text-black/85 dark:text-white/90"
							width={"40"}
							height={"40"}
						/>
						<ShoppingCart
							className="absolute z-20 fill-fuchsia-300 text-fuchsia-300 dark:fill-pink-500/70 dark:text-pink-500/70"
							size={16}
						/>
						<span className="absolute top-0.5 right-0.5 z-30 size-auto rounded-full bg-fuchsia-200 p-1 py-0 text-xs font-medium text-white dark:bg-pink-200 dark:text-black">
							0
						</span>
					</Button>
				</div>
			</div>

			<main
				style={{
					minHeight: "calc(100svh - var(--topbar-height) - 0.25rem)",
					width: "100%",
					flex: "1 1 0%",
					paddingTop: "calc(var(--topbar-height) + 1rem)",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{children}
			</main>

			<Footer />
		</React.Fragment>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
						className,
					)}
					{...props}
				>
					<div className="text-sm leading-none font-medium">
						{title}
					</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});

ListItem.displayName = "ListItem";

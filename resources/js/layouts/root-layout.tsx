import { Link, usePage } from "@inertiajs/react";
import React from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { User } from "@/types";

import Footer from "@/components/navigation-footer";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronRight, Menu } from "lucide-react";

// there are going to be inside the root layout, cause there will be shared information about latest updates, new food items, etc.
const navigationLinks = [
	{
		title: "Alert Dialog",
		href: "/docs/primitives/alert-dialog",
		description: "A modal dialog that interrupts the user with important content and expects a response.",
	},
	{
		title: "Hover Card",
		href: "/docs/primitives/hover-card",
		description: "For sighted users to preview content available behind a link.",
	},
	{
		title: "Progress",
		href: "/docs/primitives/progress",
		description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
	},
	{
		title: "Scroll-area",
		href: "/docs/primitives/scroll-area",
		description: "Visually or semantically separates content.",
	},
	{
		title: "Tabs",
		href: "/docs/primitives/tabs",
		description: "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
	},
	{
		title: "Tooltip",
		href: "/docs/primitives/tooltip",
		description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
	},
];

interface CartItem {
	id: number;
	name: string;
	price: number;
}

export default function RootLayout({ footer, className, children }: React.PropsWithChildren<{ footer?: boolean; className?: string }>) {
	const user = usePage().props.auth?.user;
	const isMobile = useMediaQuery("(max-width: 640px)");

	const [currentCart, setCurrentCart] = useLocalStorage<CartItem[]>("cart", []);

	React.useEffect(() => {
		setCurrentCart([...currentCart, { id: 1, name: "Product 1", price: 100 }]);

		setTimeout(() => {
			setCurrentCart([]);
		}, 1000);
	}, []);

	const actions: {
		title: string;
		isHidden?: boolean;
		method?: "get" | "post";
		href?: string;
		component?: React.FC;
	}[] = React.useMemo(
		() => [
			{
				title: "Manage Account",
				isHidden: user === null,
				href: "profile.dashboard",
			},
			{
				title: "Log Out",
				isHidden: user === null,
				method: "post",
				href: "logout",
			},
			{
				title: "Sign In",
				isHidden: user !== null,
				href: "login",
			},
			{
				title: "Create an Account",
				isHidden: user !== null,
				href: "register",
			},
		],
		[isMobile],
	);

	return (
		<React.Fragment>
			<nav
				style={{
					height: "var(--topbar-height)",
					position: "fixed",
					zIndex: 10,
				}}
				className="bg-background border-border w-full border-b"
			>
				<section className="mx-auto flex h-full max-w-7xl items-center justify-between px-2">
					<div className="flex shrink-0 items-center justify-start gap-2 sm:hidden">
						<Drawer autoFocus={true} direction="left">
							<DrawerTrigger name="Menu Button" aria-label="Menu Button">
								<Menu size={20} />
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader className="hidden p-0">
									<DrawerTitle className="flex h-20 w-full flex-row items-center justify-between p-5 py-3 hover:bg-gray-200">
										<DrawerClose />
									</DrawerTitle>
									<DrawerDescription aria-label="menu-description"></DrawerDescription>
								</DrawerHeader>
								{actions.map(
									(action) =>
										!action.isHidden &&
										(action.component ? (
											<action.component />
										) : (
											action.href && (
												<Link
													key={action.title}
													method={action.method}
													href={route(action.href)}
													className="flex h-15 w-full flex-row items-center justify-between p-5 py-3 text-left transition-colors duration-200 ease-linear hover:bg-gray-200"
												>
													{action.title}
													<ChevronRight size={13} />
												</Link>
											)
										)),
								)}

								<DrawerFooter className="p-0">
									<DrawerClose className="h-15 w-full p-5 text-left transition-colors duration-200 ease-linear hover:bg-gray-200">
										<h1>Close</h1>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>

						<Link href="/" className="font-bricolage text-lg font-semibold -tracking-wide lowercase italic">
							{APP_NAME}
						</Link>
					</div>

					<div className="flex w-full items-center justify-start gap-2">
						<NavigationMenu className="left-0 hidden w-full items-start justify-start sm:flex">
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger variant={"link"} className="gap-0">
										Getting started
									</NavigationMenuTrigger>
									<NavigationMenuContent className="flex w-screen max-w-7xl items-center justify-start">
										<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
											<li className="row-span-3">
												<NavigationMenuLink asChild>
													<a
														className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-pink-300/50 to-pink-200/20 p-6 no-underline outline-none select-none focus:shadow-md"
														href="/"
													>
														<div className="mt-4 mb-2 text-lg font-medium">shadcn/ui</div>
														<p className="text-muted-foreground text-sm leading-tight">Beautifully designed components built with Radix UI and Tailwind CSS.</p>
													</a>
												</NavigationMenuLink>
											</li>
											<ListItem href="/docs" title="Introduction">
												Re-usable components built using Radix UI and Tailwind CSS.
											</ListItem>
											<ListItem href="/docs/installation" title="Installation">
												How to install dependencies and structure your app.
											</ListItem>
											<ListItem href="/docs/primitives/typography" title="Typography">
												Styles for headings, paragraphs, lists...etc
											</ListItem>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
								<NavigationMenuItem>
									<NavigationMenuTrigger variant={"link"} className="gap-0">
										Components
									</NavigationMenuTrigger>
									<NavigationMenuContent className="flex w-screen max-w-7xl items-center justify-start">
										<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
											{navigationLinks.map((component) => (
												<ListItem key={component.title} title={component.title} href={component.href}>
													{component.description}
												</ListItem>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="hidden w-full items-center justify-center sm:flex">
						<Link href="/" className="font-bricolage text-lg font-semibold -tracking-wide lowercase italic">
							{APP_NAME}
						</Link>
					</div>

					<div className="flex w-full items-center justify-end gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger className="group flex h-fit w-fit items-center justify-center max-sm:hidden">
								<span className="flex items-center justify-center rounded-md group-hover:scale-110">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
										/>
									</svg>
								</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="flex min-h-20 w-full min-w-50 flex-col items-start justify-center rounded-none">
								{actions.map(
									(action) =>
										!action.isHidden && (
											<DropdownMenuItem
												key={action.title}
												onClick={(e) => {
													e.preventDefault();
												}}
												className="h-full w-full rounded-none"
											>
												{action.component ? (
													<action.component />
												) : (
													action.href && (
														<Link method={action.method} href={route(action.href)} className="h-full w-full text-left">
															{action.title}
														</Link>
													)
												)}
											</DropdownMenuItem>
										),
								)}
							</DropdownMenuContent>
						</DropdownMenu>
						<ShoppingCartDrawer value={currentCart} user={user} />
					</div>
				</section>
			</nav>

			<main
				style={{
					minHeight: footer ? "calc(100svh - var(--topbar-height) - 0.25rem" : undefined,
					height: !footer ? "100svh" : undefined,
					width: "100%",
					flex: "1 1 0%",
					paddingTop: "var(--topbar-height)",
					overflowX: "visible",
				}}
			>
				{children}
			</main>

			{footer && <Footer />}
		</React.Fragment>
	);
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({ className, title, children, ...props }, ref) => {
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
					<div className="text-sm leading-none font-medium">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});

function ShoppingCartDrawer({ value, user }: { value: CartItem[]; user: User }) {
	console.log(value);

	return (
		<Drawer autoFocus={true} direction="right">
			<DrawerTrigger className="group relative flex size-10 items-center justify-center [&_svg:not([class*='size-'])]:size-auto">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 group-hover:scale-110">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
				<span className="bg-rajah-200 dark:bg-rajah-400/95 absolute top-0.5 right-0.5 z-30 size-auto rounded-full p-1 py-0 text-xs font-medium text-black/60 dark:text-white">0</span>
			</DrawerTrigger>
			<DrawerContent className="flex h-full flex-col items-center justify-between rounded-tl-sm rounded-bl-sm data-[vaul-drawer-direction=right]:sm:max-w-xl">
				<DrawerHeader className="hidden gap-0">
					<DrawerTitle>Shopping Cart</DrawerTitle>
					<DrawerDescription>Your cart is empty.</DrawerDescription>
				</DrawerHeader>

				{value.length <= 0 && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-1 p-5">
						<h1 className="text-4xl tracking-tighter text-black italic">Your basket is empty</h1>

						<span className="mt-2 flex flex-col items-center justify-center gap-1">
							<Link href={route("collections")} className="bg-rajah-700 rounded-md p-5 py-3.5 text-white">
								Continue Shopping
							</Link>

							{!user && (
								<>
									<span className="text-lg font-medium">Have an account?</span>
									<p className="flex items-center gap-1">
										<Link
											href="login"
											className="text-rajah-600 font-prata font-semibold tracking-wide italic underline decoration-wavy hover:decoration-2 hover:underline-offset-1"
										>
											Log in
										</Link>
										to check out faster.
									</p>
								</>
							)}
						</span>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}

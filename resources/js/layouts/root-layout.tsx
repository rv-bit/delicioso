import { Link, usePage } from "@inertiajs/react";
import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme";

import Footer from "@/components/footer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import ApplicationLogo from "@/components/icons/ApplicationLogo";
import CheckoutBackground from "@/components/icons/checkout-background";

import { Menu, Moon, ShoppingCart } from "lucide-react";

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

function DarkModeComponent() {
	const { theme, setTheme } = useTheme();

	const handleChangeTheme = (themeValue: "dark" | "light") => {
		setTheme(themeValue);
	};

	return (
		<React.Fragment>
			<span className="flex w-full items-center justify-start gap-1">
				<Moon />
				<h1>Dark Mode</h1>
			</span>
			<Switch
				checked={theme === "dark"}
				onCheckedChange={(checked) => handleChangeTheme(checked ? "dark" : "light")}
				className="data-[state=checked]:bg-gray-200 dark:data-[state=checked]:bg-white"
			/>
		</React.Fragment>
	);
}

function MobileLayout({ footer, children }: React.PropsWithChildren<{ footer?: boolean }>) {
	return (
		<React.Fragment>
			<div
				style={{
					height: "var(--topbar-height)",
					position: "fixed",
					zIndex: 10,
				}}
				className="bg-background border-border w-full border-b"
			>
				<section className="mx-auto flex h-full items-center justify-center px-2">
					<div className="flex shrink-0 items-center justify-start">
						<Link href="/">
							<ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
						</Link>
					</div>
					<div className="mx-2 flex w-full items-center justify-end gap-2">
						<Sheet>
							<SheetTrigger className="relative flex size-10 items-center justify-center [&_svg:not([class*='size-'])]:size-auto">
								<CheckoutBackground className="absolute z-10 text-black/85 dark:text-white/90" width={"35"} height={"35"} />
								<ShoppingCart className="absolute z-20 fill-fuchsia-300 text-fuchsia-300 dark:fill-pink-500/70 dark:text-pink-500/70" size={15} />
								<span className="absolute top-0.5 right-0.5 z-30 size-auto rounded-full bg-fuchsia-200 p-1 py-0 text-xs font-medium text-white dark:bg-pink-200 dark:text-black">
									0
								</span>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Shopping Cart</SheetTitle>
									<SheetDescription>Your cart is empty.</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>

						<Sheet>
							<SheetTrigger>
								<Menu size={30} />
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Are you absolutely sure?</SheetTitle>
									<SheetDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
				</section>
			</div>

			<main
				style={{
					minHeight: "calc(100svh - var(--topbar-height) - 0.25rem)",
					width: "100%",
					flex: "1 1 0%",
					paddingTop: "var(--topbar-height)",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				{children}
			</main>

			{footer && <Footer />}
		</React.Fragment>
	);
}

export default function RootLayout({ footer, children }: React.PropsWithChildren<{ footer?: boolean }>) {
	const user = usePage().props.auth.user;
	const isMobile = useMediaQuery("(max-width: 640px)");

	const actions: {
		title: string;
		isHidden?: boolean;
		method?: "get" | "post";
		href?: string;
		component?: React.FC;
	}[] = React.useMemo(
		() => [
			{
				title: "Manage",
				isHidden: user === null,
				href: "dashboard",
			},
			{
				title: "Log Out",
				isHidden: user === null,
				method: "post",
				href: "logout",
			},
			{
				title: "Log In",
				isHidden: user !== null,
				href: "login",
			},
			{
				title: "Sign Up",
				isHidden: user !== null,
				href: "register",
			},
			{
				title: "Dark Mode",
				isHidden: false,
				component: DarkModeComponent,
			},
		],
		[],
	);

	if (isMobile) {
		return <MobileLayout>{children}</MobileLayout>;
	}

	return (
		<React.Fragment>
			<div
				style={{
					height: "var(--topbar-height)",
					position: "fixed",
					zIndex: 10,
				}}
				className="bg-background border-border w-full border-b"
			>
				<section className="mx-auto flex h-full max-w-7xl items-center justify-center px-2">
					<div className="flex shrink-0 items-center justify-start">
						<Link href="/">
							<ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
						</Link>
					</div>

					<NavigationMenu className="mx-2 flex w-full min-w-auto items-center justify-center">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger variant={"link"}>Getting started</NavigationMenuTrigger>
								<NavigationMenuContent>
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
								<NavigationMenuTrigger variant={"link"}>Components</NavigationMenuTrigger>
								<NavigationMenuContent>
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

					<div className="mx-2 flex w-fit items-center justify-end gap-2">
						<Sheet>
							<SheetTrigger className="relative flex size-10 items-center justify-center [&_svg:not([class*='size-'])]:size-auto">
								<CheckoutBackground className="absolute z-10 text-black/85 dark:text-white/90" width={"35"} height={"35"} />
								<ShoppingCart className="fill-rajah-300 text-rajah-300 dark:fill-rajah-400 dark:text-rajah-400 absolute z-20" size={15} />
								<span className="bg-rajah-200 dark:bg-rajah-400/95 absolute top-0.5 right-0.5 z-30 size-auto rounded-full p-1 py-0 text-xs font-medium text-black dark:text-white">
									0
								</span>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Shopping Cart</SheetTitle>
									<SheetDescription>Your cart is empty.</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>

						<DropdownMenu>
							<DropdownMenuTrigger className="flex h-fit w-fit items-center justify-center">
								<span className="flex items-center justify-center rounded-md">
									Account
									<svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
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
					</div>
				</section>
			</div>

			<main
				style={{
					minHeight: "calc(100svh - var(--topbar-height) - 0.25rem)",
					width: "100%",
					flex: "1 1 0%",
					paddingTop: "var(--topbar-height)",
					overflowY: "auto",
					overflowX: "hidden",
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

ListItem.displayName = "ListItem";

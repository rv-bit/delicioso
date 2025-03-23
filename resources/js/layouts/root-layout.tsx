import { Link, usePage } from "@inertiajs/react";
import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

import ShoppingCartDrawer from "@/components/drawer-cart";
import Footer from "@/components/navigation-footer";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

import { ChevronRight, Menu } from "lucide-react";

export default function RootLayout({ footer, className, children }: React.PropsWithChildren<{ footer?: boolean; className?: string }>) {
	const user = usePage().props.auth?.user;
	const categories = usePage().props.categories.labels;
	const most_common_data = usePage().props.most_common_data;

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

								{Object.entries(categories).map(([key, value]) => (
									<Link
										key={key}
										href={`/collections/${key}`}
										className="flex h-15 w-full flex-row items-center justify-between p-5 py-3 text-left transition-colors duration-200 ease-linear hover:bg-gray-200"
									>
										{value}
										<ChevronRight size={13} />
									</Link>
								))}

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
										Order
									</NavigationMenuTrigger>
									<NavigationMenuContent className="flex h-auto min-h-60 w-screen max-w-7xl items-center justify-center">
										<ul
											className={cn("grid h-full min-h-60 w-full items-center justify-center gap-3 pb-2", {
												"grid-cols-1": !most_common_data.most_common_product,
												"grid-cols-2": most_common_data.most_common_product,
											})}
										>
											<span className="grid h-fit grid-flow-row grid-cols-2 grid-rows-1 items-start justify-center gap-2">
												{Object.entries(categories).map(([key, value]) => (
													<ListItem key={key} href={`/collections/${key}`} title={value} className="h-full w-full p-5">
														{value}
													</ListItem>
												))}
											</span>

											{most_common_data.most_common_product && (
												<li className="h-full">
													<NavigationMenuLink asChild className="rounded-none">
														<Link className="flex h-full w-full flex-col justify-end rounded-none no-underline outline-none select-none" href="/">
															<div className="relative h-50 w-full flex-col overflow-hidden">
																{most_common_data.most_common_product.product_image && (
																	<img
																		src={most_common_data.most_common_product.product_image}
																		alt={most_common_data.most_common_product.product_name}
																		loading="lazy"
																		className="absolute inset-0 h-full w-full object-cover"
																	/>
																)}
															</div>
															<div className="mb-2 text-lg font-medium">{most_common_data.most_common_product.product_name}</div>
														</Link>
													</NavigationMenuLink>
												</li>
											)}
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

						<ShoppingCartDrawer user={user} />
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
						"hover:text-accent-foreground focus:bg-accent group focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors duration-200 ease-linear outline-none select-none hover:bg-gray-100",
						className,
					)}
					{...props}
				>
					<div className="text-sm leading-none font-medium group-hover:underline">{title}</div>
					<p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});

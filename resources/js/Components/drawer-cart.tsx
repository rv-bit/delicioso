import { Link } from "@inertiajs/react";

import { User } from "@/types/index";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

import { useCart } from "@/providers/CartProvider";

export default function ShoppingCartDrawer({ user }: { user: User }) {
	const { cart, setCart } = useCart();

	console.log(cart);

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

				{cart.length <= 0 && (
					<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-5 text-center">
						<h1 className="text-xl tracking-tight text-black italic md:text-4xl">Your basket is empty</h1>

						<span className="flex flex-col items-center justify-center gap-1">
							<Link href={route("collections")} className="bg-rajah-700 rounded-md p-3 text-sm text-white md:p-5 md:py-3.5 md:text-lg">
								Continue Shopping
							</Link>

							{!user && (
								<>
									<span className="text-sm font-medium md:text-lg">Have an account?</span>
									<p className="flex items-center gap-1 text-sm md:text-lg">
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

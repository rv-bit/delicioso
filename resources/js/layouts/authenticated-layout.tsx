import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";

import { useTheme } from "@/providers/theme";

import ApplicationLogo from "@/components/icons/ApplicationLogo";
import NavLink from "@/components/NavLink";

import { Switch } from "@/components/ui/switch";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon } from "lucide-react";

function DarkModeComponent() {
	const { theme, setTheme } = useTheme();

	const handleChangeTheme = (themeValue: "dark" | "light") => {
		setTheme(themeValue);
	};

	return (
		<>
			<span className="flex w-full items-center justify-start gap-1">
				<Moon />
				<h1>Dark Mode</h1>
			</span>
			<Switch
				checked={theme === "dark"}
				onCheckedChange={(checked) =>
					handleChangeTheme(checked ? "dark" : "light")
				}
				className="data-[state=checked]:bg-gray-200 dark:data-[state=checked]:bg-blue-500"
			/>
		</>
	);
}

export default function Authenticated({
	header,
	children,
}: PropsWithChildren<{ header?: ReactNode }>) {
	const user = usePage().props.auth.user;

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex">
							<div className="flex shrink-0 items-center">
								<Link href="/">
									<ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
								</Link>
							</div>

							<div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
								<NavLink
									href={route("dashboard")}
									active={route().current("dashboard")}
								>
									Dashboard
								</NavLink>
							</div>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger className="flex h-fit w-fit items-center justify-center">
								<span className="flex items-center justify-center rounded-md">
									{user.name}

									<svg
										className="ms-2 -me-0.5 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									<Link
										href={route("profile.edit")}
										className="h-full w-full"
									>
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									<Link
										method="post"
										href={route("logout")}
										className="h-full w-full text-left"
									>
										Log Out
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									<DarkModeComponent />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* <div
					className={
						(showingNavigationDropdown ? "block" : "hidden") +
						" sm:hidden"
					}
				>
					<div className="space-y-1 pt-2 pb-3">
						<ResponsiveNavLink
							href={route("dashboard")}
							active={route().current("dashboard")}
						>
							Dashboard
						</ResponsiveNavLink>
					</div>

					<div className="border-t border-gray-200 pt-4 pb-1 dark:border-gray-600">
						<div className="px-4">
							<div className="text-base font-medium text-gray-800 dark:text-gray-200">
								{user.name}
							</div>
							<div className="text-sm font-medium text-gray-500">
								{user.email}
							</div>
						</div>

						<div className="mt-3 space-y-1">
							<ResponsiveNavLink href={route("profile.edit")}>
								Profile
							</ResponsiveNavLink>
							<ResponsiveNavLink
								method="post"
								href={route("logout")}
								as="button"
							>
								Log Out
							</ResponsiveNavLink>
						</div>
					</div>
				</div> */}
			</nav>

			{header && (
				<header className="bg-white shadow-sm dark:bg-gray-800">
					<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
						{header}
					</div>
				</header>
			)}

			<main>{children}</main>
		</div>
	);
}

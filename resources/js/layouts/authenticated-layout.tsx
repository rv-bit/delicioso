import { usePage } from "@inertiajs/react";
import React, { PropsWithChildren } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import NavLink from "@/components/navigation-link";

const tabs = [
	{ name: "Dashboard", href: "profile.dashboard" },
	{ name: "Profile Manage", href: "profile.edit" },
	{ name: "Admin Dashboard", href: "admin.dashboard", roles: ["admin"] },
];

export default function AuthenticatedLayout({ children }: PropsWithChildren<{}>) {
	const user = usePage().props.auth.user;
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<React.Fragment>
			<nav>
				<div className="mx-auto max-w-7xl px-2">
					<div className="max-sm:no-scrollbar flex min-h-14 w-full items-center justify-start space-x-4 max-sm:max-w-full max-sm:overflow-x-auto max-sm:overflow-y-hidden md:m-2">
						{tabs.map((tab) => {
							if (tab.roles && !tab.roles.some((role) => user.roles.includes(role))) {
								return null;
							}

							return (
								<NavLink key={tab.href} href={route(tab.href)} active={route().current(tab.href)} className="size-fit">
									{tab.name}
								</NavLink>
							);
						})}
					</div>
				</div>
			</nav>

			{children}
		</React.Fragment>
	);
}

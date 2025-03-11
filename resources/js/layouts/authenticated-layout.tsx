import React, { PropsWithChildren } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import NavLink from "@/components/NavLink";
import { usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ children }: PropsWithChildren<{}>) {
	const user = usePage().props.auth.user;
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<React.Fragment>
			<nav>
				<div className="mx-auto max-w-7xl px-2">
					<div className="my-2 flex h-10 items-center justify-start">
						<div className="space-x-4">
							<NavLink href={route("dashboard")} active={route().current("dashboard")}>
								Dashboard
							</NavLink>
							<NavLink href={route("profile.edit")} active={route().current("profile.edit")}>
								Profile Manage
							</NavLink>
						</div>
					</div>
				</div>
			</nav>

			{children}
		</React.Fragment>
	);
}

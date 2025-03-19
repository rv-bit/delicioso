import { cn } from "@/lib/utils";
import { InertiaLinkProps, Link } from "@inertiajs/react";

export default function NavLink({ active = false, className, children, ...props }: InertiaLinkProps & { active: boolean; className?: string }) {
	return (
		<Link
			{...props}
			className={cn(
				"inline-flex items-center border-b-2 text-sm leading-5 font-medium transition duration-150 ease-in-out focus:outline-hidden",
				{
					"border-rajah-400 focus:border-rajah-700 dark:border-rajah-600 text-gray-900 dark:text-gray-100": active,
					"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300 dark:focus:border-gray-700 dark:focus:text-gray-300":
						!active,
				},
				className,
			)}
		>
			{children}
		</Link>
	);
}

import { Head, usePage } from "@inertiajs/react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";
import { toast } from "sonner";

export default function Dashboard() {
	const { flash } = usePage().props;
	const successPayment = flash?.successPayment; // Retrieve the successPayment flash data

	const user = usePage().props.auth.user;

	if (successPayment) {
		toast.success("You have successfully purchased some goods");
	}

	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Dashboard" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2"></div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}

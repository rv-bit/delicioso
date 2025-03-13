import { Head } from "@inertiajs/react";

import { PageProps } from "@/types";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

import DeleteUserForm from "./components/DeleteUserForm";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import UpdateProfileInformationForm from "./components/UpdateProfileInformationForm";

export default function Edit({
	mustVerifyEmail,
	status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Profile" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<UpdateProfileInformationForm
							mustVerifyEmail={mustVerifyEmail}
							status={status}
							className="max-w-xl"
						/>
					</div>

					<div className="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<UpdatePasswordForm className="max-w-xl" />
					</div>

					<div className="bg-white p-4 shadow-sm sm:rounded-lg sm:p-8 dark:bg-gray-800">
						<DeleteUserForm className="max-w-xl" />
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}

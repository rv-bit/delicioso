import { Head } from "@inertiajs/react";

import { PageProps } from "@/types";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import RootLayout from "@/layouts/root-layout";

import DeleteUserForm from "./components/delete-user-form";
import UpdatePasswordForm from "./components/update-password-form";
import UpdateProfileInformationForm from "./components/update-profile-information-form";

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
	return (
		<RootLayout>
			<AuthenticatedLayout>
				<Head title="Profile" />

				<div className="mx-auto flex max-w-7xl flex-col gap-2 px-2">
					<div className="bg-white p-4 shadow-sm">
						<UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
					</div>

					<div className="bg-white p-4 shadow-sm">
						<UpdatePasswordForm className="max-w-xl" />
					</div>

					<div className="bg-white p-4 shadow-sm">
						<DeleteUserForm className="max-w-xl" />
					</div>
				</div>
			</AuthenticatedLayout>
		</RootLayout>
	);
}

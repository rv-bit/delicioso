import { Head, useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

import RootLayout from "@/layouts/root-layout";

import { LoginComponent, type LoginFormProps } from "./components/login";
import { RegisterComponent, RegisterFormProps } from "./components/register";

export default function Account({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
	const { data, setData, post, processing, errors, reset } = useForm<LoginFormProps>({
		email: "",
		password: "",
		remember: false,
	});

	const handleDataChange = (key: string, value: string | boolean) => {
		setData((prevData) => {
			const newData = { ...prevData, [key]: value };
			console.log("Updated Data:", newData); // <-- Add this
			return newData;
		});
	};

	const submit: FormEventHandler = React.useCallback(
		(e) => {
			e.preventDefault();

			post(route("login"), {
				onFinish: () => reset("password"),
			});
		},
		[data, post, reset],
	);

	const {
		data: dataRegister,
		setData: setDataRegister,
		post: postRegister,
		processing: processingRegister,
		errors: errorsRegister,
		reset: resetRegister,
	} = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});

	const submitRegister: FormEventHandler = React.useCallback(
		(e) => {
			e.preventDefault();

			postRegister(route("register"), {
				onFinish: () => resetRegister("password", "password_confirmation"),
			});
		},
		[dataRegister, postRegister, resetRegister],
	);

	return (
		<RootLayout footer={true}>
			<Head title="Log in" />

			<div className="mx-auto flex h-full w-full max-w-7xl flex-row items-center justify-center gap-5 px-2 max-sm:flex-col max-sm:gap-0">
				<LoginComponent
					status={status}
					canResetPassword={canResetPassword}
					errors={errors as Record<keyof LoginFormProps, string>}
					data={data}
					setData={setData}
					submit={submit}
					processing={processing}
				/>

				<RegisterComponent
					errors={errorsRegister as Record<keyof RegisterFormProps, string>}
					data={dataRegister}
					setData={setDataRegister}
					submit={submitRegister}
					processing={processingRegister}
				/>
			</div>
		</RootLayout>
	);
}

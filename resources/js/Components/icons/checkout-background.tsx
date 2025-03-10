import { SVGAttributes } from "react";

export default function CheckoutBackground(props: SVGAttributes<SVGElement>) {
	return (
		<svg
			{...props}
			viewBox="0 0 633 615"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M620.654 303.5C527.784 367.424 578.714 619.073 315.154 606C51.5936 592.927 72.745 483.736 9.65377 303.5C-53.4375 123.264 238.574 -4.54186 315.154 0.99996C391.734 6.54178 713.524 239.576 620.654 303.5Z"
				fill={props.fill || "currentColor"}
			/>
		</svg>
	);
}

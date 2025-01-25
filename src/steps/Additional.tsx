import { useSteps } from "../context/StepContext";
import { useState, useEffect, useCallback, Fragment } from "react";
import SelectedPrintableCard from "../components/SelectedPrintableCard";
import DateTime from "../components/form/DateTime";
import PhoneNumber from "../components/form/PhoneNumber";
import { useTranslation } from "react-i18next";

const Additional = () => {

	const { t } = useTranslation();
	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;

	const [isFormValid, setIsFormValid] = useState(false);
	const [formData, setFormData] = useState(() => {
		const isDeliveryToLocation = state.steps[0].data === 'delivery_to_location';
		return {
			senderName: (state.steps[stepIndex]?.data as { senderName?: string })?.senderName || '',
			recipientName: (state.steps[stepIndex]?.data as { recipientName?: string })?.recipientName || '',
			deliveryDate: (state.steps[stepIndex]?.data as { deliveryDate?: string })?.deliveryDate || '',
			...(isDeliveryToLocation && {
				recipientAddress: (state.steps[stepIndex]?.data as { recipientAddress?: string })?.recipientAddress || '',
				recipientMobile: (state.steps[stepIndex]?.data as { recipientMobile?: string })?.recipientMobile || '',
			}),
			...(!isDeliveryToLocation && {
				pickupTime: (state.steps[stepIndex]?.data as { pickupTime?: string })?.pickupTime || '',
			}),
			message: (state.steps[stepIndex]?.data as { message?: string })?.message || '',
		};
	});

	const [formErrors, setFormErrors] = useState(() => {
		const isDeliveryToLocation = state.steps[0].data === 'delivery_to_location';
		return {
			senderName: '',
			recipientName: '',
			deliveryDate: '',
			...(isDeliveryToLocation && {
				recipientAddress: '',
				recipientMobile: '',
			}),
			...(!isDeliveryToLocation && {
				pickupTime: '',
			}),
			message: '',
		};
	});

	// Validation helper function
	const validateField = useCallback((name: string, value: string): string => {
		switch (name) {
			case "senderName":
			case "recipientName":
				return value.length >= 3 ? "" : `${name === 'senderName' ? t("sender_name") : t("recipient_name")} ${t("3_characters_long")}`;
			case "recipientAddress":
				return value.length >= 6 ? "" : `${name === 'recipientAddress' && t("recipient_address")} ${t("6_characters_long")}`;
			case "deliveryDate":
			case "deliveryTime":
				return value ? "" : `${name === 'deliveryDate' ? t("delivery_date") : t("delivery_time")} is required.`;
			case "pickupTime":
				return value ? "" : `${name === 'pickupTime' && t("pickup_time")} is required.`;
			case "recipientMobile":
				return ""; // Mobile validation will be handled by PhoneNumber component
			default:
				return "";
		}
	}, []);


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		const { name, value } = e.target;

		setFormData((prevState) => {
			// Only update the formData if the field is relevant
			if (
				(state.steps[0].data === 'delivery_to_location' && ['senderName', 'recipientName', 'recipientAddress', 'recipientMobile', 'deliveryDate', 'deliveryTime'].includes(name)) ||
				(state.steps[0].data !== 'delivery_to_location' && ['deliveryDate', 'pickupTime'].includes(name))
			) {
				return {
					...prevState,
					[name]: value,
				};
			}
			return prevState;
		});
	};

	const handleDateTimeChange = (data: { deliveryDate: string; deliveryTime: string }) => {
		setFormData((prevState) => ({
			...prevState,
			...data, // Update deliveryDate and deliveryTime
		}));
	};

	// Handle mobile number validation
	const handleMobileChange = (mobileNumber: string, valid: boolean) => {
		const errors = { ...formErrors };
		setFormData((prevState) => ({
			...prevState,
			recipientMobile: mobileNumber,
		}));
		errors.recipientMobile = valid ? "" : t("invalid_mobile_number");
		setFormErrors(errors);
	};

	const handelMessage = (message: string) => {
		setFormData((prevState) => ({
			...prevState,
			message,
		}));
	};

	// Validation logic inside useEffect
	useEffect(() => {
		const errors = { ...formErrors };
		let isValid = true;

		// Define required fields dynamically based on the delivery method
		const requiredFields =
			state.steps[0].data === 'delivery_to_location'
				? ['senderName', 'recipientName', 'recipientAddress', 'recipientMobile', 'deliveryDate', 'deliveryTime']
				: ['deliveryDate', 'pickupTime'];

		// Conditionally add message validation if the printable card is selected
		if (state.printableCard?.product && state.printableCard.product.length > 0) {
			requiredFields.push('message');
		}

		// Validate only required fields
		requiredFields.forEach((field) => {
			const fieldKey = field as keyof typeof formData; // Explicitly type `field` as a key of `formData`
			const error = validateField(fieldKey, formData[fieldKey] || "");

			if (error) {
				errors[fieldKey] = error;
				isValid = false;
			} else {
				errors[fieldKey] = '';
			}
		});

		// Validate the message if it's required
		if ((state.printableCard?.product && state.printableCard.product.length > 0) && !formData.message.trim()) {
			errors.message = t("message_is_required");
			isValid = false;
		}

		setFormErrors(errors);
		setIsFormValid(isValid);
	}, [formData, state.printableCard?.product?.length]);

	useEffect(() => {
		if (isFormValid) {
			// Save the selected card ID to the global state
			dispatch({
				type: "SET_STEP_DATA",
				payload: { stepIndex, data: formData },
			});

			// Mark the step as valid
			dispatch({ type: "SET_VALID", payload: true });
		} else {
			dispatch({ type: "SET_VALID", payload: false });
		}
	}, [isFormValid, formData]);

	return (
		<div className="px-8 py-8 sm:px-0">
			<form action="" className="grid grid-cols-2 gap-4">
				<SelectedPrintableCard onChangeMessage={handelMessage} />

				{
					state.steps[0].data === "delivery_to_location" && 
					<Fragment>
						<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
							<label htmlFor="senderName" className="text-lg font-medium">{t("sender_name")} <span className="text-red-500">*</span></label>
							<input
								type="text"
								name="senderName"
								id="senderName"
								placeholder={t("sender_name")}
								value={formData.senderName}
								onChange={handleChange}
								className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
							/>
							{formErrors.senderName && <small className="text-red-500">{formErrors.senderName}</small>}
						</div>

						<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
							<label htmlFor="recipientName" className="text-lg font-medium">{t("recipient_name")} <span className="text-red-500">*</span></label>
							<input
								type="text"
								name="recipientName"
								id="recipientName"
								placeholder={t("recipient_name")}
								value={formData.recipientName}
								onChange={handleChange}
								className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
							/>
							{formErrors.recipientName && <small className="text-red-500">{formErrors.recipientName}</small>}
						</div>
					</Fragment>
				}

				{
					state.steps[0].data !== "delivery_to_location" &&
					// <div className="grid xl:grid-cols-2 gap-2 col-span-2 mb-0">
					<div className="grid gap-2 col-span-2 mb-0">
						{
							state.fetchedData && state.fetchedData.market.map((data, idx: number) =>  (
								<div key={idx} className="rounded-xl p-4 bg-[#f9dbb8] bg-opacity-35 w-full">
									<div className="flex items-center justify-between gap-3">
										<div className="border border-[#5a0616] p-3 rounded-full">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5a0616" className="size-6">
												<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
											</svg>

										</div>
										<div className="w-full">
											<p className="text-2xl text-[#5a0616] flex items-center gap-1">{data.node.location.name} - <small className="text-sm">{data.node.location.address.city}</small></p>
											<p className="text-[#5a0616] text-opacity-75 text-sm">{data.node.location.address.address1}, {data.node.location.address.address2}</p>
											<small className="text-gray-600">{t(data.node.pickUpTime)}</small>
											{/* <div className="flex gap-2 items-center">
												<a href={`tel:${data.node.location.address.phone}`} target="_blank" className="text-[#5a0616] border border-[#5a0616] px-8 py-2 rounded-full">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#5a0616" className="size-6">
														<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
													</svg>
												</a>
												<a href={`https://www.google.com/maps/place/31%C2%B057'15.8%22N+35%C2%B054'38.1%22E/@${data.node.location.address.latitude},${data.node.location.address.longitude},833m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d${data.node.location.address.latitude}!4d${data.node.location.address.longitude}?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D`} target="_blank" className="text-[#5a0616] border border-[#5a0616] px-8 py-2 rounded-full">
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#5a0616" className="size-6">
														<path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
													</svg>
												</a>
											</div> */}
										</div>
									</div>
								</div>
							))
						}
					</div>
				}

				<DateTime onDateTimeChange={handleDateTimeChange} />

				{state.steps[0].data === 'delivery_to_location' && (
					<PhoneNumber onPhoneChange={handleMobileChange} />
				)}

				{state.steps[0].data === 'delivery_to_location' && (
					<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
						<label htmlFor="recipientCity" className="text-lg font-medium">{t("delivery_to_city")} <span className="text-red-500">*</span></label>
						<input
							type="text"
							disabled
							name="recipientCity"
							id="recipientCity"
							value={(state.steps[1].data as string) || ''}
							className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
						/>
					</div>
				)}

				{state.steps[0].data === 'delivery_to_location' && (
					<div className="flex flex-col gap-2 col-span-2">
						<label htmlFor="recipientAddress" className="text-lg font-medium">{t("recipient_address")} <span className="text-red-500">*</span></label>
						<input
							type="text"
							name="recipientAddress"
							id="recipientAddress"
							minLength={10}
							value={formData.recipientAddress}
							onChange={handleChange}
							placeholder={t("address_placeholder")}
							className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
						/>
						{formErrors.recipientAddress && <small className="text-red-500">{formErrors.recipientAddress}</small>}
					</div>
				)}
			</form>
		</div>
	);
};

export default Additional;

import { useSteps } from "../context/StepContext";
import { useState, useEffect, useCallback } from "react";
import SelectedPrintableCard from "../components/SelectedPrintableCard";
import DateTime from "../components/form/DateTime";
import PhoneNumber from "../components/form/PhoneNumber";
import { useTranslation } from "react-i18next";

const Additional = () => {

	const { t } = useTranslation();
	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;

	const [isFormValid, setIsFormValid] = useState(false);
	const [formData, setFormData] = useState({
		senderName: "",
		recipientName: "",
		deliveryDate: "",
		deliveryTime: "",
		recipientMobile: "",
		recipientAddress: "",
		message: ""
	});
	const [formErrors, setFormErrors] = useState({
		senderName: "",
		recipientName: "",
		deliveryDate: "",
		deliveryTime: "",
		recipientMobile: "",
		recipientAddress: "",
		message: ""
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
			case "recipientMobile":
				// Mobile validation will be handled by PhoneNumber component
				return "";
			default:
				return "";
		}
	}, []);


	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
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

		// Validate all form fields
		Object.keys(formData).forEach((field) => {
			const fieldKey = field as keyof typeof formData; // Explicitly type `field` as a key of `formData`
			const error = validateField(fieldKey, formData[fieldKey]); // Use the fieldKey to access the value
			if (error) {
			errors[fieldKey] = error;
			isValid = false;
			} else {
			errors[fieldKey] = "";
			}
		});

		setFormErrors(errors);
		setIsFormValid(isValid);
	}, [formData]);


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

	}, [isFormValid, formData])

	return (
		<div className="px-8 py-8 sm:px-0">
			<form action="" className="grid grid-cols-2 gap-4">
				<SelectedPrintableCard onChangeMessage={handelMessage} />

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

				<DateTime onDateTimeChange={handleDateTimeChange} />

				<PhoneNumber onPhoneChange={handleMobileChange} />
				
				{
					state.steps[1].data as string &&
					<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
						<label htmlFor="recipientCity" className="text-lg font-medium">{t("delivery_to_city")} <span className="text-red-500">*</span></label>
						<input
							type="text"
							disabled
							name="recipientCity"
							id="recipientCity"
							value={(state.steps[1].data as string) ? (state.steps[1].data as string) : ''}
							className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
						/>
					</div>
				}

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
			</form>
		</div>
	);
};

export default Additional;

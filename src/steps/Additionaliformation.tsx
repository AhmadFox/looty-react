import { useSteps } from "../context/StepContext";
import { useState, useEffect, useCallback } from "react";
import SelectedPrintableCard from "../components/SelectedPrintableCard";
import DateTime from "../components/form/DateTime";
import PhoneNumber from "../components/form/PhoneNumber";

const Additionaliformation = () => {

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
				return value.length >= 3 ? "" : `${name} must be at least 3 characters long.`;
			case "recipientAddress":
				return value.length >= 6 ? "" : `${name} must be at least 6 characters long.`;
			case "deliveryDate":
			case "deliveryTime":
				return value ? "" : `${name} is required.`;
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
		errors.recipientMobile = valid ? "" : "Invalid mobile number.";
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

	}, [isFormValid])

	return (
		<div className="px-8 py-8 sm:px-0">
			<form action="" className="grid grid-cols-2 gap-4">
				<SelectedPrintableCard onChangeMessage={handelMessage} />

				<div className="flex flex-col gap-2">
					<label htmlFor="senderName" className="text-lg font-medium">Sender Name <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="senderName"
						id="senderName"
						placeholder="Sender Name"
						value={formData.senderName}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{formErrors.senderName && <span className="text-red-500">{formErrors.senderName}</span>}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="recipientName" className="text-lg font-medium">Recipient Name <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="recipientName"
						id="recipientName"
						placeholder="Recipient Name"
						value={formData.recipientName}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{formErrors.recipientName && <span className="text-red-500">{formErrors.recipientName}</span>}
				</div>

				<DateTime onDateTimeChange={handleDateTimeChange} />

				<PhoneNumber onPhoneChange={handleMobileChange} />
				
				{
					state.steps[1].data as string &&
					<div className="flex flex-col gap-2">
						<label htmlFor="recipientCity" className="text-lg font-medium">Delevery to City <span className="text-red-500">*</span></label>
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
					<label htmlFor="recipientAddress" className="text-lg font-medium">Recipient Address <span className="text-red-500">*</span></label>
					<input
						type="text"
						name="recipientAddress"
						id="recipientAddress"
						minLength={10}
						value={formData.recipientAddress}
						onChange={handleChange}
						placeholder="Area, Street, Building Number, Floor, Apartment Number"
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{formErrors.recipientAddress && <span className="text-red-500">{formErrors.recipientAddress}</span>}
				</div>
			</form>
		</div>
	);
};

export default Additionaliformation;

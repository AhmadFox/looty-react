import { useSteps } from "../context/StepContext";
import { useState, useEffect } from "react";
import SelectedPrintableCard from "../components/SelectedPrintableCard";

const Additionaliformation = () => {

	const {state, dispatch} = useSteps();
	const stepIndex = state.currentStep;

	const [formData, setFormData] = useState({
		senderName: "",
		recipientName: "",
		deliveryDate: "",
		deliveryTime: "",
		recipientMobile: "",
		message: ""
	});

	const [formErrors, setFormErrors] = useState({
		senderName: "",
		recipientName: "",
		deliveryDate: "",
		deliveryTime: "",
		recipientMobile: "",
		message: ""
	});

	const [isFormValid, setIsFormValid] = useState(false);

	const date = new Date();
	const today = date.toISOString().split('T')[0];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handelMessage = (message: string) => {
		console.log('message', message);
		setFormData((prevState) => ({
			...prevState,
			message,
		}));
	};

	// Validation logic inside useEffect
	useEffect(() => {
		const errors = { ...formErrors };

		// Validate senderName (Required)
		if (!formData.senderName) {
			errors.senderName = "Sender name is required";
		} else {
			errors.senderName = "";
		}

		// Validate recipientName (Required)
		if (!formData.recipientName) {
			errors.recipientName = "Recipient name is required";
		} else {
			errors.recipientName = "";
		}

		// Validate deliveryDate (Required)
		if (!formData.deliveryDate) {
			errors.deliveryDate = "Delivery date is required";
		} else {
			errors.deliveryDate = "";
		}

		// Validate deliveryTime (Required)
		if (!formData.deliveryTime) {
			errors.deliveryTime = "Delivery time is required";
		} else {
			errors.deliveryTime = "";
		}

		// Validate recipientMobile (Required and must be 10 digits)
		const phoneRegex = /^[0-9]{10}$/;
		if (!formData.recipientMobile) {
			errors.recipientMobile = "Recipient mobile number is required";
		} else if (!phoneRegex.test(formData.recipientMobile)) {
			errors.recipientMobile = "Recipient mobile number must be 10 digits";
		} else {
			errors.recipientMobile = "";
		}

		// Validate message (Optional, but could be required based on your logic)
		// if (!formData.message) {
		// 	errors.message = "Message is required";
		// } else {
		// 	errors.message = "";
		// }

		// Set form errors in state
		setFormErrors(errors);

		// Check if the form is valid (no errors)
		const isValid = Object.values(errors).every((error) => error === "");
		setIsFormValid(isValid);

	}, [formData]); // Trigger this effect whenever formData changes

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

	}, [dispatch, isFormValid, stepIndex, formData])

	console.log('State =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<form action="" className="grid grid-cols-2 gap-4">
				<SelectedPrintableCard onChangeMessage={handelMessage} />

				<div className="flex flex-col gap-2">
					<label htmlFor="senderName" className="text-lg font-medium">Sender Name:</label>
					<input
						type="text"
						name="senderName"
						id="senderName"
						placeholder="Sender Name"
						value={formData.senderName}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{/* {formErrors.senderName && <span className="text-red-500">{formErrors.senderName}</span>} */}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="recipientName" className="text-lg font-medium">Recipient Name:</label>
					<input
						type="text"
						name="recipientName"
						id="recipientName"
						placeholder="Recipient Name"
						value={formData.recipientName}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{/* {formErrors.recipientName && <span className="text-red-500">{formErrors.recipientName}</span>} */}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="deliveryDate" className="text-lg font-medium">Delivery Date:</label>
					<input
						type="date"
						name="deliveryDate"
						id="deliveryDate"
						value={formData.deliveryDate}
						min={today}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{/* {formErrors.deliveryDate && <span className="text-red-500">{formErrors.deliveryDate}</span>} */}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="deliveryTime" className="text-lg font-medium">Delivery Time:</label>
					<input
						type="time"
						name="deliveryTime"
						id="deliveryTime"
						value={formData.deliveryTime}
						onChange={handleChange}
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{/* {formErrors.deliveryTime && <span className="text-red-500">{formErrors.deliveryTime}</span>} */}
				</div>

				<div className="flex flex-col gap-2 col-span-2">
					<label htmlFor="recipientMobile" className="text-lg font-medium">Recipient Mobile Number:</label>
					<input
						type="number"
						name="recipientMobile"
						id="recipientMobile"
						maxLength={10}
						minLength={10}
						value={formData.recipientMobile}
						onChange={handleChange}
						placeholder="Ex: 07XX-XXX-XXX"
						className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
					/>
					{/* {formErrors.recipientMobile && <span className="text-red-500">{formErrors.recipientMobile}</span>} */}
				</div>
			</form>
		</div>
	);
};

export default Additionaliformation;

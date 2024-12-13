import { useState, useEffect, useCallback } from 'react';
import { useSteps } from '../../context/StepContext';

interface PhoneNumberProps {
	onPhoneChange: (mobileNumber: string, valid: boolean) => void;
}

const PhoneNumber = ({ onPhoneChange }: PhoneNumberProps) => {

	const { state } = useSteps();
	const [value, setValue] = useState('');
	const [isValid, setIsValid] = useState(true);

	// Simplified phone validation regex for Jordanian numbers
	const jordanianMobileRegex = /^(75|77|78|79)\d{7}$/;

	// Debounced validation handler
	const validateMobile = useCallback((input: string) => {
		let sanitizedInput = input.startsWith('0') ? input.slice(1) : input; // Remove leading 0 if present
		sanitizedInput = sanitizedInput.slice(0, 10); // Limit input length to 10 digits

		const isValidPhone = jordanianMobileRegex.test(sanitizedInput);
		setIsValid(isValidPhone);
		setValue(sanitizedInput);
	}, []);

	// Handle input change with debouncing
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		validateMobile(e.target.value);
	};

	useEffect(() => {
		onPhoneChange(value, isValid);
	}, [value, isValid]);

	return (
		<div className={`flex flex-col gap-2
			${(state.steps[1].data as string) ? 'col-span-1' : 'col-span-2'}
			`}>
			<label htmlFor="recipientMobile" className="text-lg font-medium">Recipient Mobile Number <span className="text-red-500">*</span></label>
			<input
				type="text" // Changed to text to avoid number-specific input issues
				name="recipientMobile"
				id="recipientMobile"
				value={value}
				onChange={handleInputChange}
				placeholder="Ex: 7xx xxx xxx"
				className={`py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md transition-colors ${
					!isValid ? 'border-red-500 border' : ''
				}`}
			/>
			{!isValid && (
				<span className="text-red-500">
					<small className="block">Invalid Jordanian mobile number!</small>
					<small>Should start with 75, 77, 78, or 79 and be followed by 7 digits.</small>
				</span>
			)}
		</div>
	);
};

export default PhoneNumber;

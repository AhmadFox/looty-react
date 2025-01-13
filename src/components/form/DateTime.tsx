import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSteps } from "../../context/StepContext";

interface DateTimeProps {
	onDateTimeChange: (data: { deliveryDate: string; deliveryTime: string }) => void;
}

const DateTime = ({ onDateTimeChange }: DateTimeProps) => {
	
	const { t } = useTranslation();
	const { state } = useSteps();
	const stepIndex = state.currentStep;
	const [formData, setFormData] = useState({
		deliveryDate: (state.steps[stepIndex]?.data as { deliveryDate?: string })?.deliveryDate || "",
		deliveryTime: (state.steps[stepIndex]?.data as { deliveryTime?: string })?.deliveryTime || "",
	});
	const [availableTimes, setAvailableTimes] = useState<string[]>([]);

	const date = new Date();
	const today = date.toLocaleDateString("en-CA");

	// Predefined time slots
	const timeSlots = [
		{ value: "10:00-12:00", start: 10, end: 12 },
		{ value: "12:00-14:00", start: 12, end: 14 },
		{ value: "14:00-16:00", start: 14, end: 16 },
		{ value: "16:00-18:00", start: 16, end: 18 },
		{ value: "18:00-20:00", start: 18, end: 20 },
		{ value: "20:00-22:00", start: 20, end: 22 },
		{ value: "22:00-24:00", start: 22, end: 24 },
	];

	// Convert 24-hour format to 12-hour format with AM/PM
	const formatTime = (hour: number) => {
		const period = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
		return `${formattedHour}:00 ${period}`;
	};

	// Map time slots to 12-hour formatted strings
	const getFormattedTimeSlot = (start: number, end: number) =>
		`${formatTime(start)} - ${formatTime(end)}`;

	// Handle form changes
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const updatedFormData = { ...formData, [name]: value };
		setFormData(updatedFormData);

		// Send data to parent
		onDateTimeChange(updatedFormData);
	};

	// Update available times based on current time and selected date
	useEffect(() => {
		const currentHour = new Date().getHours();
		const selectedDate = formData.deliveryDate;

		if (selectedDate === today) {
			// Filter out past time slots if the selected date is today
			setAvailableTimes(
				timeSlots
					.filter((slot) => slot.start > currentHour) // Only include future time slots
					.map((slot) => slot.value)
			);
		} else if (selectedDate) {
			// For future dates, all time slots should be available
			setAvailableTimes(timeSlots.map((slot) => slot.value));
		}
	}, [formData.deliveryDate]); // Only re-run this effect when the deliveryDate changes

	return (
		<Fragment>
			<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
				<label htmlFor="deliveryDate" className="text-lg font-medium">
				{t("delivery_date")} <span className="text-red-500">*</span>
				</label>
				<input
					type="date"
					name="deliveryDate"
					id="deliveryDate"
					value={formData.deliveryDate}
					min={today}
					onChange={handleChange}
					className="h-[37px] sm:h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md w-full"
				/>
			</div>

			<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
				<label htmlFor="deliveryTime" className="text-lg font-medium">
				{t("available_delivery_time")} <span className="text-red-500">*</span>
				</label>
				<select
					name="deliveryTime"
					id="deliveryTime"
					value={formData.deliveryTime}
					onChange={handleChange}
					disabled={!formData.deliveryDate}
					className="h-[37px] sm:h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
				>
					<option disabled value="">
					{t("select_time")}
					</option>
					{/* Render available times with formatted strings */}
					{availableTimes.map((timeSlot) => {
						// Find the corresponding time slot object
						const slot = timeSlots.find((slot) => slot.value === timeSlot);
						return (
							<option key={timeSlot} value={timeSlot}>
								{slot ? getFormattedTimeSlot(slot.start, slot.end) : timeSlot}
							</option>
						);
					})}
				</select>
			</div>
		</Fragment>
	);
};

export default DateTime;

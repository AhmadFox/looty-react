import { Fragment, useEffect, useState } from "react";

interface DateTimeProps {
	onDateTimeChange: (data: { deliveryDate: string; deliveryTime: string }) => void;
}

const DateTime = ({ onDateTimeChange }: DateTimeProps) => {
	const [formData, setFormData] = useState({
		deliveryDate: "",
		deliveryTime: "",
	});
	const [availableTimes, setAvailableTimes] = useState<string[]>([]);

	const date = new Date();
	const today = date.toISOString().split("T")[0];

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

		// If the selected date is today, filter past time slots
		if (selectedDate === today) {
			setAvailableTimes(
				timeSlots
					.filter((slot) => slot.start > currentHour) // Only include future time slots
					.map((slot) => slot.value)
			);
		} else if (selectedDate) {
			// If a future date is selected, include all time slots
			setAvailableTimes(timeSlots.map((slot) => slot.value));
		} else {
			// Default state when no date is selected
			setAvailableTimes([]);
		}
	}, [formData.deliveryDate]);

	return (
		<Fragment>
			<div className="flex flex-col gap-2">
				<label htmlFor="deliveryDate" className="text-lg font-medium">
					Delivery Date <span className="text-red-500">*</span>
				</label>
				<input
					type="date"
					name="deliveryDate"
					id="deliveryDate"
					value={formData.deliveryDate}
					min={today}
					onChange={handleChange}
					className="h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="deliveryTime" className="text-lg font-medium">
					Available Delivery Time <span className="text-red-500">*</span>
				</label>
				<select
					name="deliveryTime"
					id="deliveryTime"
					value={formData.deliveryTime}
					onChange={handleChange}
					className="h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
				>
					<option disabled value="">
						Select Time
					</option>
					{availableTimes.map((time) => {
						const [start, end] = time.split("-").map(Number);
						return (
							<option key={time} value={time}>
								{getFormattedTimeSlot(start, end)}
							</option>
						);
					})}
				</select>
			</div>
		</Fragment>
	);
};

export default DateTime;

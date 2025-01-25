import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSteps } from "../../context/StepContext";

interface DateTimeProps {
	onDateTimeChange: (data: { deliveryDate: string; deliveryTime: string; pickupTime: string }) => void;
}

const DateTime = ({ onDateTimeChange }: DateTimeProps) => {
	const { t } = useTranslation();
	const { state } = useSteps();
	const stepIndex = state.currentStep;

	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		deliveryDate: (state.steps[stepIndex]?.data as { deliveryDate?: string })?.deliveryDate || "",
		deliveryTime: (state.steps[stepIndex]?.data as { deliveryTime?: string })?.deliveryTime || "",
		pickupTime: (state.steps[stepIndex]?.data as { pickupTime?: string })?.pickupTime || "",
	});
	const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string; start: number; end: number }[]>([]);
	const [minTime] = useState("09:00");
	const [maxTime] = useState("23:30");

	const today = new Date().toLocaleDateString("en-CA");

	// Predefined time slots
	const timeSlots = [
		{ value: "9:00-11:00", start: 9 * 60, end: 11 * 60 },
		{ value: "11:00-13:00", start: 11 * 60, end: 13 * 60 },
		{ value: "13:00-15:00", start: 13 * 60, end: 15 * 60 },
		{ value: "15:00-17:00", start: 15 * 60, end: 17 * 60 },
		{ value: "17:00-19:00", start: 17 * 60, end: 19 * 60 },
		{ value: "19:00-21:00", start: 19 * 60, end: 21 * 60 },
		{ value: "21:00-23:00", start: 21 * 60, end: 23 * 60 },
		{ value: "23:00-24:00", start: 23 * 60, end: 0 * 60 },
	];

	const formatTime = (hour: number) => {
		const period = hour >= 12 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;
		return `${formattedHour}:00 ${period}`;
	};

	
	const getFormattedTimeSlot = (start: number, end: number) =>
		`${formatTime(start / 60)} - ${formatTime(end / 60)}`;

	// Update available time slots based on the selected date
	useEffect(() => {
		const currentDate = new Date();
		const selectedDate = new Date(formData.deliveryDate);
		const currentHour = currentDate.getHours();
		const currentMinutes = currentDate.getMinutes();

		if (state.steps[0].data === "delivery_to_location" && selectedDate.toDateString() === currentDate.toDateString()) {
			// Special case: If the time is between 10:00 PM and 10:30 PM
			if (currentHour === 22 && currentMinutes >= 0 && currentMinutes <= 30) {
				setAvailableTimeSlots(timeSlots.filter((slot) => slot.start >= 22 * 60)); // Only allow the last time slot
			} else if (currentHour >= 22 && currentMinutes > 30) {
				setAvailableTimeSlots([]); // Disable all slots for today
				setError(t("select_next_day_for_delivery")); // Error message
			} else {
				// Normal case: Filter slots based on current time + 30 minutes
				const minimumAllowedTime = currentHour * 60 + currentMinutes + 30;
				setAvailableTimeSlots(timeSlots.filter((slot) => slot.start >= minimumAllowedTime));
			}
		} else if (selectedDate > currentDate) {
			// Future dates: Allow all time slots
			setAvailableTimeSlots(timeSlots);
		} else {
			setAvailableTimeSlots([]); // Disable slots if date is invalid
		}
	}, [formData.deliveryDate, state.steps]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const updatedFormData = { ...formData, [name]: value };

		if (name === "deliveryDate") {
			updatedFormData.deliveryTime = "";
			updatedFormData.pickupTime = "";
			setError(null);
		}

		if (name === "pickupTime") {
			const [selectedHour, selectedMinute] = value.split(":").map(Number);
			const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;

			const currentDate = new Date();
			const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
			const minimumAllowedTime = formData.deliveryDate === today ? currentMinutes + 30 : 540;
			const maximumAllowedTime = 23 * 60 + 30;

			if (selectedTimeInMinutes < minimumAllowedTime || selectedTimeInMinutes > maximumAllowedTime) {
				setError(
					t("select_time_between", {
						start: formData.deliveryDate === today
							? `${Math.floor(minimumAllowedTime / 60)}:${String(minimumAllowedTime % 60).padStart(2, "0")} PM`
							: "9:00 AM",
						end: "11:30 PM",
					})
				);
				updatedFormData.pickupTime = "";
			} else {
				setError(null);
			}
		}

		setFormData(updatedFormData);
		onDateTimeChange(updatedFormData);
	};

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

			{state.steps[0].data === "delivery_to_location" ? (
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
						{availableTimeSlots.map((slot) => (
							<option key={slot.value} value={slot.value}>
								{getFormattedTimeSlot(slot.start, slot.end)}
							</option>
						))}
					</select>
					{error && <small className="text-red-500">{error}</small>}
				</div>
			) : (
				<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
					<label htmlFor="pickupTime" className="text-lg font-medium">
						{t("pickup_time")} <span className="text-red-500">*</span>
					</label>
					<input
						type="time"
						name="pickupTime"
						id="pickupTime"
						value={formData.pickupTime}
						onChange={handleChange}
						min={minTime}
						max={maxTime}
						step="1800"
						disabled={!formData.deliveryDate}
						className={`h-[37px] sm:h-[48px] px-4 rounded-md w-full ${error ? "bg-red-100 border border-red-500" : "bg-[#f9dbb8] bg-opacity-35"
							}`}
					/>
					{error && <small className="text-red-500">{error}</small>}
				</div>
			)}
		</Fragment>
	);
};

export default DateTime;

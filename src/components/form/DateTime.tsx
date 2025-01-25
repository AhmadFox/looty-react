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
	// 
	const [formData, setFormData] = useState({
		deliveryDate: (state.steps[stepIndex]?.data as { deliveryDate?: string })?.deliveryDate || "",
		deliveryTime: (state.steps[stepIndex]?.data as { deliveryTime?: string })?.deliveryTime || "",
		pickupTime: (state.steps[stepIndex]?.data as { pickupTime?: string })?.pickupTime || ""
	});
	const [error] = useState({
		deliveryDate: "" as string | null,
		deliveryTime: "" as string | null,
		pickupTime: "" as string | null
	});

	const startHours = 540 // 9:00 am
	const endHours = 1440 // 12:00 am
	const deliveryBuffer = 120 // 2 Hours

	const [availableTimeSlots, setAvailableTimeSlots] = useState<{ value: string; start: number; end: number }[]>([]);
	const [availableDateDelevery, setAvailableDateDelevery] = useState("");

	const createDeliveryTimeSlots = (startMinutes: number, endMinutes: number, deliveryBuffer: number) => {
		const slots = [];

		let currentStart = startMinutes;
		while (currentStart < endMinutes) { // Loop until currentStart is before the end time
			const currentEnd = Math.min(currentStart + deliveryBuffer, endMinutes); // Ensure the end doesn't exceed endMinutes

			const startHour = Math.floor(currentStart / 60);
			const startMinute = currentStart % 60;
			const endHour = Math.floor(currentEnd / 60);
			const endMinute = currentEnd % 60;

			// Format start and end time using the formatTime function
			const startFormatted = formatTime(startHour, startMinute);
			const endFormatted = formatTime(endHour, endMinute);

			const slotValue = `${startFormatted} - ${endFormatted}`;

			slots.push({
				value: slotValue,
				start: currentStart,
				end: currentEnd,
			});

			currentStart = currentEnd; // Set the next start time as the current end time
		}

		return slots;
	};


	const formatTime = (hour: number, minute: number) => {
		const period = hour >= 12 && hour < 24 ? "PM" : "AM";
		const formattedHour = hour % 12 || 12;
		const formattedMinute = minute < 10 ? `0${minute}` : minute;
	  
		return `${formattedHour}:${formattedMinute} ${period}`;
	};


	const getFormattedTimeSlot = (start: number, end: number) => {

		if(state.steps[0].data === "delivery_to_location") {
			if (start >= 1380) {
			  return null;  // Skip or return null if start time is 11:00 PM or later
			}
		}
	  
		const startHour = Math.floor(start / 60);
		const startMinute = start % 60;
		const endHour = Math.floor(end / 60);
		const endMinute = end % 60;
	  
		return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		const updatedFormData = { ...formData, [name]: value };

		setFormData(updatedFormData);
		onDateTimeChange(updatedFormData);
	}

	// This Effect for logic input Date
	useEffect(() => {

		const today = new Date();
		const todayString = today.toLocaleDateString("en-CA");
		const currentHour = today.getHours();
		const currentMinutes = today.getMinutes();

		if (state.steps[1].data !== null) { // for delevery citys
			if (state.steps[1].data === "Amman") {
				const availableDate = (currentHour * 60 + currentMinutes) >= endHours - 120 // if current time > 10:00Pm choosing Amman city
					? new Date(today.setDate(today.getDate() + 1)).toLocaleDateString("en-CA")
					: todayString;

				setAvailableDateDelevery(availableDate);

			} else if (
				state.steps[1].data === "Irbid" ||
				state.steps[1].data === "Zarqa" ||
				state.steps[1].data === "Balqa" ||
				state.steps[1].data === "Jerash" ||
				state.steps[1].data === "Ajloun" ||
				state.steps[1].data === "Madaba"
			) {

				const availableDate = (currentHour * 60 + currentMinutes) >= endHours - 600 // if current time > 2:59Am NOT choosing Amman city
					? new Date(today.setDate(today.getDate() + 1)).toLocaleDateString("en-CA")
					: todayString;

				setAvailableDateDelevery(availableDate);
			} else {

				console.log('availableDate Aqaba ===>', availableDateDelevery);
				setAvailableDateDelevery(new Date(today.setDate(today.getDate() + 1)).toLocaleDateString("en-CA"));

			}
		} else { // for pickup from shop
			const availableDate = (currentHour * 60 + currentMinutes) >= endHours - 30
				? new Date(today.setDate(today.getDate() + 1)).toLocaleDateString("en-CA")
				: todayString;
			
			setAvailableDateDelevery(availableDate);
		}

		setFormData((prevState) => ({
			...prevState,
			deliveryTime: ''
		}));
		setAvailableTimeSlots([]);

	}, [formData.deliveryDate]);

	// This logic for input Time Slot handler
	useEffect(() => {

		const today = new Date();
		// const todayString = today.toLocaleDateString("en-CA");
		const currentHour = today.getHours();
		const currentMinutes = today.getMinutes();


		const selectedDate = new Date(formData.deliveryDate);

		if (state.steps[0].data === "delivery_to_location") {

			if (selectedDate.toDateString() === today.toDateString()) {

				const deleveryTimeSlots = createDeliveryTimeSlots((currentHour * 60 + currentMinutes), endHours, deliveryBuffer)
				setAvailableTimeSlots(deleveryTimeSlots.filter((slot) => slot.start >= 9 * 60));

			} else {

				const deleveryTimeSlots = createDeliveryTimeSlots(startHours, endHours, deliveryBuffer)
				setAvailableTimeSlots(deleveryTimeSlots.filter((slot) => slot.start >= 9 * 60));

			}
		} else {
			if (selectedDate.toDateString() === today.toDateString()) {

				const deleveryTimeSlots = createDeliveryTimeSlots((currentHour * 60 + currentMinutes), endHours, 30)
				setAvailableTimeSlots(deleveryTimeSlots.filter((slot) => slot.start >= 9 * 60));

			} else {

				const deleveryTimeSlots = createDeliveryTimeSlots(startHours, endHours, 30)
				setAvailableTimeSlots(deleveryTimeSlots.filter((slot) => slot.start >= 9 * 60));

			}
		}

	}, [formData.deliveryDate])


	return (
		<Fragment>
			<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
				<label htmlFor="deliveryDate" className="text-lg font-medium">
					{
						state.steps[0].data === "delivery_to_location" ?
						<Fragment>
							{t("delivery_date")} <span className="text-red-500">*</span>
						</Fragment>:
						<Fragment>
							{t("pickup_date")} <span className="text-red-500">*</span>
						</Fragment>
					}
				</label>
				<input
					type="date"
					name="deliveryDate"
					id="deliveryDate"
					value={formData.deliveryDate}
					min={availableDateDelevery}
					onChange={handleChange}
					className="h-[37px] sm:h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md w-full"
				/>
				{error && <small className="text-red-500">{error.deliveryDate}</small>}
			</div>

			{
				state.steps[0].data === "delivery_to_location" ?
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
							slot.start < 1380 &&
							<option key={slot.value} value={slot.value}>
								{getFormattedTimeSlot(slot.start, slot.end)}
							</option>
						))}
					</select>
					{error && <small className="text-red-500">{error.deliveryTime}</small>}
				</div> :
				<div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
				<label htmlFor="pickupTime" className="text-lg font-medium">
					{t("pickup_time")} <span className="text-red-500">*</span>
				</label>
				<select
					name="pickupTime"
					id="pickupTime"
					value={formData.pickupTime}
					onChange={handleChange}
					disabled={!formData.deliveryDate}
					className="h-[37px] sm:h-[48px] px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md"
				>
					<option disabled value="">
						{t("select_time")}
					</option>
					{availableTimeSlots.map((slot) => (
						slot.start < 1410 &&
						<option key={slot.value} value={slot.value}>
							{getFormattedTimeSlot(slot.start, slot.end)}
						</option>
					))}
				</select>
				{error && <small className="text-red-500">{error.pickupTime}</small>}
			</div>

			}

			
		</Fragment>
	);
};

export default DateTime;

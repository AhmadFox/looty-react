import { StepState } from "../types/contexts.types";
import { useTranslation } from "react-i18next";
import { Item, DataItem } from "./type";

export const PrepareCart = (state: StepState) => {
	const stepsLength = state.steps.length;
	const stepsItems = state.steps.slice(3, stepsLength - 2);
	const { t } = useTranslation();

	const items: Item[] = [];

	stepsItems.forEach((step, stepIndex) => {
		const stepNumber = stepIndex + 1;

		// Type assertion for step.data
		const stepData = step.data as DataItem[];

		if (stepData && stepData.length > 0) {
			stepData.forEach((dataItem) => {
				items.push({
					i: dataItem.id.split('/').pop() || "", // Extract last part of the ID
					q: dataItem.quantity,
					s: stepNumber,
				});
			});
		}
	});

	let attributes = {};

	if (state.steps[0].data === "delivery_to_location") {
		attributes = {
			'Status:': t(state.steps[2]?.data as string) || "",
			'Delevery Type:': t(state.steps[0]?.data as string) || "",
			'Delevery City:': state.steps[1]?.data || "",
			'Box Title:': state.steps[stepsLength - 2]?.data || "",
			'Message:': (state.steps[stepsLength - 1]?.data as { message?: string })?.message || "",
			'Sender Name:': (state.steps[stepsLength - 1]?.data as { senderName?: string })?.senderName || "",
			'Recipient Name:': (state.steps[stepsLength - 1]?.data as { recipientName?: string })?.recipientName || "",
			'Recipient Mobile:': (state.steps[stepsLength - 1]?.data as { recipientMobile?: string })?.recipientMobile || "",
			'Delivery Date:': (state.steps[stepsLength - 1]?.data as { deliveryDate?: string })?.deliveryDate || "",
			'Delivery Time:': (state.steps[stepsLength - 1]?.data as { deliveryTime?: string })?.deliveryTime || "",
		};
	} else {
		attributes = {
			'Status:': t(state.steps[2]?.data as string) || "",
			'Delevery Type:': t(state.steps[0]?.data as string) || "",
			'Box Title:': state.steps[stepsLength - 2]?.data || "",
			'Message:': (state.steps[stepsLength - 1]?.data as { message?: string })?.message || "",
			'Pickup Date:': (state.steps[stepsLength - 1]?.data as { deliveryDate?: string })?.deliveryDate || "",
			'Pickup Time:': (state.steps[stepsLength - 1]?.data as { pickupTime?: string })?.pickupTime || "",
		};
	}

	return { items, attributes };
};

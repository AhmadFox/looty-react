import { StepState } from "../types/contexts.types";

type ItemSelection = Array<{
	id: string;
	quantity: number;
}>

export const PrepareCart = (state: StepState) => {


	const items = [];
	const orderStatus = state.steps[2]?.data || "Baked";
	const addons = state.steps[7]?.data as ItemSelection;
	const itemSelections = state.steps[3]?.data as ItemSelection;
	const itemSingleSelection1 = state.steps[4]?.data as ItemSelection;
	const itemSingleSelection2 = state.steps[5]?.data as ItemSelection;
	const printableCard = state.steps[8]?.data as ItemSelection;

	const attributes = {
		'Status:': state.steps[2]?.data || "",
		'Delevery Type:': state.steps[0]?.data || "",
		'Delevery City:': state.steps[1]?.data || "",
		'Box Title:': state.steps[6]?.data || "",
		'Message:': (state.steps[9]?.data as { message?: string })?.message || "",
		'Sender Name:': (state.steps[9]?.data as { senderName?: string })?.senderName || "",
		'Recipient Name:': (state.steps[9]?.data as { recipientName?: string })?.recipientName || "",
		'Recipient Mobile:': (state.steps[9]?.data as { recipientMobile?: string })?.recipientMobile || "",
		'Delivery Date:': (state.steps[9]?.data as { deliveryDate?: string })?.deliveryDate || "",
		'Delivery Time:': (state.steps[9]?.data as { deliveryTime?: string })?.deliveryTime || "",
	}

	if( state.selectionType !== 'single-selection' ) {
		itemSelections.forEach((item) => {
			items.push({
				id: item.id.replace("gid://shopify/ProductVariant/", ""),
				quantity: item.quantity || 1,
				properties: { _bundleId: state.fetchedData?.variantApiId, status: orderStatus },
			});
		});

	}else {
		items.push(
			{
				id: itemSingleSelection1[0].id.replace("gid://shopify/ProductVariant/", ""),
				quantity: itemSingleSelection1[0].quantity || 1,
				properties: { _bundleId: state.fetchedData?.variantApiId, status: orderStatus },
			},
			{
				id: itemSingleSelection2[0].id.replace("gid://shopify/ProductVariant/", ""),
				quantity: itemSingleSelection2[0].quantity || 1,
				properties: { _bundleId: state.fetchedData?.variantApiId, status: orderStatus },
			},
		)
	}

	if (addons && addons.length > 0) {
		addons.forEach((addon) => {
			items.push({
				id: addon.id.replace("gid://shopify/ProductVariant/", ""),
				quantity: addon.quantity || 1,
				properties: { _bundleId: state.fetchedData?.variantApiId },
			});
		});
	}

	if (printableCard && printableCard.length > 0) {
		const cardMessage = (state.steps[9].data as { message: string }).message;
		printableCard.forEach((card) => {
			items.push({
				id: card.id.replace("gid://shopify/ProductVariant/", ""),
				quantity: card.quantity || 1,
				properties: { _bundleId: state.fetchedData?.variantApiId, message: cardMessage },
			});
		});
	}

	return {items, attributes};
};
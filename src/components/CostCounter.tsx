import { Fragment, useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { useTranslation } from "react-i18next";

const CostCounter = () => {

	const { t } = useTranslation();
	const { state } = useSteps();
	const [price, setPrice] = useState("0.00");
	const currencyCode = state.fetchedData?.priceRange.minVariantPrice.currencyCode


	useEffect(() => {
		const calculateTotalPrice = () => {
			// Ensure fetchedData and its metafields exist
			if (!state.fetchedData || !Array.isArray(state.fetchedData.metafields)) return;

			// Build a price map from fetched data
			const priceMap: { [key: string]: number } = {};

			state.fetchedData.metafields.forEach((metafield) => {
				// Check if 'references' exists and is not null or undefined
				if (metafield && metafield.references && Array.isArray(metafield.references.nodes)) {
					metafield.references.nodes.forEach((node) => {
						// Ensure node.price exists before using it
						if (node.price && node.price.amount) {
							priceMap[node.id] = parseFloat(node.price.amount);
						}
					});
				}
			});

			// Calculate the total price based on selected steps
			let total = 0;

			state.steps.forEach((step) => {
				if (step.data && Array.isArray(step.data)) {
					step.data.forEach((item) => {
						// Safeguard against missing item prices
						const itemPrice = priceMap[item.id] || 0; // Default to 0 if price not found
						total += itemPrice * item.quantity;
					});
				}
			});

			setPrice(total.toFixed(2)); // Update price state
		};

		calculateTotalPrice();
	}, [state.steps]); // Re-run if steps or fetchedData change

	console.log('state', state);
	return (
		<Fragment>
			{parseInt(price) > 0 && (
				<div className="absolute bg-white p-3 sm:px-6 rounded-lg sm:rounded-xl top-4 start-4">
					<div className="flex gap-1 sm:gap-2 items-center">
						<span className="h3 text-blue-600">{price}</span>
						<span className="text-body text-base sm:text-lg font-medium text-gray-600">{currencyCode}</span>
					</div>
					<span className="hidden sm:!block text-gray-800 text-base">{t("estimated_cost")}</span>
				</div>
			)}
		</Fragment>
	);
};

export default CostCounter;

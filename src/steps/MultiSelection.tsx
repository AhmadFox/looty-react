import { useState } from "react";
import { useSteps } from "../context/StepContext";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";

const MultiSelection = () => {
	const { state, dispatch } = useSteps();
	const [itemsSelection, setItemsSelections] = useState<ChangeType[]>([]);
	const [totalSelected, setTotalSelected] = useState<number>(0);

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const maxSelection = parseInt(metafields[2]?.value || "0", 10);
	const variantsProducts = metafields[1]?.references?.nodes || [];

	const updateTotalSelected = (change: ChangeType) => {
		const existingItemIndex = itemsSelection.findIndex((item) => item.id === change.id);

		const updatedSelections = [...itemsSelection];
		if (existingItemIndex > -1) {
			// Update quantity if item exists
			if (change.quintaty === 0) {
				// Remove item if quantity is zero
				updatedSelections.splice(existingItemIndex, 1);
			} else {
				updatedSelections[existingItemIndex] = change;
			}
		} else if (change.quintaty > 0) {
			// Add new item if it doesn't exist
			updatedSelections.push(change);
		}
		
		// Ensure the total selected doesn't exceed maxSelection
		const totalQuantity = updatedSelections.reduce((total, item) => total + item.quintaty, 0);
		if (totalQuantity <= maxSelection) {
			setItemsSelections(updatedSelections);
			setTotalSelected(totalQuantity);

			// Save the updated selections in the context
			dispatch({
				type: "SET_STEP_DATA",
				payload: { stepIndex: state.currentStep, data: updatedSelections },
			});

			// Mark the step as valid
			dispatch({ type: "SET_VALID", payload: true });
		}
	};

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{variantsProducts.map(
					(
						item: {
							id: string;
							product: { title: string };
							image: { url: string };
							price: { amount: string; currencyCode: string };
						},
						idx: number
					) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							type={state.selectionType || "multi-selection"} // Ensure non-null value
							maxQuintaty={String(maxSelection)} // Convert number to string
							totalSelected={totalSelected}
							maxSelection={maxSelection}
							groupQuintaty={Number(metafields[3]?.value || 1)} // Convert number to string
							thubanailRounded="rounded-full"
							stepIndex={state.currentStep}
							updateTotalSelected={updateTotalSelected}
						/>
					)
				)}
			</ul>
		</div>
	);
};

export default MultiSelection;

import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";

const Addons = () => {
	const { state, dispatch } = useSteps();

	// Retrieve the saved selection for the current step
	const savedSelection = (state.steps[state.currentStep]?.data as Array<{ id: string; quantity: number }>) || [];

	 // Initialize totalSelected from savedSelection
	const [totalSelected, setTotalSelected] = useState(() => savedSelection.reduce((sum, item) => sum + item.quantity, 0));
	const [addons1Selections, setAddons1Selections] = useState<ChangeType[]>(savedSelection);

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const addons1MaxSelection = parseInt(metafields[6]?.value || "1", 10);
	const addonsProducts = metafields[5]?.references?.nodes || [];

	const updateTotalSelected = (change: ChangeType) => {
		
		setTotalSelected((prev) => 
			Math.min(addons1MaxSelection, Math.max(0, prev + change.quantity))
		);
	
		setAddons1Selections((prevSelections) => {
			const existingIndex = prevSelections.findIndex((item) => item.id === change.id);
			const updatedSelections = [...prevSelections];
	
			if (existingIndex >= 0) {
				// Update existing item
				const updatedItem = { ...updatedSelections[existingIndex] };
				updatedItem.quantity += change.quantity;
	
				if (updatedItem.quantity > 0) {
					updatedSelections[existingIndex] = updatedItem;
				} else {
					// Remove item if quantity becomes 0 or less
					updatedSelections.splice(existingIndex, 1);
				}
			} else if (change.quantity > 0) {
				// Add new item if quantity is positive
				updatedSelections.push(change);
			}
	
			return updatedSelections;
		});
	};

	useEffect(() => {
		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex: state.currentStep,
				data: addons1Selections,
			},
		});
	}, [addons1Selections, dispatch, state.currentStep])

	// Restore `totalSelected` when navigating back to this component
	useEffect(() => {
		const savedTotalSelected = savedSelection.reduce((sum, item) => sum + item.quantity, 0);
		setTotalSelected(savedTotalSelected);
	}, [savedSelection]);

	console.log('state =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{addonsProducts.map((item,idx: number) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.variants.edges[idx].node.title || item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							optional={true}
							type="multi-selection"
							maxQuantity={String(addons1MaxSelection)}
							totalSelected={totalSelected}
							maxSelection={addons1MaxSelection}
							groupQuantity={1}
							thubanailRounded="rounded-xl"
							stepIndex={state.currentStep}
							updateTotalSelected={updateTotalSelected}
						/>
					)
				)}
			</ul>
		</div>
	);
};

export default Addons;

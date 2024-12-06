import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";

const MultiSelection = () => {
	const { state, dispatch } = useSteps();

	// Retrieve the saved selection for the current step
	const savedSelection = (state.steps[state.currentStep]?.data as Array<{ id: string; quintaty: number }>) || [];

	// Initialize totalSelected from savedSelection
	const [totalSelected, setTotalSelected] = useState(() => savedSelection.reduce((sum, item) => sum + item.quintaty, 0));
	const [selections, setSelections] = useState<ChangeType[]>(savedSelection);

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const maxSelection = parseInt(metafields[2]?.value || "1", 10);
	const variantsProducts = metafields[1]?.references?.nodes || [];

	const updateTotalSelected = (change: ChangeType) => {
		
		setTotalSelected((prev) => 
			Math.min(maxSelection, Math.max(0, prev + change.quintaty))
		);
	
		setSelections((prevSelections) => {
			const existingIndex = prevSelections.findIndex((item) => item.id === change.id);
			const updatedSelections = [...prevSelections];
	
			if (existingIndex >= 0) {
				// Update existing item
				const updatedItem = { ...updatedSelections[existingIndex] };
				updatedItem.quintaty += change.quintaty;
	
				if (updatedItem.quintaty > 0) {
					updatedSelections[existingIndex] = updatedItem;
				} else {
					// Remove item if quantity becomes 0 or less
					updatedSelections.splice(existingIndex, 1);
				}
			} else if (change.quintaty > 0) {
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
				data: selections,
			},
		});

		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 6 });

	}, [selections, dispatch, state.currentStep])

	// Restore `totalSelected` when navigating back to this component
	useEffect(() => {
		const savedTotalSelected = savedSelection.reduce((sum, item) => sum + item.quintaty, 0);
		setTotalSelected(savedTotalSelected);
	}, [savedSelection]);

	console.log('state =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{variantsProducts.map((item,idx: number) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							optional={true}
							type="multi-selection"
							maxQuintaty={String(Number(maxSelection) * Number(metafields[3]?.value || 1))}
							totalSelected={totalSelected}
							maxSelection={maxSelection}
							groupQuintaty={Number(metafields[3]?.value || 1)}
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

import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";

const MultiSelection = () => {
	const { state, dispatch } = useSteps();

	// Retrieve the saved selection for the current step
	const savedSelection = (state.steps[state.currentStep]?.data as Array<{ id: string; quantity: number }>) || [];

	// Initialize totalSelected from savedSelection
	const [totalSelected, setTotalSelected] = useState(() => savedSelection.reduce((sum, item) => sum + item.quantity, 0));
	const [selections, setSelections] = useState<ChangeType[]>(savedSelection);

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const maxSelection = parseInt(metafields[2]?.value || "1", 10);
	const variantsProducts = metafields[1]?.references?.nodes || [];

	const updateTotalSelected = (change: ChangeType) => {

		setTotalSelected((prev) =>
			Math.min(maxSelection, Math.max(0, prev + change.quantity))
		);

		setSelections((prevSelections) => {
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
				data: selections,
			},
		});

		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 6 });

		// Mark the step as valid
		if (Number(maxSelection) * Number(metafields[3]?.value || 1) === totalSelected) {
			dispatch({ type: "SET_VALID", payload: true });
		} else {
			dispatch({ type: "SET_VALID", payload: false });
		}

	}, [selections, totalSelected, dispatch, state.currentStep])

	// Restore `totalSelected` when navigating back to this component
	useEffect(() => {
		const savedTotalSelected = savedSelection.reduce((sum, item) => sum + item.quantity, 0);
		setTotalSelected(savedTotalSelected);
	}, [savedSelection]);

	const filteredProducts = variantsProducts.filter(item =>
		item.product.variants.edges.some(
			variant => variant.node.id === item.id && variant.node.availableForSale
		)
	);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{filteredProducts.map((item, idx: number) => (
					<ItemSelection
						key={idx}
						id={item.id}
						title={item.product.title}
						image={item.image.url}
						price={item.price.amount}
						currency={item.price.currencyCode}
						optional={true}
						type="multi-selection"
						maxQuantity={String(Number(maxSelection) * Number(metafields[3]?.value || 1))}
						totalSelected={totalSelected}
						maxSelection={maxSelection}
						groupQuantity={Number(metafields[3]?.value || 1)}
						thubanailRounded="rounded-full"
						stepIndex={state.currentStep}
						updateTotalSelected={updateTotalSelected}
					/>
				))}
			</ul>
		</div>
	);
};

export default MultiSelection;

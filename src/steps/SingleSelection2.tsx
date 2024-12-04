import { useSteps } from "../context/StepContext";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";

const SingleSelection1 = () => {
	const { state, dispatch } = useSteps();

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const maxSelection = parseInt(metafields[2]?.value || "1"); // Default to 1 if not present
	const variantsProducts = metafields[4].references?.nodes || []; // Default to empty array

	const updateTotalSelected = (change: ChangeType) => {
		// Save the selected preparation option
		dispatch({
			type: "SET_STEP_DATA",
			payload: { stepIndex: state.currentStep, data: [change] },
		});

		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
	};

	console.log('State =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<ul className="flex flex-col gap-6">
				{variantsProducts.map((item, idx: number ) => (
						<ItemSelection
							key={idx}
							id={item.id}
							title={item.product.title}
							image={item.image.url}
							price={item.price.amount}
							currency={item.price.currencyCode}
							type={state.selectionType || "single-selection"}
							maxQuintaty={String(maxSelection)}
							totalSelected={0}
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

export default SingleSelection1;

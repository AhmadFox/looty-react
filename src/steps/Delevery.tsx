import { useSteps } from "../context/StepContext";
import OptionsRadio from "../components/OptionsRadio";

const Delevery = () => {

	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;

	const handleOptionChange = (delevery: string) => {
		// Save the selected option
		dispatch({
		  type: "SET_STEP_DATA",
		  payload: { stepIndex, data: delevery },
		});
	
		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
	
		// Conditional navigation logic
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: delevery === "Pick Up From Shop" ? 2 : 1 })

	};

	console.log('State =>', state);
	
	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="flex flex-col gap-5">
				<OptionsRadio
					name="delevery-option"
					id="Pick Up From Shop"
					label="Pick Up from shop"
					icon="shop"
					stepIndex={stepIndex}
					onChange={handleOptionChange}
				/>
				<OptionsRadio
					name="delevery-option"
					id="Delevery To Location"
					label="Delivery to location"
					icon="delevery"
					stepIndex={stepIndex}
					onChange={handleOptionChange}
				/>
			</div>
		</div>
	);
};

export default Delevery;

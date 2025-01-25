import { useSteps } from "../context/StepContext";
import OptionsRadio from "../components/OptionsRadio"

type City = {
	name: string;
	id: string;
	optional: string;
	availability: boolean
}

const Locations = () => {

	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;
	const preparationStepIndex = 2;

	const cities = JSON.parse(
		state.fetchedData?.metafields
			?.find((field) => field?.key === 'cities_and_preparation')
			?.value || '[]'
	);

	const handleOptionChange = (id: string) => {		
		// Save the selected option
		dispatch({
		  type: "SET_STEP_DATA",
		  payload: { stepIndex, data: id },
		});

		if (state.steps[preparationStepIndex]?.data === "baked" && id !== "Amman") {
			dispatch({
			  type: "SET_STEP_DATA",
			  payload: { stepIndex: preparationStepIndex, data: null },
			});
		}
	
		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 2 });
	};

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="flex flex-col gap-5">
				{
					cities.map((city: City, idx: number) => (
						<OptionsRadio
							key={idx}
							name="delevery-cities"
							id={city.id}
							label={city.name}
							stepIndex={stepIndex}
							optional={city.optional}
							disabled={!city.availability}
							onChange={handleOptionChange}
						/>
					))
				}
			</div>
		</div>
	)
}

export default Locations

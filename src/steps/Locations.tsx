import { useSteps } from "../context/StepContext";
import OptionsRadio from "../components/OptionsRadio"

const cities = [
	{
		name: 'Amman',
		id: 'Amman'
	},
	{
		name: 'Irbid',
		id: 'Irbid'
	},
	{
		name: 'Zarqa',
		id: 'Zarqa'
	},
	{
		name: 'Mafraq',
		id: 'Mafraq'
	},
	{
		name: 'Balqa',
		id: 'Balqa'
	},
	{
		name: 'Madaba',
		id: 'Madaba'
	},
	{
		name: 'Karak',
		id: 'Karak'
	},
	{
		name: 'Tafilah',
		id: 'Tafilah'
	},
	{
		name: 'Ma\'an',
		id: 'Ma\'an'
	},
	{
		name: 'Aqaba',
		id: 'Aqaba'
	},
	{
		name: 'Jerash',
		id: 'Jerash'
	},
	{
		name: 'Ajloun',
		id: 'Ajloun'
	},
];

const Locations = () => {

	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;
	const preparationStepIndex = 2;

	const handleOptionChange = (id: string) => {		
		// Save the selected option
		dispatch({
		  type: "SET_STEP_DATA",
		  payload: { stepIndex, data: id },
		});

		if (state.steps[preparationStepIndex]?.data === "Baked" && id !== "Amman") {
			dispatch({
			  type: "SET_STEP_DATA",
			  payload: { stepIndex: preparationStepIndex, data: null },
			});
		}
	
		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 2 });
	};

	console.log('State =>', state);

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="flex flex-col gap-5">
				{
					cities.map((city, idx) => (
						<OptionsRadio
							key={idx}
							name="delevery-cities"
							id={city.id}
							label={city.name}
							stepIndex={stepIndex}
							onChange={handleOptionChange}
						/>
					))
				}
			</div>
		</div>
	)
}

export default Locations

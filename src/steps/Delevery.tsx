import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import OptionsRadio from "../components/OptionsRadio";
import { useTranslation } from "react-i18next";

const Delevery = () => {

	const { t } = useTranslation();
	const { state, dispatch } = useSteps();
	let stepIndex = state.currentStep;

	const savedSelection = state.steps[stepIndex]?.data as string || '';
	const [ delivery, setDelivery ] = useState(savedSelection);

	const handleOptionChange = (delivery: string) => {		

		setDelivery(delivery);
		stepIndex = 2
		dispatch({
			type: "SET_STEP_DATA",
			payload: { stepIndex , data: null },
		});

	};

	useEffect(() => {

		if(delivery === "pick_up_from_shop") {
			stepIndex = 1
			dispatch({
				type: "SET_STEP_DATA",
				payload: { stepIndex , data: null },
			});
		}

		stepIndex = 0
		// Save the selected option
		dispatch({
		  type: "SET_STEP_DATA",
		  payload: { stepIndex, data: delivery },
		});
	
		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
	
		// Conditional navigation logic
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: delivery === "pick_up_from_shop" ? 2 : 1 })

	}, [delivery])

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="flex flex-col gap-5">
				<OptionsRadio
					name="delivery-option"
					id="pick_up_from_shop"
					label={t('pick_up_from_shop')}
					icon="shop"
					stepIndex={stepIndex}
					onChange={handleOptionChange}
				/>
				<OptionsRadio
					name="delivery-option"
					id="delivery_to_location"
					label={t('delivery_to_location')}
					icon="delevery"
					stepIndex={stepIndex}
					onChange={handleOptionChange}
				/>
			</div>
		</div>
	);
};

export default Delevery;

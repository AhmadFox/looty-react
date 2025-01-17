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

	};

	useEffect(() => {

		if(delivery === "Pick Up From Shop") {
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
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: delivery === "Pick Up From Shop" ? 2 : 1 })

	}, [delivery])

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="flex flex-col gap-5">
				<OptionsRadio
					name="delivery-option"
					id="Pick Up From Shop"
					label={t('pick_up_from_shop')}
					icon="shop"
					stepIndex={stepIndex}
					onChange={handleOptionChange}
				/>
				<OptionsRadio
					name="delivery-option"
					id="Delivery To Location"
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

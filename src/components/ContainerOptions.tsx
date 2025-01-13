import { useSteps } from "../context/StepContext";

import { useTranslation } from 'react-i18next';

import StepHeader from "./StepHeader"
import BottomNav from "./BottomNav"
import Delevery from "../steps/Delevery"
import Locations from "../steps/Locations"
import Preparation from "../steps/Preparation"
import Selection from "../steps/Selection";
import BoxTitle from "../steps/BoxTitle"
import Additional from "../steps/Additional"

const staticStepsComponents = {
	delivery_method: Delevery,
	city: Locations,
	preparation: Preparation,
	box_title: BoxTitle,
	additional_information: Additional,
};

const ContainerOptions = () => {

	const { t } = useTranslation();
	const { state } = useSteps();
	console.log('state ==>', state);

	// const CurrentStepComponent = stepsComponents[state.currentStep];
	const CurrentStepComponent =
  	staticStepsComponents[state.steps[state.currentStep].title as keyof typeof staticStepsComponents] || Selection;


	return (
		<div className="flex flex-col justify-between h-full w-full">
			<div>
				<StepHeader
					title={t(state.steps[state.currentStep].title)}
					subTitle={t(state.steps[state.currentStep].subTitle)}
				/>
				<CurrentStepComponent />
			</div>
			<BottomNav
				isNextDisabled={!state.steps[state.currentStep].isValid}
			/>
		</div>
	)
}

export default ContainerOptions

import { useSteps } from "../context/StepContext";

import { useTranslation } from 'react-i18next';

import StepHeader from "./StepHeader"
import BottomNav from "./BottomNav"
import Delevery from "../steps/Delevery"
import Locations from "../steps/Locations"
import Preparation from "../steps/Preparation"
import MultiSelection from "../steps/MultiSelection"
import SingleSelection1 from "../steps/SingleSelection1"
import SingleSelection2 from "../steps/SingleSelection2"
import BoxTitle from "../steps/BoxTitle"
import Addons from "../steps/Addons"
import PrintableCards from "../steps/PrintableCards"
import Additionaliformation from "../steps/Additionaliformation"

const stepsComponents = [
	Delevery,
	Locations,
	Preparation,
	MultiSelection,
	SingleSelection1,
	SingleSelection2,
	BoxTitle,
	Addons,
	PrintableCards,
	Additionaliformation,
];

const ContainerOptions = () => {

	const { t } = useTranslation();
	const { state } = useSteps();
	const CurrentStepComponent = stepsComponents[state.currentStep];
	
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

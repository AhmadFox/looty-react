import { useSteps } from "../context/StepContext";

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

// Define the props interface
interface ContainerOptionsProps {
	variantAdminGraphqlApiId: string | number; // Define the expected type (e.g., string or number)
}
const ContainerOptions: React.FC<ContainerOptionsProps> = ({ variantAdminGraphqlApiId }) => {

	const { state } = useSteps();
	const CurrentStepComponent = stepsComponents[state.currentStep];
	
	return (
		<div className="flex flex-col justify-between h-full w-full">
			<div>
				<StepHeader
					title={state.steps[state.currentStep].title}
					subTitle={state.steps[state.currentStep].subTitle}
				/>
				<CurrentStepComponent />
			</div>
			<BottomNav
				variantApiId={String(variantAdminGraphqlApiId)}
				isNextDisabled={!state.steps[state.currentStep].isValid}
			/>
		</div>
	)
}

export default ContainerOptions

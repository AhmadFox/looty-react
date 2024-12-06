import { StepsProvider } from "./context/StepContext";

import ContainerView from "./components/ContainerView";
import ContainerOptions from "./components/ContainerOptions";

export const variantApiId = "43594928259212";

const App = () => {
	return (
		<StepsProvider
			productHandle="group-selection"
		>
			<main className="page-width p-0 sm:px-8 flex flex-col sm:grid sm:grid-cols-2 sm:gap-9 md:gap-14 lg:gap-16 h-full">
				<ContainerView />
				<ContainerOptions />
			</main>
		</StepsProvider>
	);
}

export default App;

// single-selection
// 43594934976652

// multi-selection
// 43594933043340

// group-selection
// 43594928259212
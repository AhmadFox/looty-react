import { StepsProvider } from "./context/StepContext";

import ContainerView from "./components/ContainerView";
import ContainerOptions from "./components/ContainerOptions";

const App = () => {
	return (
		<StepsProvider
			productHandle="single-selection"
		>
			<main className="page-width p-0 sm:px-8 flex flex-col sm:grid sm:grid-cols-2 sm:gap-9 md:gap-14 lg:gap-16 h-full">
				<ContainerView />
				<ContainerOptions variantAdminGraphqlApiId="43594934976652" />
			</main>
		</StepsProvider>
	);
}

export default App;
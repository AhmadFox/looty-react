import { StepsProvider } from "./context/StepContext";

import { useTranslation } from "react-i18next";

import ContainerView from "./components/ContainerView";
import ContainerOptions from "./components/ContainerOptions";

const App = () => {

	const { i18n } = useTranslation();
	i18n.changeLanguage('en');
	return (
		<StepsProvider
			productHandle="single-selection"
			variantApiId ={43594934976652}
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
// 43620356948108
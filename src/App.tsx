import { StepsProvider } from "./context/StepContext";

import { useTranslation } from "react-i18next";

import ContainerView from "./components/ContainerView";
import ContainerOptions from "./components/ContainerOptions";

const App = () => {

	const { i18n } = useTranslation();
	i18n.changeLanguage('en');
	return (
		<StepsProvider
			productHandle="i-love-you-package"
			variantApiId ={49674273423657}
			language={'en'}
		>
			<main className="page-width p-0 sm:px-8 flex flex-col sm:grid sm:grid-cols-2 sm:gap-9 md:gap-14 lg:gap-16 h-full">
				<ContainerView />
				<ContainerOptions />
			</main>
		</StepsProvider>
	);
}

export default App;

// lab2een
// pid:49674273423657

// i-love-you-package
// 49674767499561

// group-selection-1
// 43693893714060
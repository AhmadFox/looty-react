import { useState } from "react";
import { useSteps } from "../context/StepContext";
import { addToCart } from "../graphql";

import { useTranslation } from "react-i18next";

interface BottomNavProps {
	isNextDisabled: boolean;
}


const BottomNav: React.FC<BottomNavProps> = ({ isNextDisabled }) => {

	const { t } = useTranslation();
	const { state, dispatch } = useSteps();
	const [progress, setProgress] = useState<number>(0);
	const lastStep = state.steps.length -1;

	// handle navigation (next/back) with set progress bar percentage
	const handleNavigation = (status: "increment" | "decrement") => {
		
		const adjustment = status === "increment" ? 10 : -10;
		setProgress((prev) => Math.min(100, Math.max(0, prev + adjustment)));

		if (status === "increment" && state.currentStep < state.steps.length - 1) {
			dispatch({ type: "NEXT_STEP" });
		} else {
			dispatch({ type: "PREVIOUS_STEP" });
		}

		window.scrollTo({
			top: 0,
			behavior: 'smooth', // This creates a smooth scrolling effect
		});
	};

	return (
		<nav className="bg-[#f9dbb8] sm:bg-white sticky bottom-0">
			<div className="relative w-full bg-[#5a0616] bg-opacity-30 h-[4px] block sm:hidden">
				<span className="absolute bg-[#5a0616] top-0 start-0 h-full z-10 ease-in-out duration-300" style={{ width: `${progress}%` }}></span>
			</div>
			<div className="py-4 px-9 sm:px-0 md:pb-16 flex justify-between items-center gap-4">
				{
					progress > 0 &&
					<button
						onClick={() => handleNavigation("decrement")}
						className={`border border-[#5a0616] text-[#5a0616] rounded-full capitalize font-medium ${state.currentStep === lastStep ? 'p-4' : 'py-4 px-16'}`}
					>
						{state.currentStep === lastStep ?
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
							</svg>: t("back")}
					</button>
				}
				{
					state.currentStep === lastStep ?
						<button
							disabled={isNextDisabled}
							onClick={() => addToCart(state)}
							className="w-full border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							{t("add_to_cart")}
						</button> :
						<button
							disabled={isNextDisabled}
							onClick={() => handleNavigation("increment")}
							className="border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							{t("next")}
						</button>
				}
			</div>
		</nav>
	);
};

export default BottomNav;

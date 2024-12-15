import { useState } from "react";
import { useSteps } from "../context/StepContext";
import { BoxViewProps } from "../steps/types";
import ViewHeader from "./ViewHeader";
import ViewHeaderLoader from "./skeleton/ViewHeaderLoader";
import TimeLine from "./TimeLine";
import { useTranslation } from "react-i18next";

const ContainerView = () => {

	const { t } = useTranslation();
	const { state } = useSteps();
	const [ collaps, setCollaps ] = useState(true);


	const productData = state.fetchedData as BoxViewProps | null;
	
	return (
		<div
			style={{ height: collaps ? '100vh' : '180px' }}
			className="px-8 sm:px-0 h-auto sm:!h-full flex flex-col sticky top-[5.3rem] z-[1] ease-in-out duration-500"
		>
			<div className="sm:sticky bg-white sm:top-[5.3rem] lg:top-[6.1rem] pt-6 sm:pt-16 pb-6 sm:border-b sm:border-gray-100 relative z-20">
				{
					productData ?
						<ViewHeader
							title={productData.title}
							img={productData.featuredImage.url}
						/> :
						<ViewHeaderLoader />
				}
				<button
					onClick={() => setCollaps(!collaps)}
					className="fixed p-3 flex justify-center items-center rounded-full bg-white z-[10] end-[2.5rem] top-[18rem] sm:hidden"
				>
					{
						collaps ? 
							<div className="">
								<span className="sr-only">Collaps Summary</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-7 stroke-red-800">
									<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
								</svg>
							</div>:
							<div className="">
								<span className="sr-only">Expand Summary</span>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-7 stroke-red-800">
									<path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
								</svg>
							</div>
							
					}
				</button>
			</div>
			<div className={`sm:!block sm:!h-auto overflow-hidden h-auto ease-in-out duration-500
				${!collaps ? 'h-0' : 'h-screen'}	
			`}>
				<p className="h3 text-center my-2">{t("order_details")}</p>
				<TimeLine />
			</div>
		</div>
	);
};

export default ContainerView;

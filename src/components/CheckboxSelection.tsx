import { useState } from "react";
import { useSteps } from "../context/StepContext";
import { CheckboxSelectionProps } from "../steps/types";
import { useTranslation } from "react-i18next";

const CheckboxSelection: React.FC<CheckboxSelectionProps> = ({
	id,
	title,
	optional,
	price,
	currency,
	image,
	thubanailRounded,
	stepIndex,
	handelSelected
}) => {

	const { t } = useTranslation();
	const { state } = useSteps();
	const savedSelection = state?.steps[stepIndex + 1]?.data as Array<{ id: string }> || null;	
	const [checked, setChecked] = useState(savedSelection ? true : false);	

	// Handle selection for radio button
	const handleCheckboxChange = () => {		
		setChecked(!checked);
		handelSelected(!checked);
	};

	return (
		<li className="flex justify-between items-center">
			<label className="flex items-center gap-6 cursor-pointer" htmlFor={id}>
				<img
					src={image}
					alt={`item ${title} in the box`}
					className={`w-28 md:w-32 h-28 md:h-32 object-cover bg-slate-100 ${thubanailRounded}`}
				/>
				<div className="flex flex-col gap-3">
					<span className="text-2xl font-medium h2 text-[#202020] capitalize flex items-center gap-x-2">
						{title} {optional && <small className="text-gray-400 font-normal text-base">({t("optional")})</small>}
					</span>
					<span className="text-blue-600 font-medium text-xl">
						{optional && "+"}
						{price} {currency}
					</span>
				</div>
			</label>
			<label className="relative flex items-center gap-3 h-8 rounded-full cursor-pointer peer" htmlFor={id}>
				<input
					name="printable-card"
					type="checkbox"
					onChange={handleCheckboxChange}
					id={id}
					checked={checked}
					className="peer hidden"
				/>
				<div className="h-8 px-3.5 !block rounded-md border border-gray-300 peer-checked:border-[#5a0616] peer-checked:after:opacity-100 after:content-[''] after:w-4 after:h-4 after:bg-[#5a0616] after:opacity-0 relative after:absolute after:top-1/2 after:rounded-[2px] after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after-bg-gray-400"></div>
			</label>
		</li>
	)
}

export default CheckboxSelection

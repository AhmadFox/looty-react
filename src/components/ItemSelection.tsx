import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { ItemSelectionProps } from "../steps/types";
import { useTranslation } from "react-i18next";

const ItemSelection: React.FC<ItemSelectionProps> = ({
	id,
	title,
	variantTitle,
	optional,
	price,
	currency,
	image,
	type,
	totalSelected,
	maxQuantity,
	maxSelection,
	groupQuantity,
	cardStyle,
	stepIndex,
	updateTotalSelected
}) => {	

	const { t } = useTranslation();
	const { state } = useSteps();

	// Retrieve the saved selection for this step
	const savedSelection = state.steps[stepIndex]?.data as Array<
	{
		id: string;
		quantity: number;
		image: string;
		title: string;
		price: string;
		maxCharacters: string;
	}
	> || [];

	// Find the matching saved selection (if any)
	const savedItem = savedSelection.find((item) => item.id === id);
	const initialCount = savedItem ? savedItem.quantity : 0;
	
	const [count, setCount] = useState(initialCount);
	const [checked, setChecked] = useState(savedSelection.length > 0);	
	
	const handleDecrement = () => {
		if (count > 0) {
			setCount((prev) => prev - groupQuantity);
			updateTotalSelected(
				{ 
					id,
					quantity: - groupQuantity,
					image: image,
					title: title,
					price: price || "",
					maxCharacters: "",
				}
			);
		}
	};

	const handleIncrement = () => {		
		const maxCount = parseInt(maxQuantity, 10); // Ensure maxQuantity is treated as a number
		if (count < maxCount && totalSelected < maxCount) {
			setCount((prev) => prev + groupQuantity);
			updateTotalSelected(
				{ 
					id,
					quantity: groupQuantity,
					image: image,
					title: title,
					price: price || "",
					maxCharacters: "",
				}
			);
		}
	};

	// Handle selection for radio button
	const handleRadioChange = () => {		
		setChecked(!checked);
		updateTotalSelected(
			{ 
				id,
				quantity: 1,
				image: image,
				title: title,
				price: price || "",
				maxCharacters: "",
			}
		);
	};

	useEffect(() => {
		if (totalSelected >= Number(maxQuantity) && count === 0) {
			setCount(0); // Reset count if it wasn't selected
		}
	}, [totalSelected, maxSelection, count, checked]);

	// Determine whether the item should be "disabled" (dimmed) based on selection
	const isDimmed = type !== "single-selection" && totalSelected >= Number(maxQuantity)  && count === 0;

	return (
		<li className={`flex justify-between items-center ${isDimmed ? "opacity-30 select-none" : ""}`}>
			<label className="flex items-center gap-6 cursor-pointer" htmlFor={id}>
				<img
					src={image}
					alt={`item ${title} in the box`}
					className={`w-28 md:w-32 h-28 md:h-32 object-cover bg-slate-100 ${cardStyle === 'portrait' ? 'rounded-lg' : 'rounded-full'}`}
				/>
				<div className="flex flex-col gap-3">
					<span className="text-2xl font-medium h2 text-[#202020] capitalize flex items-center gap-x-2">
						{
							cardStyle !== 'portrait' ?
							<div className="">
								{title}{" "} {optional && <small className="text-gray-400 font-normal text-base">({t("optional")})</small>}
							</div>:
							<div className="">
								{variantTitle}{" "} {optional && <small className="text-gray-400 font-normal text-base">({t("optional")})</small>}
							</div>
						}
					</span>
					<span className="text-blue-600 font-medium text-xl">
						{optional && "+"}
						{price} {currency}
					</span>
				</div>
			</label>
			{type === "multi-selection" ? (
				<div className="flex gap-4 items-center">
					<button
						disabled={count === 0}
						onClick={handleDecrement}
						className="w-10 h-10 rounded-full bg-gray-300 text-gray-800"
					>
						-
					</button>
					<span className="text-[#5a0616]">{count}</span>
					<button
						disabled={count === parseInt(maxQuantity, 10) || totalSelected >= Number(maxQuantity)}
						onClick={handleIncrement}
						className="w-10 h-10 rounded-full bg-gray-300 text-gray-800"
					>
						+
					</button>
				</div>
			) :  (
				<label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor={id}>
					<input
						name={type}
						type="radio"
						id={id}
						checked={savedSelection[0]?.id as string === id}
						onChange={handleRadioChange}
						className="before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-full border border-gray-400 text-[#5a0616] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#5a0616] checked:before:bg-[#5a0616] hover:before:opacity-10"
					/>
					<span className="absolute text-[#5a0616] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
							<circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
						</svg>
					</span>
				</label>
			)}
		</li>
	);
};

export default ItemSelection;

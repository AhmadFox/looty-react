import { useState, useEffect } from "react";
import { useSteps } from "../context/StepContext";
import { useTranslation } from "react-i18next";

interface SelectedPrintableCardProps {
	onChangeMessage: (message: string) => void;
}
const SelectedPrintableCard: React.FC<SelectedPrintableCardProps> = ({ onChangeMessage }) => {

	const { t } = useTranslation();
	const { state, dispatch } = useSteps();
	const [emptyPrintableCard, setEmptyPrintableCard] = useState(false);
	const [messageCount, setMessageCount] = useState(0);
	const [error, setError] = useState(true);
	const currency = state.fetchedData?.priceRange.minVariantPrice.currencyCode;
	const stepIndex = state.currentStep;
	const [ message, setMessage ] = useState((state.steps[stepIndex]?.data as { message?: string })?.message || "");

	const selectableCard = state.printableCard?.product as Array<
	{
		id: string;
		quantity: number;
		image: string;
		title: string;
		price: string;
		maxCharacters: string;
	}
	> || null;
	
	const messageHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const messageLength = event.target.value.length; // Get the length of the text
		setMessageCount(messageLength); // Update state with the length
		onChangeMessage(event.target.value);
		setMessage(event.target.value);
	};
	

	const handelChangeCard = () => {		
		onChangeMessage('');
		
		if (state.printableCard) {
			dispatch({
				type: "GOTO_STEP",
				payload: state.printableCard.stepIndex,
			});
		}
	};

	const handelRemoveCard = () => {
		
		setEmptyPrintableCard(true);
		onChangeMessage('')

		if (state.printableCard) {
			dispatch({
				type: "SET_STEP_DATA",
				payload: {
					stepIndex: state.printableCard.stepIndex,
					data: null,
				},
			});
			dispatch({
				type: "SET_PRINTABLE_CARD",
				payload: {
					printable: true,
					product: [],
					stepIndex: state.printableCard.stepIndex
				},
			});
		}

	};

	useEffect(() => {
		// Check if the placeholder is not empty
		if (messageCount === 0) {
			setError(true);
		  } else {
			setError(false); // Reset error if placeholder is empty
		  }
	}, [messageCount]);


	if (!selectableCard || emptyPrintableCard || selectableCard.length === 0) {
		return (
			<div className="col-span-2 my-2 sm:mt-4">
				{/* Add Printable Card Button */}
				<button
					type="button"
					onClick={handelChangeCard}
					className="flex items-center gap-4"
				>
					<div className="h-20 w-20 border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
						+
					</div>
					<div className="flex flex-col gap-1">
						<span className="h4 text-xl">{t("add_printable_card")}?</span>
						<div className="flex gap-2">
							<span className="text-gray-600 text-lg font-medium">{t("start_from")}</span>
							<span className="text-blue-400 text-lg font-medium">+1 {currency}</span>
						</div>
					</div>
				</button>
			</div>
		);
	}

	return (
		<div className="col-span-2">
			{/* Selected Card Information */}
			<div className="flex gap-3 col-span-2 mb-6 items-center">
				<img
					src={selectableCard[0].image || ""}
					alt={selectableCard[0].title}
					className="w-20 h-20 rounded-lg"
				/>
				<div className="flex justify-between items-center w-full">
					<div className="flex flex-col gap-2">
						<span className="text-lg font-medium capitalize">{selectableCard[0].title}</span>
						<span className="text-blue-600 text-lg font-medium">{selectableCard[0].price} {currency}</span>
					</div>
					<div className="flex flex-col gap-3">
						<button
							onClick={handelChangeCard}
							type="button"
							className="text-blue-600 text-lg font-medium"
						>
							{t("change_card")}
						</button>
						<button
							onClick={handelRemoveCard}
							type="button"
							className="text-red-500 text-lg font-medium"
						>
							{t("remove_card")}
						</button>
					</div>
				</div>
			</div>

			{/* Message Section */}
			<div className="flex flex-col gap-2 col-span-2">
				<label htmlFor="message" className="text-lg font-medium">
				{t("message")} <span className="text-red-500">*</span>
				</label>
				<textarea
					rows={4}
					id="message"
					maxLength={Number(selectableCard[0].maxCharacters)}
					value={message}
					onChange={messageHandler}
					placeholder={t("message_on_printable_card")}
					className="py-3 px-4 bg-[#f9dbb8] bg-opacity-35 rounded-md w-full resize-none"
				/>
				<div className="flex justify-between text-base">
					<small className="text-red-500">
						{
							error ? t('message_canot_be_empty') : ''
						}
					</small>
					<span>{messageCount}/{selectableCard[0].maxCharacters} {t("charachters")}</span>
				</div>
				{/* {
					error && <small className="text-red-500">{error}</small>
				} */}
			</div>
		</div>
	);
};

export default SelectedPrintableCard;

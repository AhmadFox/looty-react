import { useState } from "react";
import { useSteps } from "../context/StepContext";

const PrintableCards = () => {
	const { state, dispatch } = useSteps();
	const stepIndex = state.currentStep;

	// Retrieve the previously selected card ID from global state (step data)
	const savedSelection = state.steps[stepIndex].data as Array<{id: string, quintaty: number}>;
	console.log('savedSelection', savedSelection);
	
	const [selectedCard, setSelectedCard] = useState(savedSelection || null);

	// Safely access fetched data
	const metafields = state.fetchedData?.metafields || [];
	const printableCards = metafields[7]?.references?.nodes || []; // Default to empty array

	const handleCardSelection = (id: string) => {
		setSelectedCard([{id: id, quintaty: 1}]); // Set the selected card locally

		// Save the selected card ID to the global state
		dispatch({
			type: "SET_STEP_DATA",
			payload: { stepIndex, data: [{id: id, quintaty: 1}] },
		});

		// Mark the step as valid
		dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: stepIndex + 1 });
	};

	return (
		<div className="px-8 py-8 sm:px-0">
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
				{printableCards.map((card, idx) => (
					<div
						key={idx}
						id={card.id}
						onClick={() => handleCardSelection(card.id)}
						className={`flex flex-col gap-3 rounded-xl p-3 cursor-pointer ease-in-out duration-300
									${ selectedCard && selectedCard[0]?.id === card.id ? "bg-[#f9dbb8]" : "bg-transparent"}`
						}
					>
						<div className="relative">
							<img
								src={card.image.url}
								alt={`Printable card ${card.product.variants?.edges[idx]?.node?.title || card.product.title
									} thumbnail`}
								className="rounded-xl"
							/>
							<span className="absolute bottom-2 py-2 px-4 rounded-full left-1/2 block w-3/4 text-center -translate-x-1/2 bg-white text-base font-medium">
								Max: {card.product.variants.edges[idx].node.metafields[0].value || "255"} Char
							</span>
						</div>
						<div className="flex flex-col">
							<p className="h3 capitalize text-center text-xl line-clamp-1">
								{card.product.variants?.edges[idx]?.node?.title || card.product.title}
							</p>
							<span className="text-blue-600 font-medium text-lg text-center">
								+{card.price.amount} {card.price.currencyCode}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default PrintableCards;

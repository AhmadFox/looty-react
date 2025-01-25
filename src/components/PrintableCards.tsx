import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { PrintableCardsProps } from "../steps/types";
import { useTranslation } from "react-i18next";

type Variant = { 
	id: string;
	image: { 
		url: string; 
	};
	metafield?: {
		value: string;
	};
	title: string;
	price: { 
		amount: string;
		currencyCode: string;
	};
}

type Product = {
    title: string;
    tags?: string[];
    productType?: string;
    variants: {
        nodes: Array<{
            title: string;
            price: {
                amount: string;
                currencyCode: string;
            };
            id: string;
            image: {
                url: string;
            };
            metafield?: {
                value: string;
            };
        }>;
    };
};

const PrintableCards: React.FC<PrintableCardsProps> = ({
	productsVariant,
	savedSelection,
	stepIndex,
}) => {	
	const { t } = useTranslation();
	const { state, dispatch } = useSteps();

	const [selectedCard, setSelectedCard] = useState<Array<{
		id: string;
		quantity: number;
		image: string;
		title: string;
		price: string;
		maxCharacters: string;
	}>>(
		savedSelection?.map((item) => ({
			...item,
			image: item.image || "",
			title: item.title || "",
			price: item.price || "",
			maxCharacters: "255",
		})) || []
	);

	const handleCardSelection = (id: string, variant: Variant) => {
		if (selectedCard[0]?.id === id) {
			setSelectedCard([]); // Deselect the card
		} else {
			setSelectedCard([
				{
					id,
					quantity: 1,
					image: variant.image.url,
					title: variant.title,
					price: variant.price.amount,
					maxCharacters: variant.metafield?.value || "",
				},
			]);
		}
	};

	useEffect(() => {
		if (savedSelection) {
			const updatedSelection = savedSelection.map((item) => ({
				...item,
				image: item.image || "",
				title: item.title || "",
				price: item.price || "",
				maxCharacters: item.maxCharacters || "255", // Default value
			}));
			setSelectedCard(updatedSelection);
		}
	}, [savedSelection]);

	useEffect(() => {
		const productType = findProductType(productsVariant);

		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex,
				data: selectedCard.map((item) => ({
					id: item.id,
					quantity: item.quantity,
					image: item.image,
					title: item.title,
					price: item.price,
					maxCharacters: item.maxCharacters || "", // Include maxCharacters
				})),
			},
		});

		if (productType === "printable") {
			
			dispatch({
				type: "SET_PRINTABLE_CARD",
				payload: { 
					printable: true,
					stepIndex: stepIndex,
					product: selectedCard.map((item) => ({
						id: item.id,
						quantity: item.quantity,
						image: item.image,
						title: item.title,
						price: item.price,
						maxCharacters: item.maxCharacters || "", // Include maxCharacters
					})),
				},
			});
		}
	}, [selectedCard, state.currentStep, productsVariant, dispatch, stepIndex]);

	useEffect(() => {

		dispatch({
			type: "SET_PRINTABLE_CARD",
			payload: { 
				printable: false,
				stepIndex: stepIndex,
				product: []
			},
		});

	}, [])

	function findProductType(products: Product[]): string | undefined {
		if (!products || !Array.isArray(products)) {
			throw new Error("Invalid input: products must be an array.");
		}
	
		for (const product of products) {
			if (product.productType) {
				return product.productType;
			}
		}
	
		return undefined;
	}

	return (
		<div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
			{productsVariant.map((product) => (
				product.variants.nodes.map((variant: Variant, idx: number) => (
					<div
						key={idx}
						id={variant.id}
						onClick={() => handleCardSelection(variant.id, variant)}
						className={`flex flex-col gap-3 rounded-xl p-3 cursor-pointer ease-in-out duration-300
							${selectedCard && selectedCard[0]?.id === variant.id ? "bg-[#f9dbb8]" : "bg-transparent"}`
						}
					>
						<div className="relative">
							<img
								src={variant.image.url}
								alt={`Printable card ${variant.title || product.title} thumbnail`}
								className="rounded-xl"
							/>
							{variant.metafield?.value && (
								<span className="absolute bottom-2 py-2 px-4 rounded-full left-1/2 block w-3/4 text-center -translate-x-1/2 bg-white text-base font-medium">
									{t("max")}: {variant.metafield?.value} {t("char")}
								</span>
							)}
						</div>
						<div className="flex flex-col">
							<p className="h3 capitalize text-center text-xl line-clamp-1">
								{variant.title || product.title}
							</p>
							<span className="text-blue-600 font-medium text-lg text-center">
								+{variant.price.amount} {variant.price.currencyCode}
							</span>
						</div>
					</div>
				))
			))}
		</div>
	);
};

export default PrintableCards;

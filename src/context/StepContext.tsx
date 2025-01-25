import React, { createContext, useReducer, useContext, useEffect } from "react";
import { initialState, stepsReducer } from "./StepReducer";
import { getBundle } from "../graphql";
import { StepState, Action, ProductData } from "../types/contexts.types";

// Create Context
const StepsContext = createContext<{
	state: StepState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => { } });

// StepsProvider Component
export const StepsProvider: React.FC<
	React.PropsWithChildren<{ productHandle: string, variantApiId: number, language: string }>
> = ({ children, productHandle, variantApiId, language }) => {
	const [state, dispatch] = useReducer(stepsReducer, initialState);

	// Fetch Bundle Data
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const bundleData = await getBundle(productHandle, language);
				if (bundleData) {
					// Map `Product` to `ProductData` type
					const productDataFormatted: ProductData = {
						id: bundleData.id,
						title: bundleData.title,
						featuredImage: bundleData.featuredImage,
						tags: bundleData.tags as [],
						seo: bundleData?.seo || {},
						priceRange: bundleData.priceRange,
						metafields: bundleData.metafields as [],
						variants: bundleData.variants as [],
						variantApiId: variantApiId as number,
						productId: Number(bundleData.id),
						language: language as string,
						market: bundleData.variantBySelectedOptions.storeAvailability.edges as []

					};

					dispatch({
						type: "SET_FETCHED_DATA",
						payload: productDataFormatted,
					});

					const selectionType = bundleData.tags;					
					const validSelectionTypes = ["multi-selection", "single-selection", "group-selection"] as const;

					const matchedSelectionType = selectionType?.find((tag) =>
					validSelectionTypes.includes(tag as typeof validSelectionTypes[number])
					) as typeof validSelectionTypes[number] | null;

					// Dispatch with the matched value
					dispatch({ type: "SET_SELECTION_TYPE", payload: matchedSelectionType });
					
				}
			} catch (err) {
				console.error("Error fetching product:", err);
			}
		};

		fetchProduct();
	}, [productHandle]);

	return (
		<StepsContext.Provider value={{ state, dispatch }}>
			{children}
		</StepsContext.Provider>
	);
};

// Custom Hook to Access Context
export const useSteps = () => useContext(StepsContext);

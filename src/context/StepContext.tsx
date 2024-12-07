import React, { createContext, useReducer, useContext, useEffect } from "react";
import { initialState, stepsReducer } from "./StepReducer";
import { getProduct } from "../graphql";
import { StepState, Action, ProductData } from "../types/contexts.types";

// Create Context
const StepsContext = createContext<{
	state: StepState;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => { } });

// StepsProvider Component
export const StepsProvider: React.FC<
	React.PropsWithChildren<{ productHandle: string }>
> = ({ children, productHandle }) => {
	const [state, dispatch] = useReducer(stepsReducer, initialState);

	// Fetch product data
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const productData = await getProduct(productHandle);				
				if (productData) {
					// Map `Product` to `ProductData` type
					const productDataFormatted: ProductData = {
						featuredImage: productData.featuredImage,
						images: productData.images,
						title: productData.title,
						tags: productData.tags as [],
						updatedAt: productData.updatedAt,
						variants: productData.variants as [],
						seo: productData?.seo || {},
						priceRange: productData.priceRange,
						options: productData.options,
						metafields: productData.metafields as []

					};
					dispatch({
						type: "SET_FETCHED_DATA",
						payload: productDataFormatted,
					});

					const selectionType = productData.tags;
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

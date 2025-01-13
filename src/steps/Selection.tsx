import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { getVariants } from "../graphql";
import { ChangeType } from "./types";
import ItemSelection from "../components/ItemSelection";
import ItemSelectionLoader from "../components/skeleton/ItemSelectionLoader";
import PrintableCards from "../components/PrintableCards";
import PrintableCardsLoader from "../components/skeleton/PrintableCardsLoader";

type TargetVariant = {
	title: string;
	description: string;
	quantity_increment: number;
	required: string;
	selection_type: string;
	maximum_quantity: number;
	minimum_quantity: number;
	maximum_selectable: number;
	variants: string[];
	variants_unavailable: string[];
	card_style: string;
};

type Variant = {
	key: string;
	type: string;
	value: string;
};

type ProductVariant = {
	id: string;
	title: string;
	image: { url: string };
	price: { amount: string; currencyCode: string };
};

type Product = {
	id: string;
	title: string;
	tags: [];
	variants: { nodes: ProductVariant[] };
};

const Selection = () => {
	
	const { state, dispatch } = useSteps();
	const [ isItemUpdate, setIsItemUpdate ] = useState(false);
	const [ selectionType, setSelectionType ] = useState("");
	const [ generalProducts, setGeneralProducts ] = useState<Product[]>([]);
	const [ productsVariant, setProductsVariant ] = useState<Product[]>([]);
	
	// Retrieve the saved selection for the current step
	const [ savedSelection, setSavedSelection ] = useState((state.steps[state.currentStep]?.data as Array<
		{
			id: string;
			quantity: number;
			image: string;
			title: string;
			price: string;
			maxCharacters: string;
		}
		>) || [])
	
	// Initialize totalSelected from savedSelection
	const [totalSelected, setTotalSelected] = useState(0);
	const [selections, setSelections] = useState<ChangeType[]>(savedSelection);
	
	// Get current step data products
	const variantKeyIndex = state.currentStep - 2;

	// Safely access fetched data
	const variants: Variant[] = state.fetchedData?.variants || [];
	const targetVariantSettings = variants.find(
		(item) => item.key === `step_settings_${variantKeyIndex}`
	);
	const targetVariantProducts = variants.find(
		(item) => item.key === `products_list_${variantKeyIndex}`
	);

	if (!targetVariantSettings || !targetVariantProducts) {
		console.error("Missing target variant settings or products.");
		return <p>Error loading step data.</p>;
	}

	// Parse JSON safely
	const targetVariantSettingsJson: TargetVariant = JSON.parse(
		targetVariantSettings.value
	);	

	const targetVariantProductsJson: string[] = JSON.parse(
		targetVariantProducts.value
	);

	// Function to filter response based on targetVariantIds
	const filterVariants = (response: Product[], targetVariantIds: string[]) => {
		return response
			.map((product) => {
				const filteredNodes = product.variants.nodes.filter((node) => {
					const variantId = node.id.split("/").pop();
					return targetVariantIds.includes(variantId || "");
				});

				if (filteredNodes) {
					return {
						...product,
						variants: {
							nodes: filteredNodes,
						},
					};
				}
				return null;
			})
			.filter((product): product is Product => product !== null);
	};

	// Fetch data products for the current step
	useEffect(() => {

		const fetchTargetVariantsProducts = async () => {
			setProductsVariant([]);
			try {
				const response = await getVariants(targetVariantProductsJson, "en");

				if (Array.isArray(response)) {
					setGeneralProducts(response);
				} else {
					console.error("Unexpected response structure:", response);
				}
				
			} catch (error) {
				console.error(
					"Error fetching or filtering target variant products:",
					error
				);
			}
		};

		// Check if step has item selected or is it optional step
		const validNavigation = ((targetVariantSettingsJson.required === '0' ? true : false) || (state.steps[state.currentStep].data ? true : false))

		dispatch({
			type: "SET_VALID",
			payload: validNavigation
		});

		fetchTargetVariantsProducts();

		setSelections(savedSelection);
		setTotalSelected(savedSelection.reduce((sum, item) => sum + item.quantity, 0))		

	}, [state.currentStep]);

	useEffect(() => {
		
		if (generalProducts.length > 0) {
			const filteredProductsVariants = filterVariants(
				generalProducts,
				targetVariantSettingsJson.variants
			);
			setProductsVariant(filteredProductsVariants);
			setSelectionType(targetVariantSettingsJson.selection_type === 's' ? "single-selection" : 'multi-selection')
		}

		const savedTotalSelected = savedSelection.reduce((sum, item) => sum + item.quantity, 0);
		setTotalSelected(savedTotalSelected);
		setSelections(savedSelection)

	}, [generalProducts, state.currentStep]);

	const updateTotalSelected = (change: ChangeType) => {

		

		if( selectionType === 'multi-selection' ) {
			
			setTotalSelected((prev) => prev + change.quantity);
	
			setSelections((prevSelections) => {
				const existingIndex = prevSelections.findIndex((item) => item.id === change.id);
				const updatedSelections = [...prevSelections];
	
				if (existingIndex >= 0) {
					// Update existing item
					const updatedItem = { ...updatedSelections[existingIndex] };
					updatedItem.quantity += change.quantity;
	
					if (updatedItem.quantity > 0) {
						updatedSelections[existingIndex] = updatedItem;
					} else {
						// Remove item if quantity becomes 0 or less
						updatedSelections.splice(existingIndex, 1);
					}
				} else if (change.quantity > 0) {
					// Add new item if quantity is positive
					updatedSelections.push(change);
				}
	
				return updatedSelections;
			});

		} else {			
			setTotalSelected(1);
			setSelections([change]);

		}

		setIsItemUpdate(!isItemUpdate);

	};

	useEffect(() => {

		setSavedSelection((state.steps[state.currentStep]?.data as Array<{
			id: string;
			quantity: number;
			image: string;
			title: string;
			price: string;
			maxCharacters: string;
		}>) || [])
	}, [state.currentStep])

	// Restore `totalSelected` when navigating back to this component
	useEffect(() => {

		const savedTotalSelected = savedSelection.reduce((sum, item) => sum + item.quantity, 0);
		setTotalSelected(savedTotalSelected);
		setSelections(savedSelection)

	}, [savedSelection, state.currentStep]);


	useEffect(() => {

		dispatch({
			type: "SET_STEP_DATA",
			payload: {
				stepIndex: state.currentStep,
				data: selections,
			},
		});

		// Mark the step as valid
		const validNavigation = targetVariantSettingsJson.required === '0' ? true : false;
		if ( targetVariantSettingsJson.maximum_quantity === totalSelected || validNavigation ) {
			dispatch({ type: "SET_VALID", payload: true });
		} else {
			dispatch({ type: "SET_VALID", payload: false });
		}

	}, [isItemUpdate, state.currentStep, productsVariant, selections, totalSelected]);

	return (
		<div className="px-8 py-8 sm:px-0">

			{
				(targetVariantSettingsJson.selection_type === 's' && targetVariantSettingsJson.required === '0') ?
				<div className="">
					{productsVariant.length > 0 ?
					<PrintableCards
						stepIndex={state.currentStep}
						productsVariant={productsVariant}
						savedSelection={savedSelection}
					/>:
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
						<PrintableCardsLoader />
						<PrintableCardsLoader />
						<PrintableCardsLoader />
					</div>
					}
				</div>:
				<ul className="flex flex-col gap-6">
					{productsVariant.length > 0 ? (
						productsVariant.map((product) => (
							product.variants.nodes.map((variant, idx) => (
								<ItemSelection
									key={idx}
									id={variant.id}
									title={product.title}
									variantTitle={variant.title}
									image={variant.image.url || ""}
									price={variant.price.amount || ""}
									currency={variant.price.currencyCode || ""}
									optional={targetVariantSettingsJson.required === '0' ? true : false}
									type={selectionType}
									totalSelected={totalSelected}
									maxQuantity={String(targetVariantSettingsJson.maximum_quantity)}
									maxSelection={targetVariantSettingsJson.maximum_selectable}
									groupQuantity={targetVariantSettingsJson.quantity_increment}
									cardStyle={targetVariantSettingsJson.card_style}
									stepIndex={state.currentStep}
									updateTotalSelected={updateTotalSelected}
								/>
							))
						))
					) : (
						<div className="flex flex-col gap-6">
							<ItemSelectionLoader />
							<ItemSelectionLoader />
							<ItemSelectionLoader />
							<ItemSelectionLoader />
							<ItemSelectionLoader />
						</div>
					)}
				</ul>
			}
		</div>
	);
};

export default Selection;
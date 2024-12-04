import { useState } from "react";
import { useSteps } from "../context/StepContext";
import { addToCart, updateCart } from "../graphql";

interface BottomNavProps {
	variantApiId: string;
	isNextDisabled: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ variantApiId, isNextDisabled }) => {
	const { state, dispatch } = useSteps();
	const [progress, setProgress] = useState<number>(0);

	// handle navigation (next/back) with set progress bar percentage
	const handleNavigation = (status: "increment" | "decrement") => {
		const adjustment = status === "increment" ? 10 : -10;
		setProgress((prev) => Math.min(100, Math.max(0, prev + adjustment)));

		if (status === "increment") {
			dispatch({ type: "NEXT_STEP" });
		} else {
			dispatch({ type: "PREVIOUS_STEP" });
		}
	};

	const prepareCartItems = (): Item[] => {
		const { steps, selectionType } = state;

		const itemSelection1Id = steps[4]?.data?.id?.replace("gid://shopify/ProductVariant/", "") || "";
		const itemSelection2Id = steps[5]?.data?.id?.replace("gid://shopify/ProductVariant/", "") || "";
		const orderStatus = steps[2]?.data || "";

		const items: Item[] = [
			{
				id: itemSelection1Id,
				quantity: 1,
				properties: { _bundleId: variantApiId, status: orderStatus },
			},
		];

		if (selectionType === "single-selection") {
			items.push({
				id: itemSelection2Id,
				quantity: 1,
				properties: { _bundleId: variantApiId, status: orderStatus },
			});
		}

		return items;
	};

	const addOptionalItems = (items: Item[]): Item[] => {
		const addons = state.steps[7]?.data || [];
		const printableCardData = state.steps[8]?.data;
		let printableCardId: string = ''
		if (typeof printableCardData === "string") {
			printableCardId = printableCardData;
			
		} else {
			console.error("Expected a string for printableCardData but got:", printableCardData);
		}
		const message = state.steps[9]?.data?.message || "";

		addons.forEach((addon) => {
			items.push({
				id: addon.id.replace("gid://shopify/ProductVariant/", ""),
				quantity: addon.quantity || 1,
				properties: { _bundleId: variantApiId },
			});
		});

		if (printableCardData) {
			items.push({
				id: printableCardId.replace("gid://shopify/ProductVariant/", ""),
				quantity: 1,
				properties: { _bundleId: variantApiId, message },
			});
		}

		return items;
	};

	const handleAddToCart = async () => {
		const items = addOptionalItems(prepareCartItems());
		const attributes = {
			'Status:': state.steps[2]?.data || "",
			'Delevery Type:': state.steps[0]?.data || "",
			'Delevery City:': state.steps[1]?.data || "",
			'Box Title:': state.steps[6]?.data || "",
			'Message:': state.steps[9]?.data?.message || "",
			'Sender Name:': state.steps[9]?.data?.senderName || "",
			'Recipient Name:': state.steps[9]?.data?.recipientName || "",
			'Recipient Mobile:': state.steps[9]?.data?.recipientMobile || "",
			'Delivery Date:':state.steps[9]?.data?.deliveryDate || "",
			'Delivery Time:': state.steps[9]?.data?.deliveryTime || "",
		}
		await addToCart(items);
		await updateCart(attributes)
	};

	return (
		<nav className="bg-[#f9dbb8] sm:bg-white sticky bottom-0">
			<div className="relative w-full bg-[#5a0616] bg-opacity-30 h-[4px] block sm:hidden">
				<span className="absolute bg-[#5a0616] top-0 left-0 h-full z-10 ease-in-out duration-300" style={{ width: `${progress}%` }}></span>
			</div>
			<div className="py-4 px-9 sm:px-0 md:pb-16 flex justify-between items-center gap-4">
				{
					progress > 0 &&
					<button
						onClick={() => handleNavigation("decrement")}
						className={`border border-[#5a0616] text-[#5a0616] rounded-full capitalize font-medium ${state.currentStep === 9 ? 'p-4' : 'py-4 px-16'}`}
					>
						{state.currentStep === 9 ?
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
							</svg>: 'back'}
					</button>
				}
				{
					state.currentStep === 9 ?
						<button
							disabled={isNextDisabled}
							onClick={handleAddToCart}
							className="w-full border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							Add To Cart
						</button> :
						<button
							disabled={isNextDisabled}
							onClick={() => handleNavigation("increment")}
							className="border border-[#5a0616] bg-[#5a0616] text-[#f9dbb8] rounded-full py-4 px-16 capitalize font-medium ms-auto"
						>
							next
						</button>
				}
			</div>
		</nav>
	);
};

export default BottomNav;

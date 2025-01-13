import { Fragment, useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";
import { useTranslation } from "react-i18next";

const CostCounter = () => {
    const { t } = useTranslation();
    const { state } = useSteps();
    const [price, setPrice] = useState("0.00");
    const currencyCode = state.fetchedData?.priceRange?.minVariantPrice?.currencyCode || "JOD"; // Fallback to USD if currencyCode is not available

    useEffect(() => {
        const calculateTotalPrice = () => {
            // Ensure steps exist and are an array
            if (!state.steps || !Array.isArray(state.steps)) return;

            let total = 0;

            // Iterate over steps to calculate the total price
            state.steps.forEach((step) => {
                if (step.data && Array.isArray(step.data)) {
                    step.data.forEach((item) => {
                        const itemPrice = item.price || 0; // Use item.price or default to 0
                        const itemQuantity = item.quantity || 1; // Default quantity to 1 if not provided
                        total += itemPrice * itemQuantity;
                    });
                }
            });

            setPrice(total.toFixed(2)); // Update the price state
        };

        calculateTotalPrice();
    }, [state.steps]); // Re-run the effect if steps change

    return (
        <Fragment>
            {parseInt(price) > 0 && (
                <div className="absolute bg-white p-3 sm:px-6 rounded-lg sm:rounded-xl top-4 start-4">
                    <div className="flex gap-1 sm:gap-2 items-center">
                        <span className="h3 text-blue-600">{price}</span>
                        <span className="text-body text-base sm:text-lg font-medium text-gray-600">{currencyCode}</span>
                    </div>
                    <span className="hidden sm:!block text-gray-800 text-base">{t("estimated_cost")}</span>
                </div>
            )}
        </Fragment>
    );
};

export default CostCounter;

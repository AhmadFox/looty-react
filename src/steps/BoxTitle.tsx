import { useSteps } from "../context/StepContext";
import OptionsRadio from "../components/OptionsRadio";

const BoxTitle = () => {
    const { state, dispatch } = useSteps();

    // Safely parse titles from metafields or fallback to an empty array
    let titles = [];
    const metafields = state.fetchedData?.metafields || [];
    titles = JSON.parse(metafields[0].value || "[]"); // Default to empty array

    // Handle change event
    const handleOptionChange = (title: string) => {
        // Save the selected option in the context
        dispatch({
            type: "SET_STEP_DATA",
            payload: { stepIndex: state.currentStep, data: title },
        });

        // Mark the step as valid
        dispatch({ type: "SET_VALID", payload: true });
		dispatch({ type: "SET_PENDING_NEXT_STEP", payload: 7 });
    };

    return (
        <div className="px-8 py-8 sm:px-0">
            <div className="flex flex-col gap-5">
                {titles.map((item: string, idx: number) => (
                    <OptionsRadio
                        key={idx}
                        name="box-title"
                        id={item}
                        label={item} // Fix here to use `item` directly
                        stepIndex={state.currentStep}
                        onChange={handleOptionChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default BoxTitle;

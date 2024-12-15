import { StepState, Action } from "../types/contexts.types";

// Initial Steps Configuration
export const initialSteps = [
	{ title: "delivery_method", subTitle: "select_delivery_method", isValid: false, data: null },
	{ title: "city", subTitle: "select_delivery_to_location", isValid: false, data: null },
	{ title: "preparation", subTitle: "preparation_type", isValid: false, data: null },
	{ title: "select_sandwiches", subTitle: "choose_multiple_options_from_sandwiches", isValid: false, data: null },
	{ title: "select_sandwich", subTitle: "choose_one_option", isValid: false, data: null },
	{ title: "select_drink", subTitle: "choose_one_option_drink", isValid: false, data: null },
	{ title: "box_title", subTitle: "select_title_print_on_the_box", isValid: true, data: null }, // Optional Step
	{ title: "add_ons", subTitle: "add_special_your_addons", isValid: true, data: null }, // Optional Step
	{ title: "printable_card_type", subTitle: "select_printable_cards_type", isValid: true, data: null }, // Optional Step
	{ title: "additional_information", subTitle: "provide_additional_information", isValid: false, data: null },
];

// Initial State
export const initialState: StepState = {
	currentStep: 0,
	steps: initialSteps,
	history: [],
	fetchedData: null,
	selectionType: null,
};

// Reducer Function
export const stepsReducer = (state: StepState, action: Action): StepState => {
	switch (action.type) {
		case "NEXT_STEP": {
			const nextStep = state.currentStep + 1;
			return {
				...state,
				history: [...state.history, state.currentStep], // Push current step to history
				currentStep: state.pendingNextStep ?? Math.min(nextStep, state.steps.length - 1),
				pendingNextStep: undefined, // Reset after navigation
			};
		}

		case "PREVIOUS_STEP":
			return {
				...state,
				currentStep: state.history[state.history.length - 1] || 0, // Navigate to the last step in history or fallback to 0
				history: state.history.slice(0, -1), // Remove the last step from history
			};

		case "SET_VALID":
			return {
				...state,
				steps: state.steps.map((step, index) =>
					index === state.currentStep ? { ...step, isValid: action.payload } : step
				),
			};

		case "SET_STEP_DATA":
			return {
				...state,
				steps: state.steps.map((step, index) =>
					index === action.payload.stepIndex ? { ...step, data: action.payload.data } : step
				),
			};

		case "SET_PENDING_NEXT_STEP":
			return { ...state, pendingNextStep: action.payload };

		case "SET_FETCHED_DATA":
			if (!action.payload || typeof action.payload !== "object") {
				throw new Error("Invalid fetched data payload");
			}
			return { ...state, fetchedData: action.payload };
			

		case "SET_SELECTION_TYPE":
			return { ...state, selectionType: action.payload };

		default:
			return state;
	}
};
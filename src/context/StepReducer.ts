import { StepState, Action } from "../types/contexts.types";

// Initial Steps Configuration
export const initialSteps = [
	{ title: "Delivery Method", subTitle: "Select delivery Method", isValid: false, data: null },
	{ title: "City", subTitle: "Select delivery to location", isValid: false, data: null },
	{ title: "Preparation", subTitle: "Preparation Type", isValid: false, data: null },
	{ title: "Select Sandwichs", subTitle: "Choose multiple options from Sandwichs", isValid: false, data: null },
	{ title: "Select Sandwich", subTitle: "Choose one option", isValid: false, data: null },
	{ title: "Select Drink", subTitle: "Choose one option", isValid: false, data: null },
	{ title: "Box Title", subTitle: "Select Title Print On The Box", isValid: true, data: null }, // Optional Step
	{ title: "Add-Ons", subTitle: "Add Speatal your addons", isValid: true, data: null }, // Optional Step
	{ title: "Printable Card Type", subTitle: "Select printable cards type", isValid: true, data: null }, // Optional Step
	{ title: "Additional Information", subTitle: "Provide additional information", isValid: false, data: null },
];

// Initial State
export const initialState: StepState = {
	currentStep: 3,
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
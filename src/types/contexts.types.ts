// import { ProductOption } from "../graphql/types";

export type ProductData = {
	id: string;
	title: string;
	featuredImage: {
		url: string;
	};
	// images: Array<{
	// 	url: string;
	// 	altText: string;
	// 	width: number;
	// 	height: number;
	// }>;
	// updatedAt: string;
	tags: Array<{
		key: number | null;
		value: string | null;
	}>
	seo: Record<string, unknown>;
	priceRange: {
		maxVariantPrice: {
			amount: string;
			currencyCode: string;
		};
		minVariantPrice: {
			amount: string;
			currencyCode: string;
		};
	};
	// options: ProductOption[];
	variants: Array<{
		key: string;
		type: string;
		value: string;
		price: { amount: string; currencyCode: string };
		metafields: Array<{
			key: string;
			type: string;
			value: string | null;
			references?: {
				nodes: Array<{
					id: string;
					product: { title: string };
					price: { amount: string; currencyCode: string };
					image: { url: string };
				}>;
			};
		}>;
	}>;
	metafields: Array<{
		key: string;
		type: string;
		value: string;
		references?: {
			nodes?: Array<{
				id: string;
				image: {
					url: string;
				}
				price: {
					amount: string;
					currencyCode: string;
				}
				product: {
					title: string;
					variants: {
						edges: Array<{
							node: {
								title: string
								id: string
								availableForSale?: boolean
								metafields: Array<{
									value: string
								}>
							}
						}>
					}
				}
			}>
		}
	}>;
	variantApiId: number;
	productId: number;
	language: string;
	market: Array<{
		node: {
			available: boolean;
			pickUpTime: string;
			location: {
				name: string;
				address: {
					address1: string;
					address2: string;
					city: string;
					country: string;
					latitude: number;
					longitude: number;
					phone: string;
				}
			}
		}
	}>;
};

export type DataType = {
	data?: string | {
		id: string;
		quantity: number;
		price: string;
		title: string;
		image: string;
		maxCharacters: string;
  }[] | {
	  senderName: string;
	  recipientName: string;
	  recipientMobile: string;
	  recipientAddress: string;
	  deliveryTime: string;
	  deliveryDate: string;
	  message?: string | undefined;
  } | undefined;
  title: string;
  }

export type StepState = {
	currentStep: number;
	steps: Array<{
		title: string;
		subTitle: string;
		isValid: boolean;
		data: string | Array<
			{
				id: string;
				quantity: number;
				image?: string;
				title?: string;
				price?: string;
				maxCharacters?: string;
			}
		> | null | [] | unknown;
	}>;
	pendingNextStep?: number;
	history: number[];
	fetchedData: ProductData | null;
	printableCard: PrintableCardData | null;
	selectionType: "multi-selection" | "single-selection" | "group-selection" | null;
};

export type PrintableCardData = {
	printable: boolean;
	stepIndex: number;
	product: Array<{
		id: string;
		quantity: number;
		image: string;
		title: string;
		price: string;
	}>
}

export type Action =
	| { type: "NEXT_STEP" }
	| { type: "PREVIOUS_STEP" }
	| { type: "GOTO_STEP"; payload: number }
	| { type: "SET_VALID"; payload: boolean }
	| { type: "SET_STEP_DATA"; payload: { stepIndex: number; data: unknown } }
	| { type: "SET_PENDING_NEXT_STEP"; payload: number }
	| { type: "SET_FETCHED_DATA"; payload: ProductData | null }
	| { type: "SET_PRINTABLE_CARD"; payload: PrintableCardData | null }
	| { type: "SET_SELECTION_TYPE"; payload: "multi-selection" | "single-selection" | "group-selection" | null };

	
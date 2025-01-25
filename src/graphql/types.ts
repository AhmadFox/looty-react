export type Edge<T> = {
	node: T;
};
export type Connection<T> = {
	edges: Array<Edge<T>>;
	nodes: Array<T>;
};

export type Money = {
	amount: string;
	currencyCode: string;
};

export type Image = {
	url: string;
	altText: string;
	width: number;
	height: number;
};

export type Bundle = Omit<ShopifyProduct, 'variants' | 'metafields'> & {
	metafields: Metafields[];
	variants: Variants;
};

export type ShopifyProductOperation = {
	data: { 
		product: ShopifyProduct;
		nodes: unknown;
	};
	variables: {
		handle?: string;
		ids?: unknown;
	};
};

export type ProductOption = {
	id: string;
	name: string;
	values: string[];
};

export type ProductVariant = {
	id: string;
	title: string;
	availableForSale: boolean;
	selectedOptions: {
		name: string;
		value: string;
	}[];
	price: Money;
	metafields: Metafields
};

export type Metafields = Array<{
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



export type ShopifyProduct = {
	id: string;
	handle: string;
	ids?: [];
	availableForSale: boolean;
	title: string;
	description: string;
	descriptionHtml: string;
	options: ProductOption[];
	priceRange: {
		maxVariantPrice: Money;
		minVariantPrice: Money;
	};
	metafields: Metafields[];
	// variants: Connection<ProductVariant>;
	variants: Connection<{
		metafields: Metafield[]; // Aligns with how `getBundle` processes `metafields`
		price?: {
			amount: string;
			currencyCode: string;
		};
		id?: string;
	}>;
	featuredImage: Image;
	images: Connection<Image>;
	tags: string[];
	updatedAt: string;
	seo: Record<string, unknown>;
	bundle: unknown;
	variantBySelectedOptions: {
		storeAvailability: {
			edges: [];
		}
	}
};

export interface Metafield {
	key: string;
	type: string;
	value: string | null;
}

export type Variants = Array<{
	price?: {
		amount: string;
		currencyCode: string;
	};
	metafields: Metafield[];
}> | Metafield[];

export type StepDataItem = {
    id: string;
    quantity: number;
    image: string;
    title: string;
    price: string;
    maxCharacters?: string;
};

export interface ProductData {
	title: string;
	featuredImage: {
		id: string;
		url: string;
	};
	variants: {
		nodes: Array<{
			price: {
				amount: string;
				currencyCode: string;
			};
			metafields: Array<Metafield | null>;
		}>;
	};
}
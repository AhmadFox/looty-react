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

export type Product = Omit<ShopifyProduct, 'variants' | 'images' | 'metafields'> & {
	images: Image[];
	variants: ProductVariant[];
	metafields: Metafields[];
};

export type ShopifyProductOperation = {
	data: { product: ShopifyProduct };
	variables: {
		handle: string;
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

export type Metafields = {
	metafields: Array<{
		key: string;
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
}

export type ShopifyProduct = {
	id: string;
	handle: string;
	availableForSale: boolean;
	title: string;
	description: string;
	descriptionHtml: string;
	options: ProductOption[];
	priceRange: {
		maxVariantPrice: Money;
		minVariantPrice: Money;
	};
	variants: Connection<ProductVariant>;
	featuredImage: Image;
	images: Connection<Image>;
	tags: string[];
	updatedAt: string;
	seo: Record<string, unknown>;
};

export interface Metafield {
	key: string;
	value: string | null;
}

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
const endpoint = import.meta.env.VITE_SHOPIFY_ENDPOINT;
const endpointAPI = import.meta.env.VITE_SHOPIFY_GRAPHQL_API;
const key = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

import { getProductQuery } from "./queries/product";
import { isShopifyError } from "./type-guards";
import { Product, ShopifyProductOperation } from "./types";

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

// const cartDrawer = document.querySelector("cart-drawer") as HTMLElement & {
// 	getSectionsToRender: () => { id: string }[];
// };

export async function shopifyFetch<T>({
	cache = 'force-cache',
	headers,
	query,
	tags,
	variables
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query?: string;
	tags?: string[];
	variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
	try {
		const result = await fetch(endpointAPI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': key,
				...headers
			},
			body: JSON.stringify({
				...(query && { query }),
				...(variables && { variables })
			}),
			cache,
			...(tags && { next: { tags } })
		});

		const body = await result.json();

		if (body.errors) {
			throw body.errors[0];
		}

		return {
			status: result.status,
			body
		};
	} catch (e) {
		if (isShopifyError(e)) {
			throw {
				cause: e.cause?.toString() || 'unknown',
				status: e.status || 500,
				message: e.message,
				query
			};
		}

		throw {
			error: e,
			query
		};
	}
}


export async function getProduct(handle: string): Promise<Product | undefined> {
	const res = await shopifyFetch<ShopifyProductOperation>({
		query: getProductQuery,
		tags: ["products"],
		variables: {
			handle
		}
	});

	const shopifyProduct = res.body.data.product;
	const product: Product = {
		...shopifyProduct,
		variants: shopifyProduct.variants.edges.map((edge) => edge.node),
		metafields: shopifyProduct.variants.nodes.flatMap((item) => item.metafields),
		images: shopifyProduct.images.edges.map((edge) => edge.node),
	};

	return product;
}

export async function addToCart(items: unknown) {
	console.log('Items ==>', items);	
	const res = await fetch(`${endpoint}/cart/add.js`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			items,
			// sections: cartDrawer.getSectionsToRender().map((section) => section.id),
		})
	})

	if(!res.ok) {
		throw new Error("Failed to add items to cart");
	}
}

export async function updateCart(attributes: unknown) {
	console.log('Items ==>', attributes);	
	const res = await fetch(`${endpoint}/cart/add.js`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			attributes: attributes,
			// sections: cartDrawer.getSectionsToRender().map((section) => section.id),
		})
	})

	if(!res.ok) {
		throw new Error("Failed to add items to cart");
	}
}
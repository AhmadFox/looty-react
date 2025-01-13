import { PrepareCart } from "../libs/PrepareCart";
import { StepState } from "../types/contexts.types";
// import { StepState } from "../types/contexts.types";
import { getbundleQuery, getVariantsQuery } from "./queries/product";
import { isShopifyError } from "./type-guards";

import { Bundle, ShopifyProductOperation } from "./types";

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

const cartDrawer = document.querySelector('cart-drawer') as HTMLElement & {
	getSectionsToRender: () => { id: string }[];
	renderContents: (data: unknown) => void;
};

export async function shopifyFetch<T>({
	cache = 'force-cache',
	headers,
	query,
	tags,
	lang,
	variables
}: {
	cache?: RequestCache;
	headers?: HeadersInit;
	query?: string;
	tags?: string[];
	lang: string;
	variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
	try {
		const result = await fetch("http://127.0.0.1:9292/api/2024-10/graphql.json", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': lang,
				'X-Shopify-Storefront-Access-Token': "4b42fa6bda0566197fe7d761c1f2e5b3",
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

export async function getBundle(handle: string, lang: string): Promise<Bundle | undefined> {
	const res = await shopifyFetch<ShopifyProductOperation>({
		query: getbundleQuery,
		tags: ["products"],
		lang,
		variables: {
			handle
		}
	});

	const shopifyProduct = res.body.data.product;
	const bundle: Bundle = {
		...shopifyProduct,
		metafields: shopifyProduct.metafields,
		variants: shopifyProduct.variants.nodes.flatMap((node) => node.metafields),
	};

	return bundle;
}

export async function getVariants(ids: unknown, lang: string) {
	const res = await shopifyFetch<ShopifyProductOperation>({
		query: getVariantsQuery,
		tags: ["products"],
		lang,
		variables: {
			ids
		}
	});

	const variants = res.body.data.nodes || [];

	return variants;
}

export async function addToCart(state: StepState) {
	const { items, attributes } = PrepareCart(state);

	console.log('items ==>', items);
	console.log('attributes ==>', attributes);
	
	function addBundleToCart() {
		const payload = {
			quantity: 1, // Quantity of the item
			form_type: "product",
			utf8: "✓",
			id: "43594934976652", // Variant ID
			"product-id": "8015719301260", // Product ID
			"section-id": "template--17779398279308__main",
			properties: {
				_bundleId: "NGHU-43688891154572",
				_selectedItems: JSON.stringify([
					{ i: "43424696926348", q: 1, s: 1 },
					{ i: "43424697057420", q: 1, s: 1 },
					{ i: "43424696795276", q: 1, s: 1 },
					{ i: "43424696729740", q: 1, s: 1 }
				]),
				"Step 1": "1x CHEESCAKE - Small, 1x KINDER - Small, 1x MARSHMALLOW - Small, 1x PISTACHIO - Small"
			},
			sections: "cart-drawer,cart-icon-bubble",
			sections_url: "/products/biscuits-bundle-product"
		};
	
		fetch('/cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
		.then(response => response.json())
		.then(data => {
			cartDrawer.renderContents(data);
			console.log('Item added to cart:', data);
			// Optionally update the cart UI
		})
		.catch(error => {
			console.error('Error adding to cart:', error);
		});
	}
	
	// Trigger add to cart
	addBundleToCart();	
	
}

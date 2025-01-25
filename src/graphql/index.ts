import { PrepareCart } from "../libs/PrepareCart";
import { StepState } from "../types/contexts.types";
import { getbundleQuery, getVariantsQuery } from "./queries/product";
import { isShopifyError } from "./type-guards";

import { Bundle, ShopifyProductOperation, StepDataItem } from "./types";

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
		const result = await fetch("http://127.0.0.1:9292/api/2020-04/graphql.json", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept-Language': lang,
				// 'X-Shopify-Storefront-Access-Token': "69a310fece978a23892df251f8aa92d2",
				'X-Shopify-Storefront-Access-Token': "95ac6779dd46071c2ed8afb0f677c0fc",
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

    const stepsLength = state.steps.length;
    const stepsItems = state.steps.slice(3, stepsLength - 2);
	
    // Generate step properties dynamically
    const stepProperties: Record<string, string> = {};
    stepsItems.forEach((step, index) => {
        // Type-cast `step.data` to the expected type
        const stepData = step.data as StepDataItem[];

        const stepDescription = stepData.map(item => {
            const quantity = item.quantity;
            const title = item.title;
            const maxCharacters = item.maxCharacters ? ` - ${item.maxCharacters}` : '';
            return `${quantity}x ${title}${maxCharacters}`;
        }).join(', ');

        stepProperties[`Step ${index + 1}`] = stepDescription;
    });

    // Log step properties for debugging
    // console.log('Step Properties:', stepProperties);

    function addBundleToCart() {
        const payload = {
            quantity: 1, // Quantity of the item
            form_type: "product",
            utf8: "✓",
            id: state.fetchedData?.variantApiId, // Variant ID
            "product-id": state.fetchedData?.productId, // Product ID
            "section-id": "template--23378334351657__main",
            properties: {
                _bundleId: `NGHU-${state.fetchedData?.variantApiId}`,
                _selectedItems: JSON.stringify(items),
                // ...stepProperties, // Dynamically add step properties
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

	await fetch(`/cart/update.js`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			attributes: attributes,
		}),
	});

    // Trigger add to cart
    addBundleToCart();
}


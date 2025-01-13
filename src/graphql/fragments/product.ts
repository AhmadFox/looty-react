import seoFragment from './seo';

export const bundleFragment = /* GraphQL */ `
	fragment bundle on Product {
		id
		title
		tags
		featuredImage {
			url
		}
		seo {
			...seo
		}
		priceRange {
			maxVariantPrice {
				amount
				currencyCode
			}
			minVariantPrice {
				amount
				currencyCode
			}
		}
		metafields(
			identifiers: [
				{key: "box_title", namespace: "custom"},
				{key: "cities_and_preparation", namespace: "custom"}
			]
		) {
			key
			type
			value
		}
		variants(first: 10) {
			nodes {
				metafields(
					identifiers: [
						{ key: "step_settings_1", namespace: "app--53335195649--biscuits_app" }
						{ key: "products_list_1", namespace: "app--53335195649--biscuits_app" }
						{ key: "step_settings_2", namespace: "app--53335195649--biscuits_app" }
						{ key: "products_list_2", namespace: "app--53335195649--biscuits_app" }
						{ key: "step_settings_3", namespace: "app--53335195649--biscuits_app" }
						{ key: "products_list_3", namespace: "app--53335195649--biscuits_app" }
						{ key: "step_settings_4", namespace: "app--53335195649--biscuits_app" }
						{ key: "products_list_4", namespace: "app--53335195649--biscuits_app" }
						{ key: "step_settings_5", namespace: "app--53335195649--biscuits_app" }
						{ key: "products_list_5", namespace: "app--53335195649--biscuits_app" }

					]
				)
				{
					key
					type
					value
				}
			}
		}
	}
	${seoFragment}
`;

export const variantsFragment = /* GraphQL */ `
	fragment variants on Product {
		title
		tags
		productType
		variants(first: 100) {
			nodes {
				title
				price {
					amount
					currencyCode
				}
				id
				image {
					url
				}
				metafield(key: "printable_card_max_letters", namespace: "custom") {
					value
				}
			}
		}
	}
`;

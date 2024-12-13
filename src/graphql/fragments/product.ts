import seoFragment from './seo';
import imageFragment from './image';

const productFragment = /* GraphQL */ `
	fragment product on Product {
		title
		options {
			id
			name
			values
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
		variants(first: 1) {
			edges {
				node {
					id
					title
					availableForSale
					selectedOptions {
						name
						value
					}
					price {
						amount
						currencyCode
					}
					image {
						...image
					}
				}
			}
			nodes {
				price {
					amount
					currencyCode
				}
				metafields(
					identifiers: [
					{ key: "box_title", namespace: "custom" },
					{ key: "component_group_1", namespace: "custom" },
					{ key: "component_group_1_items_count", namespace: "custom" },
					{ key: "component_group_1_items_count_group", namespace: "custom" },
					{ key: "component_group_2", namespace: "custom" },
					{ key: "component_addons_1", namespace: "custom" },
					{ key: "component_addons_1_maximum", namespace: "custom" },
					{ key: "component_addons_2", namespace: "custom" },
					{ key: "component_addons_2_max_characters", namespace: "custom" },
					{ key: "available_in_cities", namespace: "custom" },
					]
				) {
					value
					references(first: 10) {
					nodes {
						... on ProductVariant {
							id
							product {
							title
							variants(first: 10) {
								edges {
									node {
										id
										title
										availableForSale
										metafields(
											identifiers: { key: "component_addons_2_max_characters", namespace: "custom" }
										) {
											value
										}
									}
								}
							}
							}
							price {
							amount
							currencyCode
							}
							image {
							url
							}
						}
					}
					}
					key
					type
				}
			}
		}
		featuredImage {
			...image
		}
		images(first: 20) {
			edges {
				node {
					...image
				}
			}
		}
		seo {
			...seo
		}
		tags
		updatedAt
	}
	${imageFragment}
	${seoFragment}
`;

export default productFragment;

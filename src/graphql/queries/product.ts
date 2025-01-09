import { bundleFragment, variantsFragment } from '../fragments/product';

export const getbundleQuery = /* GraphQL */ `
  query getBundle($handle: String!) {
    product(handle: $handle) {
      ...bundle
    }
  }
  ${bundleFragment}
`;

export const getVariantsQuery = /* GraphQL */ `
  query getVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        ...variants
      }
    }
  }
  ${variantsFragment}
`;
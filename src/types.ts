// types.ts
export interface Variant {
	id: number;
	title: string;
	price: number;
	// other fields for variant
  }
  
  export interface Product {
	id: number;
	title: string;
	handle: string;
	description: string;
	type: string;
	tags: string[];
	price: number;
	featured_image: string;
	variants: Variant[]; // make variants optional if it's not always present
  }
  
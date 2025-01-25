export type ChangeType = {
	id: string;
	quantity: number;
	image: string;
	title: string;
	price: string;
	maxCharacters: string;
};

export type BoxViewProps = {
	title: string;
	featuredImage: {
		url: string;
	};
};

export interface TimelineNodeProps {
	step: {
		data?: string | Array<{
			id: string;
			quantity: number;
			price: string;
			title: string;
			image: string;
			maxCharacters: string;
		}> | {
				senderName: string;
				recipientName: string;
				recipientMobile: string;
				recipientAddress: string;
				deliveryTime: string;
				deliveryDate: string;
				message?: string;
		};
		title: string;
	};
	number: number;
	isLastNode: boolean;
}
  

export type RadioSelectionProps = {
	name: string;
	id: string;
	label: string;
	icon?: string;
	optional? : string
	stepIndex: number;
	disabled?: boolean;
	onChange: (id: string) => void;
}

export type PrintableCardsProps = {
	stepIndex: number;
	savedSelection: Array<{
	  maxCharacters: string;
	  price: string;
	  title: string;
	  image: string;
	  id: string;
	  quantity: number;
	}>;
	productsVariant: Array<{
	  title: string;
	  variants: {
		nodes: Array<{
		  id: string;
		  title: string;
		  image: {
			url: string;
		  };
		  price: {
			amount: string;
			currencyCode: string;
		  };
		}>;
	  };
	}>;
  };
  

export type ItemSelectionProps = {
	id: string;
	title: string;
	variantTitle: string;
	optional?: boolean;
	price?: string;
	currency?: string;
	image: string;
	type: string;
	maxQuantity: string;
	quantityAvailable: number;
	totalSelected: number;
	maxSelection: number;
	groupQuantity: number;
	cardStyle: string;
	thubanailRounded?: string;
	stepIndex: number;
	updateTotalSelected: (change: {
		id: string;
		quantity: number;
		image: string;
		title: string;
		price: string;
		maxCharacters: string;
	}) => void; // Updated type
};


export type CheckboxSelectionProps = {
	id: string;
	title: string;
	optional?: boolean;
	price?: string;
	currency?: string;
	image: string;
	thubanailRounded?: string;
	stepIndex: number;
	handelSelected: (value: boolean) => void;
};
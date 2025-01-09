export type ChangeType = {
	id: string;
	quantity: number;
};

export type BoxViewProps = {
	title: string;
	featuredImage: {
		url: string;
	};
};

export interface TimelineNodeProps {
	data: {
		data?: string | Array<{
			id: string; quantity: number
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
	totalSelected: number;
	maxSelection: number;
	groupQuantity: number;
	cardStyle: string;
	thubanailRounded?: string;
	stepIndex: number;
	updateTotalSelected: (change: { id: string; quantity: number }) => void; // Updated type
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
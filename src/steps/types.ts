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
	optional?: boolean;
	price?: string;
	currency?: string;
	image: string;
	type: string;
	maxQuantity: string;
	totalSelected: number;
	maxSelection: number;
	groupQuantity: number;
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
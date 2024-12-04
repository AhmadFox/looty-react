export type ChangeType = {
	id: string;
	quintaty: number;
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
	stepIndex: number;
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
	maxQuintaty: string;
	totalSelected: number;
	maxSelection: number;
	groupQuintaty: number;
	thubanailRounded?: string;
	stepIndex: number;
	updateTotalSelected: (change: { id: string; quintaty: number }) => void; // Updated type
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
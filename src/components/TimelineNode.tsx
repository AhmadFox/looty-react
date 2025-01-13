import { TimelineNodeProps } from '../steps/types';
import { useTranslation } from "react-i18next";
import ItemSelectedTimeLine from './ItemSelectedTimeLine';

const TimelineNode: React.FC<TimelineNodeProps> = ({ isLastNode, step, number  }) => {

	const { t } = useTranslation();

	const generateNode = () => {
		let nodeStep = null;

		if(typeof(step.data) === 'string') {
			nodeStep = <p className="">{step.data}</p>

		} else if (Array.isArray(step?.data)) {
			nodeStep = 
				<div className="grid grid-cols-3 gap-4">
				{
					step?.data && Array.isArray(step?.data) && step?.data.map((item, idx: number) => (
						<ItemSelectedTimeLine
							key={idx}
							quantity={item.quantity}
							title={item.title}
							image={item.image}
						/>
					))
				}
			</div>
		} else if (typeof step?.data === 'object' && step?.data !== null) {
			nodeStep = 
				<div>
					<p>{t("sender_name")}: {(step?.data as { senderName: string })?.senderName}</p>
					<p>{t("recipient_name")}: {(step?.data as { recipientName: string })?.recipientName}</p>
					<p>{t("recipient_mobile")}: {(step?.data as { recipientMobile: string })?.recipientMobile}</p>
					<p>{t("recipient_address")}: {(step?.data as { recipientAddress: string })?.recipientAddress}</p>
					<p>{t("delivery_time")}: {(step?.data as { deliveryTime: string })?.deliveryTime}</p>
					<p>{t("delivery_date")}: {(step?.data as { deliveryDate: string })?.deliveryDate}</p>
					{(step?.data as { message?: string })?.message && (
						<p>{t("message")}: {(step?.data as { message?: string })?.message}</p>
					)}
				</div>
		}
		
		return nodeStep;
	};



	return (
		<div
			className={`relative ${step?.data ? '' : 'cursor-not-allowed select-none opacity-50'}`}
		>
			<div className="flex items-start mb-8">
				<div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${step?.data ? 'border-[#5a0616] bg-[#5a0616] text-[#f9dbb8]' : 'border-gray-300 bg-white'} flex items-center justify-center z-10  ease-in-out duration-300`}>
					<span className={`text-lg font-bold ${step?.data ? 'border-[#5a0616] text-[#f9dbb8]' : 'border-gray-300'}`}>{number}</span>
				</div>
				<div className="ms-6">
					<h1 className="text-xl font-bold">{t(step?.title)}</h1>
					<div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out`}>
						{generateNode()}
					</div>
				</div>
			</div>
			{!isLastNode && (
				<div
					className={`absolute !block start-6 top-12 w-0.5 h-[calc(100%_-_1rem)] -ms-px  ease-in-out duration-300
						${step?.data ? 'bg-[#5a0616]' : 'bg-gray-300'}`}
				></div>
			)}
		</div>
	);
}

export default TimelineNode;

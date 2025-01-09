import { useSteps } from '../context/StepContext';
import { TimelineNodeProps } from '../steps/types';
import ItemSelectedTimeLine from './ItemSelectedTimeLine';
import { useTranslation } from "react-i18next";

const TimelineNode: React.FC<TimelineNodeProps> = ({ isLastNode, data, number  }) => {

	const { i18n } = useTranslation(); // Get i18n instance
	const { t } = useTranslation();
	const { state } = useSteps();

	// console.log('item vew Log data ====>', data);

	return (
		<div
			className={`relative ${data?.data ? 'cursor-pointer' : 'cursor-not-allowed select-none opacity-50'}`}
		>
			<div className="flex items-start mb-8">
				<div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 ${data?.data ? 'border-[#5a0616] bg-[#5a0616] text-[#f9dbb8]' : 'border-gray-300 bg-white'} flex items-center justify-center z-10  ease-in-out duration-300`}>
					<span className={`text-lg font-bold ${data?.data ? 'border-[#5a0616] text-[#f9dbb8]' : 'border-gray-300'}`}>{number}</span>
				</div>
				<div className="ms-6">
					<h1 className="text-xl font-bold">{t(data?.title)}</h1>
					<div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out`}>
						{
							data?.title === 'delivery_method' ?
								<div className="">
									{
										data?.data === "Pick Up From Shop" ?
										<div className="flex items-center gap-2">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} className="size-11 stroke-gray-800 me-1">
												<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
											</svg>
											<p className="text-[#5a0616]">
												{i18n.language === 'ar' ? (
													'استلم من المتجر'
												) : (
													'Pick Up From Shop'
												)}
											</p>
										</div> :
										<div className="flex items-center gap-2">
											{
												data?.data &&
												<div className="flex items-center gap-2">
													<svg xmlns="http://www.w3.org/2000/svg" width="28.675" height="22.746" viewBox="0 0 28.675 22.746"><g transform="translate(-5.892 -38.8)"><path d="M26.125,178.449H20.19a.368.368,0,0,1,0-.736h5.936a.368.368,0,0,1,0,.736Z" transform="translate(-13.93 -120.887)" /><path d="M5.314,156.286H.216c-.119,0-.216-.164-.216-.368s.1-.368.216-.368h5.1c.119,0,.216.165.216.368S5.433,156.286,5.314,156.286Z" transform="translate(6.842 -101.601)" /><path d="M5.342,134.124H.368a.368.368,0,1,1,0-.736H5.342a.368.368,0,1,1,0,.736Z" transform="translate(6.663 -82.314)" /><path d="M22.591,111.961h-2.4a.368.368,0,1,1,0-.736h2.4a.368.368,0,1,1,0,.736Z" transform="translate(-13.93 -63.027)" /><path d="M67.17,99.323H59.9a1.566,1.566,0,0,1-1.563-1.564V93.732A1.565,1.565,0,0,1,59.9,92.168h5.7a1.565,1.565,0,0,1,1.563,1.563ZM59.9,92.9a.837.837,0,0,0-.836.836v4.028a.837.837,0,0,0,.836.836h6.541V93.732a.837.837,0,0,0-.836-.836Z" transform="translate(-49.018 -46.443)" /><path d="M205.362,106.763h-.2a1.811,1.811,0,1,1,0-3.622h.2a.8.8,0,0,1,.8.8v2.028A.8.8,0,0,1,205.362,106.763Zm-.2-2.894a1.083,1.083,0,1,0,0,2.167h.2a.069.069,0,0,0,.069-.069v-2.029a.069.069,0,0,0-.069-.069Z" transform="translate(-175.216 -55.992)" /><path d="M200.371,163.426l-.038,0a.363.363,0,0,1-.3-.228,3.492,3.492,0,1,1,6.573-2.347.364.364,0,0,1-.454.458,4.879,4.879,0,0,0-5.477,1.956A.363.363,0,0,1,200.371,163.426Zm2.911-4.282a2.766,2.766,0,0,0-2.748,3.11,5.622,5.622,0,0,1,5.084-1.816,2.76,2.76,0,0,0-2.336-1.294Z" transform="translate(-172.11 -104.093)" /><path d="M141.806,45.126c-1.774,0-3.444-2.253-3.444-4,0-.869.447-2.327,3.444-2.327a3.163,3.163,0,1,1,0,6.325Zm0-5.6c-1.8,0-2.716.538-2.716,1.6,0,1.351,1.4,3.271,2.716,3.271a2.435,2.435,0,1,0,0-4.87Z" transform="translate(-118.657)" /><path d="M161.929,63.374l-.689-2.349a.985.985,0,0,1,1.175-1.235l2.44.586-.053.333a3.162,3.162,0,0,1-2.551,2.607Zm.253-2.885a.257.257,0,0,0-.183.081.252.252,0,0,0-.061.25l.5,1.7a2.436,2.436,0,0,0,1.572-1.6l-1.763-.423A.286.286,0,0,0,162.183,60.49Z" transform="translate(-138.532 -18.242)" /><path d="M188.167,101.415a.59.59,0,0,1-.248-.055,2.88,2.88,0,0,0-1.049-.233.364.364,0,0,1-.342-.363V99.509a.364.364,0,0,1,.364-.364h.75a1.108,1.108,0,0,1,1.107,1.107v.581a.582.582,0,0,1-.583.582Zm-.911-.982a3.5,3.5,0,0,1,.766.183v-.363a.38.38,0,0,0-.38-.38h-.386Z" transform="translate(-160.573 -52.515)" /><path d="M125.138,87.276a.363.363,0,0,1-.16-.037,2.446,2.446,0,0,0-1.081-.249h-2.739a.364.364,0,0,1-.364-.364V85.053a4.407,4.407,0,0,1,4.393-4.4,3.246,3.246,0,0,1,2.866,2.112.431.431,0,0,0,.4.287h1.233a.364.364,0,0,1,.364.364v1.33a1.117,1.117,0,0,1-1.116,1.116h-1.629a2.255,2.255,0,0,1-1.034-.25,1.786,1.786,0,0,0-.77,1.292.364.364,0,0,1-.168.314A.357.357,0,0,1,125.138,87.276Zm-3.616-1.013H123.9a3.186,3.186,0,0,1,.945.142,2.771,2.771,0,0,1,.834-1.235,2.258,2.258,0,0,1-.636-1.572.364.364,0,1,1,.728,0,1.54,1.54,0,0,0,1.538,1.538h1.629a.389.389,0,0,0,.388-.388V83.78h-.869a1.16,1.16,0,0,1-1.086-.768,2.532,2.532,0,0,0-2.181-1.632,3.678,3.678,0,0,0-3.666,3.672v1.209Z" transform="translate(-103.369 -36.421)" /><path d="M126.734,130.394h-1.576a1.334,1.334,0,0,1-1.333-1.333v-.926a1.212,1.212,0,0,0-1.211-1.21H121.16a.364.364,0,0,1-.364-.364v-2.312a.364.364,0,0,1,.364-.364H123.9a3.2,3.2,0,0,1,3.2,3.2v2.947A.364.364,0,0,1,126.734,130.394Zm-5.21-4.2h1.091a1.94,1.94,0,0,1,1.938,1.938v.926a.606.606,0,0,0,.6.6h1.212v-2.583a2.474,2.474,0,0,0-2.471-2.471h-2.375V126.2Z" transform="translate(-103.371 -74.044)" /><path d="M109.534,188.637a1.784,1.784,0,0,1-1.782-1.782,1.761,1.761,0,0,1,.051-.409l.708.167a1.071,1.071,0,0,0-.031.242,1.054,1.054,0,0,0,2.108,0,1.044,1.044,0,0,0-.031-.241l.708-.168a1.742,1.742,0,0,1,.051.409A1.784,1.784,0,0,1,109.534,188.637Z" transform="translate(-92.02 -128.488)" /><path d="M100.161,190.316a3.183,3.183,0,0,1-3.179-3.179A3.216,3.216,0,0,1,97,186.77l.723.083a2.424,2.424,0,0,0-.018.284,2.451,2.451,0,1,0,4.9,0,2.43,2.43,0,0,0-.018-.283l.723-.084a3.131,3.131,0,0,1,.023.367A3.182,3.182,0,0,1,100.161,190.316Z" transform="translate(-82.647 -128.769)" /><path d="M207.144,180.515a3.181,3.181,0,0,1-3.169-2.982l.726-.045a2.45,2.45,0,1,0,4.447-1.561l.595-.419a3.177,3.177,0,0,1-2.6,5.008Z" transform="translate(-175.757 -118.968)" /><path d="M216.451,179.433a1.782,1.782,0,1,1,1.782-1.782A1.784,1.784,0,0,1,216.451,179.433Zm0-2.836a1.054,1.054,0,1,0,1.054,1.054A1.055,1.055,0,0,0,216.451,176.6Z" transform="translate(-185.064 -119.283)" /><path d="M97.924,119.859h-14.8a1.274,1.274,0,0,1-1.193-1.718l.7-1.891a4.08,4.08,0,0,1,3.807-2.645h2.281a1.94,1.94,0,0,1,1.938,1.938v.926a.605.605,0,0,0,.6.6h4.522a.7.7,0,0,0,.683-.842l-1.24-5.859.712-.151,1.24,5.859a1.426,1.426,0,0,1-1.395,1.721H91.269a1.334,1.334,0,0,1-1.333-1.333v-.927a1.212,1.212,0,0,0-1.211-1.21H86.444a3.349,3.349,0,0,0-3.125,2.171l-.7,1.891a.546.546,0,0,0,.512.737H97.161a3.436,3.436,0,0,1,.27-1.219,3.506,3.506,0,0,1,2.974-2.125l-3.427-6.011.632-.36,4.107,7.2-.722-.091A2.772,2.772,0,0,0,98.1,118.2a2.722,2.722,0,0,0-.207,1.273Z" transform="translate(-69.482 -61.452)" /></g></svg>
													<p className="text-[#5a0616]">
													{i18n.language === 'ar' ? (
														'التسليم الى الموقع'
													) : (
														'Delivery to location'
													)}
														{
															 state.steps[1].data as string &&
															<span> - {state.steps[1].data as string}</span>
														}
													</p>
												</div>
											}
										</div>
									}
								</div> :

								data?.title === 'preparation' && data?.data ?
								<div className="">
									{i18n.language === 'ar' ? (
										data?.data as string === 'Baked' ? 'مخبوز' : 'مجمد'
									) : (
										data?.data as string === 'Baked' ? 'Baked' : 'Frozen'
									)}
								</div> :

								data?.title === 'Select Sanswiches' && data?.data ?
								<div className="">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'select_sandwiches' || data?.title === 'Select Sandwich' || data?.title === 'Select Drink' ?
								<div className="grid grid-cols-2 min-w-[442px]:grid-cols-3 gap-3">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'select_sandwich' ?
								<div className="grid grid-cols-3 gap-3">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'select_drink' ?
								<div className="grid grid-cols-3 gap-3">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'box_title' ?
								<div className="">{data?.data as string}</div>:

								data?.title === 'add_ons' ?
								<div className="grid grid-cols-3 gap-3">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'printable_card_type' ?
								<div className="grid grid-cols-3 gap-3">
									{
										data?.data && Array.isArray(data?.data) && data?.data.map((item, idx: number) => (
											<ItemSelectedTimeLine
												key={idx}
												id={item.id}
												quantity={item.quantity}
											/>
										))
									}
								</div> :

								data?.title === 'additional_information' && data?.data?
								<div className="">
									<p>{t("sender_name")}: {(data?.data as { senderName: string }).senderName}</p>
									<p>{t("recipient_name")}: {(data?.data as { recipientName: string }).recipientName}</p>
									<p>{t("recipient_mobile")}: {(data?.data as { recipientMobile: string }).recipientMobile}</p>
									<p>{t("recipient_address")}: {(data?.data as { recipientAddress: string }).recipientAddress}</p>
									<p>{t("delivery_time")}: {(data?.data as { deliveryTime: string }).deliveryTime}</p>
									<p>{t("delivery_date")}: {(data?.data as { deliveryDate: string }).deliveryDate}</p>
									{(data?.data as { message?: string }).message && (
										<p>{t("message")}: {(data?.data as { message?: string }).message}</p>
									)}
								</div>:null
						}
					</div>
				</div>
			</div>
			{!isLastNode && (
				<div
					className={`absolute !block start-6 top-12 w-0.5 h-[calc(100%_-_1rem)] -ms-px  ease-in-out duration-300 ${data?.data ? 'bg-[#5a0616]' : 'bg-gray-300'
						}`}
				></div>
			)}
		</div>
	);
};

export default TimelineNode;

const StepHeader = ({ title, subTitle } : { title: string, subTitle: string }) => {
	return (
		<div className="flex flex-col gap-0 sm:gap-1 md:gap-3 items-center sticky bg-white top-[23.3rem] sm:top-[5.3rem] lg:top-[6.1rem] pt-0 sm:pt-16 pb-6 z-[1] shadow-[0px_5px_7px_rgba(0,0,0,0.08)] sm:shadow-none sm:border-b">
			<h3 className="h2 text-center">{title}</h3>
			<p className="text-gray-600 text-center">{subTitle}</p>
		</div>
	)
}

export default StepHeader
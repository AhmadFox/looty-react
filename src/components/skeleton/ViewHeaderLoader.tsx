const ViewHeaderLoader = () => {
	return (
		<div className="relative w-full pb-60 md:pb-72 lg:pb-80 overflow-hidden rounded-2xl !block">
			<div className="animate-pulse !block">
				<div className="absolute bg-gray-200 w-full h-full !block"></div>
				<div className="h-16 w-32 !block absolute bg-white p-3 sm:px-6 rounded-lg sm:rounded-xl top-4 start-4"></div>
			</div>
		</div>
	)
}

export default ViewHeaderLoader

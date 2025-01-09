const ItemSelectionLoader = () => {
	return (
		<div className="relative w-full h-28 !block">
			<div className="animate-pulse !flex">
				<div className="flex items-center justify-between w-full gap-4">
					<div className="flex item-center gap-4">
						<div className="bg-gray-200 w-28 h-28 rounded-full !block"></div>
						<div className="flex flex-col justify-center gap-4">
							<div className="bg-gray-200 w-36 h-8 rounded-lg !block"></div>
							<div className="bg-gray-200 w-24 h-7 rounded-lg !block"></div>
						</div>
					</div>
					<div className="bg-gray-200 w-7 h-7 rounded-full !block -translate-x-2.5"></div>
				</div>
			</div>
		</div>
	)
}

export default ItemSelectionLoader

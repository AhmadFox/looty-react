const PriceOntainer = ({ price }: { price: string }) => {
	return (
		<div className="absolute bg-white p-3 sm:px-6 rounded-lg sm:rounded-xl top-4 start-4">
			<div className='flex gap-1 sm:gap-2 items-center'>
				<span className="h3 text-blue-600">{price}</span>
				<span className="text-body text-base sm:text-lg font-medium text-gray-600">JD</span>
			</div>
			<span className='hidden sm:!block text-gray-800 text-base'>Estemated Cost</span>
		</div>
	)
}

export default PriceOntainer

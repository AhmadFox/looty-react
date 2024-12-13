import CostCounter from './CostCounter'

const ViewHeader = ({ title, img } : { title: string, img: string }) => {
	return (
		<div className="relative w-full pb-60 md:pb-72 lg:pb-80 overflow-hidden rounded-2xl bg-[#f9dbb887]">
			<img src={img} alt={`Product Feature Image ${title}`} className="absolute object-cover w-full h-full" />
			<CostCounter />
		</div>
	)
}

export default ViewHeader

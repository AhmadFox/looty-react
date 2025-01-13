type ItemSelectedTimeLineProps = {
	quantity?: number;
	title?: string;
	image? : string;
}

const ItemSelectedTimeLine: React.FC<ItemSelectedTimeLineProps> = ({ quantity, title, image }) => {

	return (
		<div className="flex flex-col justify-center items-center gap-1">
			<img
				src={image}
				alt={'Selected Item Thumbnail'}
				className="w-full h-full rounded-lg"
			/>
			<div className="flex flex-col">
				<span className="font-medium text-center">{title}</span>
				{
					quantity && <span className="font-medium text-center">x{quantity}</span>
				}
			</div>
		</div>
	)
}

export default ItemSelectedTimeLine

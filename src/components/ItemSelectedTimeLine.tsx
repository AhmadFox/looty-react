import { useEffect, useState } from "react";
import { useSteps } from "../context/StepContext";

type ItemSelectedTimeLineProps = {
	id: string;
	quantity?: number
}

const ItemSelectedTimeLine: React.FC<ItemSelectedTimeLineProps> = ({ id, quantity }) => {

	const { state } = useSteps();
	const [ itemData, setItemData ] = useState({
		image: '',
		title: '',
	})

	const productData: Array<{
		id: string;
		thumbnail: string;
		title: string;
	}> = [];
	  
	state.fetchedData?.metafields.forEach((metafield) => {
	  // Check if 'references' exists and is not null or undefined
	  if (metafield && metafield.references && Array.isArray(metafield.references.nodes)) {
		metafield.references.nodes.forEach((node) => {
		  // Ensure node.price exists before using it
		  if (node) {
			productData.push(
				{
					id: node.id,
					thumbnail: node.image.url,
					title: node.product.title
				}
			)
		  }
		});
	  }
	});

	useEffect(() => {

		const data = productData.find((item) => item.id === id)
		setItemData({
			image: data?.thumbnail as string,
			title: data?.title as string
		})

	}, [state])

	return (
		<div className="flex flex-col justify-center items-center gap-1">
			<img
				src={itemData.image}
				alt={'Selected Item Thumbnail'}
				className="w-full h-full rounded-lg"
			/>
			<div className="flex flex-col">
				<span className="font-medium text-center">{itemData.title}</span>
				{
					quantity && <span className="font-medium text-center">x{quantity}</span>
				}
			</div>
		</div>
	)
}

export default ItemSelectedTimeLine

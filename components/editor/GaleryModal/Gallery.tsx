import { FC } from 'react'
import ImageG from './Image'
import { BsCardImage } from 'react-icons/bs'
interface IGallery {
	images: {
		src: string
	}[];
	onSelect(src: string): void
	uploading?: boolean
	selectedImage?: string
}

const Gallery: FC<IGallery> = ({
	images,
	onSelect,
	uploading = false,
	selectedImage ='',
}): JSX.Element => {
	
	return (
		<div className='flex flex-wrap'>
			{uploading && (
				<div className='basis-1/4 p-1 aspect-square flex flex-col items-center justify-center bg-secondary-light text-primary-dark rounded animate-pulse'>
					<BsCardImage size={60} /><p>Uploading</p>
				</div>
			)}
			{
				images.map(({ src }, idx) => {
					return (
						<div key={idx} className='basis-1/4 p-1'>
							<ImageG
								src={src}
								onClick={()=>onSelect(src)}
								selected={selectedImage===src}
							
							></ImageG>
						</div>
					)
				})}
		</div>
	)
}

export default Gallery

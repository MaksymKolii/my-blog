import { FC } from 'react'
import NextImageMine from 'next/image'
import CheckMark from '@/components/common/CheckMark'

interface IImage {
	src: string
	selected?: boolean
	onClick?(): void
}

const Image: FC<IImage> = ({ src, selected, onClick }): JSX.Element => {

    
	return (
		<div onClick={onClick} className='relative overflow-hidden rounded cursor-pointer'>
			<NextImageMine
				src={src}
				width={200}
				height={200}
				alt='gallery'
                objectFit='cover'
				className='bg-secondary-light hover:scale-110 transition'
			/>
            <div className="absolute top-2 left-2">
                <CheckMark visiiiible={selected || false}/>
            </div>
		</div>
	)
}

export default Image

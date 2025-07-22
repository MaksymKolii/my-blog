import { FC } from 'react'
import Image from 'next/image'
import CheckMark from '@/components/common/CheckMark'

interface IImageG {
  src: string
  alt?: string
  selected?: boolean
  onClick?(): void
}

const ImageG: FC<IImageG> = ({
  src,
  alt = 'image',
  selected,
  onClick,
}): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded cursor-pointer"
    >
      <Image
        src={src}
        width={200}
        height={200}
        // alt={alt || 'Default alt text'}
        alt={alt}
        fill
        //* Legacy
        // objectFit='cover'
        // alt='gallery'
        // style={{ objectFit: 'cover' }}
        // style={{ objectFit: 'cover', width: 'auto', height: 'auto' }}

        className="bg-secondary-light hover:scale-110 transition"
      />
      <div className="absolute top-2 left-2">
        <CheckMark visiiible={selected || false} />
      </div>
    </div>
  )
}

export default ImageG

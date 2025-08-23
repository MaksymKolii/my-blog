import { FC } from 'react'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
interface LikeHeartProps {
  busy?: boolean
  label?: string
  liked?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const LikeHeart: FC<LikeHeartProps> = ({
  liked = false,
  label,
  onClick,
}): JSX.Element => {
  return (
    <button
      type="button"
      className="text-primary-dark dark:text-primary flex items-center space-x-2 outline-none"
      onClick={onClick}
    >
      {liked ? <BsHeartFill color="#4790FD" /> : <BsHeart />}
      <span className='hover:underline'>{label}</span>
    </button>
  )
}

export default LikeHeart

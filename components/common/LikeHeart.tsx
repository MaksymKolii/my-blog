import { FC } from 'react'
import { BiLoader } from 'react-icons/bi'
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
  busy,
  onClick,
}): JSX.Element => {

  const likeIcon =liked ? <BsHeartFill color="#4790FD" /> : <BsHeart />
  return (
    <button
      type="button"
      className="text-primary-dark dark:text-primary flex items-center space-x-2 outline-none"
      onClick={onClick}
    >  {busy ? <BiLoader className="animate-spin" size={20} />  : likeIcon}
      
      <span className='hover:underline'>{label}</span>
    </button>
  )
}

export default LikeHeart

import { FC } from 'react'
import {
	BsCheckLg,
	
} from 'react-icons/bs'

interface ICheckMark {
    visiiible:boolean
}

const CheckMark: FC<ICheckMark> = ({visiiible}): JSX.Element | null => {

    if(!visiiible) return null

  return <div className='bg-action text-primary p-2 rounded-full bg-opacity-70 backdrop-blur-sm'><BsCheckLg /></div>
}

export default CheckMark
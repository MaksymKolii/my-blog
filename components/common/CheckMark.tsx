import { FC } from 'react'
import {
	BsCheckLg,
	
} from 'react-icons/bs'

interface ICheckMark {
    visiiiible:boolean
}

const CheckMark: FC<ICheckMark> = ({visiiiible}): JSX.Element | null => {

    if(!visiiiible) return null

  return <div className='bg-action text-primary p-2 rounded-full bg-opacity-70 backdrop-blur-sm'><BsCheckLg /></div>
}

export default CheckMark
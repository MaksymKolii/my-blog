

import { FC, useCallback} from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import ProfileIcon from './ProfileIcon'

interface IProfileHead {
    lightOnly?: boolean
    avatar?: string
    nameInitial?: string
}


const ProfileHead: FC<IProfileHead> = ({ lightOnly, avatar, nameInitial }): JSX.Element => {

    



    return <div className='flex items-center '>
        {/*  image / name initial */}
        <ProfileIcon  avatar={avatar} nameInitial={nameInitial} lightOnly/>
     
        {/* down icon  */}
        <AiFillCaretDown className={lightOnly? 'text-primary': 'text-primary-dark dark:text-primary' }/>
    </div>
}

export default ProfileHead

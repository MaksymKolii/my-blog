
import classNames from 'classnames'
import Image from 'next/image'
import { FC, useCallback } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

interface IProfileHead {
    lightOnly?: boolean
    avatar?: string
    nameInitial?: string
}
const commonClasses ="relative flex items-center justify-center rounded-full overflow-hidden w-8 select-none h-8"

const ProfileHead: FC<IProfileHead> = ({ lightOnly, avatar, nameInitial }): JSX.Element => {
    const getStyle = useCallback(() => {
        return lightOnly
            ? 'text-primary-dark bg-primary'
            : 'bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary'
    }, [lightOnly])

    return <div className='flex items-center'>
        {/*  image / name initial */}
        <div className={classNames(commonClasses, getStyle())}>{avatar ? <Image src={avatar} layout='fill' alt='avatar image'/>: nameInitial}</div>
        {/* down icon  */}
        <AiFillCaretDown className={lightOnly? 'text-primary': 'text-primary-dark dark:text-primary' }/>
    </div>
}

export default ProfileHead

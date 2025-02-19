import classNames from 'classnames'
import Image from 'next/image'
import { FC, useCallback } from 'react'

interface IProfileIcon {
	avatar?: string
	nameInitial?: string
	lightOnly?: boolean
}

const commonClasses =
	'relative flex items-center justify-center rounded-full overflow-hidden w-8 select-none h-8'
const ProfileIcon: FC<IProfileIcon> = ({
	avatar,
	nameInitial,
	lightOnly,
}): JSX.Element => {
	const getStyle = useCallback(() => {
		return lightOnly
			? 'text-primary-dark bg-primary'
			: 'bg-primary-dark dark:bg-primary dark:text-primary-dark text-primary'
	}, [lightOnly])

	return (
		<div className={classNames(commonClasses, getStyle())}>
			{avatar ? (
				<Image src={avatar} layout='fill' alt='avatar image' />
			) : (
				nameInitial
			)}
		</div>
	)
}

export default ProfileIcon
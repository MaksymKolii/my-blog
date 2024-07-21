import { FC, useEffect, useState } from 'react'
import { validateUrl } from '../EditorUtils'
interface ILinkForm {
	visible: boolean
	onSubmit(someLink: LinkOption): void
	initialState?: LinkOption
}

export type LinkOption = {
	url: string
	openInNewTab: boolean
}

const defaultLink = {
	url: '',
	openInNewTab: false,
}
const LinkForm: FC<ILinkForm> = ({
	visible,
	onSubmit,
	//* for editing form to show what we already have to change
	initialState,
}): JSX.Element | null => {
	const [link, setLink] = useState<LinkOption>(defaultLink)

	const handleSubmit = () => {
		// if (!link.url.trim()) return

		onSubmit({ ...link, url: validateUrl(link.url) })
		resetForm()
	}

	const resetForm = () => {
		setLink({ ...defaultLink })
	}
//* for editing form to show what we already have to change
	useEffect(() => {
		if (initialState) setLink({ ...initialState })
	}, [initialState])

	//* 1
	if (!visible) return null

	return (
		<div className='rounded text-left bg-primary dark:bg-primary-dark animate-reveal z-50 dark:shadow-secondary-dark shadow-md p-2'>
			<div className='flex items-center space-x-2'>
				<input
					autoFocus
					type='text'
					className='rounded outline-none border-2 px-1 bg-transparent  focus:border-primary-dark dark:focus:border-primary  border-secondary-dark transition focus:ring-1 text-primary-dark dark:text-primary'
					placeholder='https://example.com'
					value={link.url}
					onChange={({ target }) => setLink({ ...link, url: target.value })}
				/>
			</div>

			<div className='mt-2 flex items-center space-x-2 text-sm select-none text-secondary-dark dark:text-secondary-light'>
				<input
					type='checkbox'
					id='open-in-new-tab'
					className='focus:ring-0 rounded-sm w-3 h-3 outline-none'
					checked={link.openInNewTab}
					onChange={({ target }) =>
						setLink({ ...link, openInNewTab: target.checked })
					}
				/>
				<label htmlFor='open-in-new-tab'>open in new tab</label>

				<div className='text-right flex-1'>
					<button
						onClick={handleSubmit}
						className='bg-action text-primary 
                    text-xs px-2 py-1 rounded'
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	)
}

export default LinkForm

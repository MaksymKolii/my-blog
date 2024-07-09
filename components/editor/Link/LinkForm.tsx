import { FC } from 'react'

interface ILinkForm {
    visible:boolean
}

const LinkForm: FC<ILinkForm> = ({visible}): JSX.Element | null => {
    if(!visible) return null
	return (
        <div className="rounded text-left bg-primary dark:bg-primary-dark animate-reveal z-50 dark:shadow-secondary-dark shadow-md p-2">
		

<div className="flex items-center space-x-2">
        <input
          autoFocus
          type="text"
          className="rounded bg-transparent focus:ring-0 focus:border-primary-dark dark:focus:border-primary transition dark:text-primary text-primary-dark"
          placeholder="https://example.com"
        />
      </div>

			<div className='mt-2 flex items-center space-x-1 text-sm select-none text-secondary-dark dark:text-secondary-light'>
				<input
					type='checkbox'
					id='checkbox'
					className='focus:ring-0 rounded-sm w-3 h-3 outline-none'
				/>
				<label htmlFor='checkbox'>open in new tab</label>

				<div className='text-right flex-1'>
					<button className='bg-action text-primary 
                    text-xs px-2 py-1 rounded'>
						Apply
					</button>
				</div>
			</div>

		</div>
	)
}

export default LinkForm

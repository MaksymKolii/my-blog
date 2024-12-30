// import { ChangeEventHandler, FC, useCallback, useEffect, useState } from "react";
// import classnames from "classnames";
// import slugify from "slugify";

// export interface SeoResult {
//   meta: string;
//   slug: string;
//   tags: string;
// }

// interface ISeoForm {
//   initialValue?: SeoResult;
//   title?: string;
//   onChange(result: SeoResult): void;
// }

// const commonInput =
//   "w-full bg-transparent outline-none border-2 border-secondary-dark focus:border-primary-dark focus:dark:border-primary rounded transition text-primary-dark dark:text-primary p-2";

// const SEOForm: FC<ISeoForm> = ({
//   initialValue,
//   title = "",
//   onChange,
// }): JSX.Element => {
// 	const [values, setValues] = useState({ meta: '', slug: '', tags: '' })

// 	const handleChange: ChangeEventHandler<
// 		HTMLTextAreaElement | HTMLInputElement
// 	> = ({ target }) => {
// 		let { name, value } = target
// 		//* we cut length of value to max 150 symbols
// 		if (name === 'meta') value = value.substring(0, 150)
//     // const newValues = { ...values, [name]: value }
//       const newValues = {
// 				...values,
// 				[name]: name === 'meta' && !value ? ' ' : value,
// 			}
// 		setValues(newValues)
// 		onChange(newValues)
// 	}

//   const updateSlug = useCallback(() => {
// 		setValues(prev => {
// 			const newSlug = slugify(title.toLowerCase())
// 			if (prev.slug === newSlug) return prev // Не обновляем, если slug не изменился
// 			const newValues = { ...prev, slug: newSlug }
// 			onChange(newValues)
// 			return newValues
// 		})
// 	}, [title, onChange])

// 	useEffect(() => {
// 		if (title) {
// 			updateSlug() // Вызываем только функцию
// 		}
// 	}, [title]) // Убираем зависимость от updateSlug


//   useEffect(() => {
// 		if (initialValue) {
// 			setValues({
// 				meta: initialValue.meta || '', // Значение по умолчанию
// 				slug: slugify(initialValue.slug || ''),
// 				tags: initialValue.tags || '',
// 			})
// 		}
// 	}, [initialValue])


// 	// useEffect(() => {
// 	// 	const slug = slugify(title.toLowerCase())
// 	// 	const newValues = { ...values, slug }
// 	// 	setValues(newValues)
// 	// 	onChange(newValues)
// 	// }, [title])

// 	// useEffect(() => {
// 	// 	if (initialValue) {
// 	// 		setValues({ ...initialValue, slug: slugify(initialValue.slug) })
// 	// 	}
// 	// }, [initialValue])

// 	const { meta, slug, tags } = values

// 	return (
// 		<div className='space-y-4'>
// 			<h1 className='text-primary-dark dark:text-primary text-xl font-semibold'>
// 				SEO Section
// 			</h1>

// 			<Input
// 				value={slug}
// 				onChange={handleChange}
// 				name='slug'
// 				placeholder='slug-goes-here'
// 				label='Slug:'
// 			/>
// 			<Input
// 				value={tags}
// 				onChange={handleChange}
// 				name='tags'
// 				placeholder='React, Next JS'
// 				label='Tags:'
// 			/>

// 			<div className='relative'>
// 				<textarea
// 					name='meta'
// 					value={meta}
// 					onChange={handleChange}
// 					className={classnames(commonInput, 'text-lg h-20 resize-none')}
// 					placeholder='Meta description 150 characters will be fine'
// 				></textarea>
// 				<p className='absolute bottom-3 right-3 text-primary-dark dark:text-primary text-sm'>
// 					{meta.length}/150
// 				</p>
// 			</div>
// 		</div>
// 	)
// };

// const Input: FC<{
//   name?: string;
//   value?: string;
//   placeholder?: string;
//   label?: string;
//   onChange?: ChangeEventHandler<HTMLInputElement>;
// }> = ({ name, value, placeholder, label, onChange }) => {
//   return (
//     <label className="block relative ">
//       <span className="absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-dark dark:text-primary pl-2 ">
//         {label}
//       </span>

//       <input
//         type="text"
//         name={name}
//         value={value}
//         placeholder={placeholder}
//         className={classnames(commonInput, "italic pl-12  ")}
//         onChange={onChange}
//       />
//     </label>
//   );
// };

// export default SEOForm;



import { ChangeEventHandler, FC, useCallback, useEffect, useState } from 'react'
import classnames from 'classnames'
import slugify from 'slugify'

export interface SeoResult {
	meta: string
	slug: string
	tags: string
}

interface ISeoForm {
	initialValue?: SeoResult
	title?: string
	onChange(result: SeoResult): void
}

const commonInput =
	'w-full bg-transparent outline-none border-2 border-secondary-dark focus:border-primary-dark focus:dark:border-primary rounded transition text-primary-dark dark:text-primary p-2'

const SEOForm: FC<ISeoForm> = ({
	initialValue,
	title = '',
	onChange,
}): JSX.Element => {
	const [values, setValues] = useState({ meta: '', slug: '', tags: '' })

	const handleChange: ChangeEventHandler<
		HTMLTextAreaElement | HTMLInputElement
	> = ({ target }) => {
		let { name, value } = target

		if (name === 'meta') value = value.substring(0, 150)
		//! indusa
	// 	const newValues = { ...values, [name]: value }

	// 	setValues(newValues)
	// 	onChange(newValues)
	// }

	// useEffect(() => {
	// 	const slug = slugify(title.toLowerCase(), {
	// 		strict: true,
	// 	})
	// 	const newValues = { ...values, slug }
	// 	setValues(newValues)
	// 	onChange(newValues)
	// }, [title])

	// useEffect(() => {
	// 	if (initialValue) {
	// 		setValues({
	// 			...initialValue,
	// 			slug: slugify(initialValue.slug, {
	// 				strict: true,
	// 			}),
	// 		})
	// 	}
	// }, [initialValue])

		const newValues = {
			...values,
			[name]: name === 'meta' && !value ? ' ' : value,
		}

		setValues(newValues)
		onChange(newValues)
	}

	const updateSlug = useCallback(() => {
		setValues(prev => {
			const newSlug = title ? slugify(title.toLowerCase(), {strict:true}) : ''
			if (prev.slug === newSlug) return prev
			const newValues = { ...prev, slug: newSlug }
			onChange(newValues)
			return newValues
		})
	}, [title, onChange])

	useEffect(() => {
		if (title) updateSlug()
	}, [title, updateSlug])

	useEffect(() => {
		if (initialValue) {
			setValues({
				meta: initialValue.meta || '',
				slug: slugify(initialValue.slug || '', {strict:true}),
				tags: initialValue.tags || '',
			})
		}
	}, [initialValue])

	const { meta, slug, tags } = values

	return (
		<div className='space-y-4'>
			<h1 className='text-primary-dark dark:text-primary text-xl font-semibold'>
				SEO Section
			</h1>

			<label className='block relative'>
				<span className='absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-dark dark:text-primary pl-2'>
					Slug:
				</span>
				<input
					type='text'
					name='slug'
					value={slug}
					placeholder='slug-goes-here'
					className={classnames(commonInput, 'italic pl-12')}
					onChange={handleChange}
				/>
			</label>

			<label className='block relative'>
				<span className='absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-dark dark:text-primary pl-2'>
					Tags:
				</span>
				<input
					type='text'
					name='tags'
					value={tags}
					placeholder='React, Next JS'
					className={classnames(commonInput, 'italic pl-12')}
					onChange={handleChange}
				/>
			</label>

			<div className='relative'>
				<textarea
					name='meta'
					value={meta}
					onChange={handleChange}
					className={classnames(commonInput, 'text-lg h-20 resize-none')}
					placeholder='Meta description 150 characters will be fine'
				></textarea>
				<p className='absolute bottom-3 right-3 text-primary-dark dark:text-primary text-sm'>
					{meta.length}/150
				</p>
			</div>
		</div>
	)
}

export default SEOForm

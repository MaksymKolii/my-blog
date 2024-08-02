import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import TipTapImage from '@tiptap/extension-image'

import { FC, useEffect, useState } from 'react'
import ToolBar from './ToolBar'
import EditLink from './Link/EditLink'
import GalleryModal, { ImageSelectionResult } from './GaleryModal'
import axios from 'axios'

interface ITipTapEditor {}

const TipTapEditor: FC<ITipTapEditor> = (props): JSX.Element => {
	const [selectionRange, setSelectionRange] = useState<Range>()
	const [showGallery, setShowGallery] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [images, setImages] = useState<{src:string}[]>([])

	const  fetchImages = async ()=>{
		const {data}= await axios('/api/image')
		setImages(data.images)
	}
	const  handleImageUpload = async (image: File)=>{
		try {
			setUploading(true);
		
			const formData = new FormData();
			formData.append('image', image);
			const { data } = await axios.post('/api/image', formData);
			console.log(data);
			setUploading(false);
			setImages([data, ...images]);
		  } catch (error: any) {
			setUploading(false);
			console.error('Image upload failed:', error);
			alert('Image upload failed. Please try again.');
		  }
		// setUploading(true)

		// const formData =new FormData()
		// formData.append('image', image)
		// const {data}= await axios.post('/api/image', formData)
		// setUploading(false)
		// setImages([data, ...images]);

		// // console.log(data);
		
	}

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Placeholder.configure({ placeholder: 'Write something ...' }),
			Link.configure({
				autolink: false,
				linkOnPaste: false,
				openOnClick: false,
				HTMLAttributes: {
					target: '',
				},
			}),
			Youtube.configure({
				width: 840,
				height: 472.5,
				HTMLAttributes: {
					class: 'mx-auto rounded',
				},
			}),
			TipTapImage.configure({ HTMLAttributes: { class: 'mx-auto' } }),
		],
		editorProps: {
			//* used to change selected text, handleClick just take inside selectionRange and didnt do anything, but useEffect below do job
			handleClick(view, position, event) {
				const { state } = view
				const selectionRange = getMarkRange(
					state.doc.resolve(position),
					state.schema.marks.link
				)
				if (selectionRange) setSelectionRange(selectionRange)
			},

			attributes: {
				class:
					'prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full',
			},
		},
		// content: '<p>Start write here!  🌎️</p>',
	})

	const handleImageSelection = (res: ImageSelectionResult) => {
		editor
			?.chain()
			.focus()
			.setImage({ src: res.src, alt: res.altTextInterface })
			.run()

         // work
		// setShowGallery(false)
	}

	

	useEffect(() => {
		if (editor && selectionRange) {
			editor.commands.setTextSelection(selectionRange)
		}
	}, [editor, selectionRange])

	useEffect(()=>{
		fetchImages()
	},[])
	return (
		<>
			<div className='p-3 dark:bg-primary-dark bg-primary transition'>
				<ToolBar
					editor={editor}
					onOpenImageClick={() => setShowGallery(true)}
				/>
				<div className=' h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3' />
				{/* for Bubble menu */}
				{editor ? <EditLink editor={editor} /> : null}
				{/* --------------------------- */}

				<EditorContent editor={editor} />
			</div>
			<GalleryModal
				 uploading={uploading}
			images={images}
				visible={showGallery}
				onClose={() => setShowGallery(false)}
				onSelect={handleImageSelection}

				onFileSelect={handleImageUpload}
			/>
		</>
	)
}

export default TipTapEditor

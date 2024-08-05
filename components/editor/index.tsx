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
import SEOForm from './SeoForm'
import ThumbnailSelector from './ThumbnailSelector'

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
			//* for array version formidable": "^3.5.1","@types/formidable": "^3.4.5"
			setImages([data.images[0], ...images]);

			//* for single image  "@types/formidable": "^2.0.5","formidable": "^2.0.1",
			// setImages([data, ...images]);
		  } catch (error: any) {
			setUploading(false);
			console.error('Image upload failed:', error);
			alert('Image upload failed. Please try again.');
		  }
		
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
				   {/* Thumbnail select & submit button */}
				   <ThumbnailSelector onChange={()=>{}}/>
				   {/* Title Input */}
				   <input
            type="text"
            className="py-2 outline-none bg-transparent w-full border-0 border-b-[1px] border-secondary-dark dark:border-secondary-light text-3xl font-semibold italic text-primary-dark dark:text-primary mb-3"
            placeholder="Title"
            // onChange={updateTitle}
            // value={post.title}
          />
				<ToolBar
					editor={editor}
					onOpenImageClick={() => setShowGallery(true)}
				/>
				<div className=' h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3' />
				{/* for Bubble menu */}
				{editor ? <EditLink editor={editor} /> : null}
				{/* --------------------------- */}

				<EditorContent editor={editor} className="min-h-[300px]" />
				<div className=' h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3' />
				<SEOForm title='this IS MY Title' onChange={(result)=>{console.log(result);}}/>
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

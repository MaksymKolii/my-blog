// 'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

import { FC } from 'react'
import ToolBar from './ToolBar'

interface ITipTapEditor {}

const TipTapEditor: FC<ITipTapEditor> = (props): JSX.Element => {
	const editor = useEditor({
		extensions: [StarterKit, Underline, Placeholder.configure({placeholder:'Write something ...'}), Link.configure({autolink:false,
			linkOnPaste: false,
			openOnClick:false,
			HTMLAttributes:{
				target:""
			}
		})],
        editorProps:{attributes:{class:"prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full"}},
		// content: '<p>Start write here!  🌎️</p>',
	})
	return (
		<div className='p-3 dark:bg-primary-dark bg-primary transition'>
		<ToolBar editor={editor}/>
        <div className=" h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3"/>
			<EditorContent editor={editor} />
		</div>
	)
}

export default TipTapEditor

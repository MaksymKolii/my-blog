import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'

import { FC, useEffect, useState } from 'react'
import ToolBar from './ToolBar'
import EditLink from './Link/EditLink'

interface ITipTapEditor {}

const TipTapEditor: FC<ITipTapEditor> = (props): JSX.Element => {
	const [selectionRange, setSelectionRange] = useState<Range>()

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
			Youtube.configure({width:840,height:472.5,HTMLAttributes:{
				class:"mx-auto rounded",
			}}),
		],
		editorProps: {
			//* used to change selected text
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
	useEffect(() => {
		if (editor && selectionRange) {
			editor.commands.setTextSelection(selectionRange)
		}
	}, [editor, selectionRange])
	return (
		<div className='p-3 dark:bg-primary-dark bg-primary transition'>
			<ToolBar editor={editor} />
			<div className=' h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3' />
			{editor ? <EditLink editor={editor} /> : null}
			<EditorContent editor={editor} />
		</div>
	)
}

export default TipTapEditor

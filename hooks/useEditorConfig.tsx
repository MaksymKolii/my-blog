import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { getMarkRange, Range, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import { useState } from 'react'

interface Options {
    placeholder?:string
}

const useEditorConfig = (options?: Options) => { 
        const [selectionRange, setSelectionRange] = useState<Range>()

    const editor = useEditor({
			extensions: [
				StarterKit,
				Underline,
				Placeholder.configure({
					placeholder: options?.placeholder || 'Write something ...',
				}),
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

			// здесь добавьте immediatelyRender: false из GPT Ошибка, с которой вы столкнулись, связана с серверным рендерингом (SSR) в библиотеке Tiptap, которая часто используется для работы с текстовыми редакторами в React или других фреймворках. Эта ошибка возникает из-за того, что рендеринг происходит слишком рано на сервере, что вызывает несоответствие с рендерингом на клиенте, особенно если вы используете Tiptap в среде с SSR.
			immediatelyRender: false,
		})
    
    return {editor, selectionRange}
}


export default useEditorConfig
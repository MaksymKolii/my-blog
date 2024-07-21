import DropdownOptions from '@/components/common/DropdownOptions'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { Editor } from '@tiptap/react'
import { FC } from 'react'
import { getFocusedEditor } from '../EditorUtils'
import Button from './Button'
import { RiDoubleQuotesL } from 'react-icons/ri'
import {
	BsTypeStrikethrough,
	BsTypeBold,
	BsTypeItalic,
	BsTypeUnderline,
	BsImageFill,
	BsCode,
	BsListOl,
	BsListUl,
	BsBraces,
} from 'react-icons/bs'
import InsertLink from '../Link/InsertLink'
import { type LinkOption } from '../Link/LinkForm'
import EmbedYoutube from './EmbedYoutube'

interface IToolBar {
	editor: Editor | null
	onOpenImageClick?():void
}

const ToolBar: FC<IToolBar> = ({ editor,onOpenImageClick }): JSX.Element | null => {
	if (!editor) return null

	const options = [
		{
			label: 'Paragraph',
			onClick: () => {
				getFocusedEditor(editor).setParagraph().run()
			},
		},
		{
			label: 'Heading 1',
			onClick: () => {
				getFocusedEditor(editor).toggleHeading({ level: 1 }).run()
			},
		},
		{
			label: 'Heading 2',
			onClick: () => {
				getFocusedEditor(editor).toggleHeading({ level: 2 }).run()
			},
		},
		{
			label: 'Heading 3',
			onClick: () => {
				getFocusedEditor(editor).toggleHeading({ level: 3 }).run()
			},
		},
	]

	const getLabel = (): string => {
		if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
		if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
		if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
		return 'Paragraph'
	}

	const handleLinkSubmit = ({ url, openInNewTab }: LinkOption) => {
		// console.log(url, openInNewTab);
		const { commands } = editor
		if (openInNewTab) commands.setLink({ href: url, target: '_blank' })
		else {
			commands.setLink({ href: url })
		}
	}
	const handelEmbedYoutube = (url: string) => {
		editor.chain().focus().setYoutubeVideo({ src: url }).run()
		// console.log(url)
	}
	const Head = () => {
		return (
			<div className='flex items-center space-x-2 text-primary-dark dark:text-primary'>
				<p>{getLabel()}</p>
				<MdOutlineKeyboardArrowDown size={24} />
			</div>
		)
	}

	return (
		<div className='flex items-center'>
			{/* paragraph, heading 1, 2, 3  */}

			<DropdownOptions options={options} head={<Head />} />
			<div className='h-4 w-[1px]  bg-secondary-dark dark:bg-highlight-light mx-8' />
			<div className='flex items-center space-x-3'>
				<Button
					active={editor.isActive('bold')}
					onClick={() => {
						getFocusedEditor(editor).toggleBold().run()
					}}
				>
					<BsTypeBold />
				</Button>
				<Button
					active={editor.isActive('italic')}
					onClick={() => {
						getFocusedEditor(editor).toggleItalic().run()
					}}
				>
					<BsTypeItalic />
				</Button>
				<Button
					active={editor.isActive('underline')}
					onClick={() => {
						getFocusedEditor(editor).toggleUnderline().run()
					}}
				>
					<BsTypeUnderline />
				</Button>
				<Button
					active={editor.isActive('strike')}
					onClick={() => {
						getFocusedEditor(editor).toggleStrike().run()
					}}
				>
					<BsTypeStrikethrough />
				</Button>
			</div>
			<div className='h-4 w-[1px]  bg-secondary-dark dark:bg-highlight-light mx-8' />
			<div className='flex items-center space-x-3'>
				<Button
					active={editor.isActive('blockquote')}
					onClick={() => {
						getFocusedEditor(editor).toggleBlockquote().run()
					}}
				>
					<RiDoubleQuotesL />
				</Button>
				<Button
					active={editor.isActive('code')}
					onClick={() => {
						getFocusedEditor(editor).toggleCode().run()
					}}
				>
					<BsCode />
				</Button>
				<Button
					active={editor.isActive('codeBlock')}
					onClick={() => {
						getFocusedEditor(editor).toggleCodeBlock().run()
					}}
				>
					<BsBraces />
				</Button>
				<InsertLink onSubmit={handleLinkSubmit} />
				
				<Button
					active={editor.isActive('orderedList')}
					onClick={() => {
						getFocusedEditor(editor).toggleOrderedList().run()
					}}
				>
					<BsListOl />
				</Button>
				<Button
					active={editor.isActive('bulletList')}
					onClick={() => {
						getFocusedEditor(editor).toggleBulletList().run()
					}}
				>
					<BsListUl />
				</Button>
			</div>
			<div className='h-4 w-[1px]  bg-secondary-dark dark:bg-highlight-light mx-8' />
			<div className='flex items-center space-x-3'>
				<EmbedYoutube onSubmit={handelEmbedYoutube} />
				{/* <Button>
				<BsYoutube />
			</Button> */}
				<Button onClick={onOpenImageClick}>
					<BsImageFill />
				</Button>
			</div>
		</div>
	)
}

export default ToolBar

import useEditorConfig from '@/hooks/useEditorConfig'
import { EditorContent } from '@tiptap/react'
import { FC } from 'react'
import ActionButton from './ActionButton'

interface ICommentForm {}

const CommentForm: FC<ICommentForm> = (props): JSX.Element => {

    const {editor} = useEditorConfig( {placeholder: 'Add your comment...'})
    return (
			<div className='text-secondary-dark font-semibold text-xl dark:text-secondary-light'>
				<EditorContent
					className='min-h-[200px] border-2 border-secondary-dark rounded p-2'
					editor={editor}
            />
            <ActionButton title ='Submit'/>
			</div>
		)
}

export default CommentForm
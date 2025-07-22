import { FC, ReactNode, useState } from 'react'
import ProfileIcon from './ProfileIcon'
// import parse from 'html-react-parser'
import dateFormat from 'dateformat'
import {
  BsFillReplyAllFill,
  BsFillTrashFill,
  BsPencilSquare,
} from 'react-icons/bs'
import CommentForm from './CommentForm'
import { CommentResponse } from '@/utils/types'

// interface CommentOwnerProfile {
// 	name: string
// 	avatar?: string
// }

interface ICommentCard {
  comment: CommentResponse
  // profile: CommentOwnerProfile
  // date: string
  // content: string
  onUpdateSubmit?(content: string): void
  onReplySubmit?(content: string): void
}

const CommentCard: FC<ICommentCard> = ({
  comment,
  // profile,
  // date,
  // content,
  onUpdateSubmit,
  onReplySubmit,
}): JSX.Element => {
  const { owner, content, createdAt } = comment

  const isDeleted = !owner
  const name = owner?.name ?? 'Deleted user'
  const avatar = owner?.avatar

  const [showForm, setShowForm] = useState(false)
  const [initialState, setInitialState] = useState('')
  // if (!owner) {
  // 	// Просто не показываем ничего — но после хуков
  // 	return <></>
  // }

  // const { name, avatar } = owner
  const displayReplyForm = () => {
    setInitialState('')
    setShowForm(true)
  }
  const hideReplyForm = () => {
    setShowForm(false)
  }
  const handleOnReplyClick = () => {
    displayReplyForm()
  }

  const handleOnEditClick = () => {
    displayReplyForm()
    setInitialState(content)
  }
  const handleOnDeleteClick = () => {}

  const handleCommentSubmit = (comment: string) => {
    // if initialState means we want to update
    if (initialState) {
      onUpdateSubmit && onUpdateSubmit(comment)
    } else {
      // means we want to reply
      onReplySubmit && onReplySubmit(comment)
    }
  }

  return (
    <div className="flex space-x-3">
      <ProfileIcon
        nameInitial={comment.owner ? comment.owner.name[0].toUpperCase() : 'U'}
        avatar={comment.owner?.avatar}
      />

      {/* <ProfileIcon nameInitial={name[0].toUpperCase()} avatar={avatar} /> */}

      <div className="flex-1">
        {/* <h1 className='text-lg text-primary-dark dark:text-primary font-semibold'>
					{name}
				</h1> */}
        <h1 className="text-lg text-primary-dark dark:text-primary font-semibold">
          {!comment.owner ? (
            <span className="text-gray-500">Deleted user</span>
          ) : (
            comment.owner.name
          )}
        </h1>

        <span className="text-sm text-secondary-dark">
          {dateFormat(createdAt, 'd-mmm-yyyy')}
        </span>
        <div className=" text-primary-dark dark:text-primary">
          {content}

          {/* {parse(content)} */}
        </div>
        {!isDeleted && (
          <div className="flex space-x-4">
            <Button onClick={handleOnReplyClick}>
              <BsFillReplyAllFill />
              <span>Reply</span>
            </Button>
            <Button onClick={handleOnEditClick}>
              <BsPencilSquare />
              <span>Edit</span>
            </Button>
            <Button onClick={handleOnDeleteClick}>
              <BsFillTrashFill />
              <span>Delete</span>
            </Button>
          </div>
        )}
        {showForm && (
          <div className="mt-3">
            <CommentForm
              onSubmit={handleCommentSubmit}
              onClose={hideReplyForm}
              initialState={initialState}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentCard
interface ButtonProps {
  children: ReactNode
  onClick?(): void
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex  space-x-2 items-center text-primary-dark dark:text-primary"
    >
      {children}
    </button>
  )
}

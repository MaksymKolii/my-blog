import { Model, ObjectId, Schema, model, models } from 'mongoose'

export interface CommentModelSchema {
  _id: ObjectId
  belongsTo: ObjectId
  owner: ObjectId
  content: string
  likes: ObjectId[]
  // replies?: ObjectId[]
   replies?: (ObjectId | CommentModelSchema)[]
  repliedTo?: ObjectId
  chiefComment?: boolean
  createdAt: string
}

const CommentSchema = new Schema<CommentModelSchema>(
  {
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      // required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    chiefComment: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },
)
const Comment = models?.Comment || model('Comment', CommentSchema)

export default Comment as Model<CommentModelSchema>

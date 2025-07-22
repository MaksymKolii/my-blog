import { Model, ObjectId, Schema, model, models } from 'mongoose'

// Title, content, slug, tags, thumbnail, meta, author, date
export interface PostModelSchema {
  _id: ObjectId
  title: string
  slug: string
  content: string
  tags: string[]
  thumbnail?: { url: string; public_id: string }
  meta: string
  author: ObjectId
  createdAt: Date
}

const PostSchema = new Schema<PostModelSchema>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
    },
    thumbnail: {
      type: Object,
      url: String,
      public_id: String,
    },
    meta: {
      type: String,
      // required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false, timestamps: true },
)
const Post = models?.Post || model('Post', PostSchema)

//// eslint-disable-next-line import/no-anonymous-default-export
//* add as Model<PostModelSchema> to work with interface !!
export default Post as Model<PostModelSchema>

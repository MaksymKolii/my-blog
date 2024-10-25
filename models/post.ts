import { Schema, model, models } from 'mongoose'

// Title, content, slug, tags, thumbnail, meta, author, date

const PostSchema = new Schema(
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
			required: true,
			trim: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ versionKey: false, timestamps: true }
)
const Post = models?.Post || model('Post', PostSchema)

 //// eslint-disable-next-line import/no-anonymous-default-export
export default Post

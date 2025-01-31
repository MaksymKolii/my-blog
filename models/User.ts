import { Model, ObjectId, Schema, model, models } from 'mongoose'

// Title, content, slug, tags, thumbnail, meta, author, date
export interface UserModelSchema {
	name: string
	email: string
	avatar?: string
	role: 'user' | 'admin'
	provider: 'github' | 'google' | 'credential'
}

const UserSchema = new Schema<UserModelSchema>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},
		provider: {
			type: String,
			enum: ['github'],
		},
        avatar: {
            type:String,
        }
	},
	{ versionKey: false, timestamps: true }


)
	const User = models?.User || model('User', UserSchema)

	export default User as Model<UserModelSchema>

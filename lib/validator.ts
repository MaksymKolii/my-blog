import Joi, { ObjectSchema } from 'joi'

export const errorMessages = {
	EMPTY_TITLE: 'Title can Not be empty!',
	REQUIRED_TITLE: 'Title is are required field!',
	INVALID_TAGS: 'Tags must be array of strings!',
	INVALID_SLUG: 'Slug is missing!',
	INVALID_META: 'Meta description is missing!',
	INVALID_CONTENT: 'Post content is missing!',
}
export const postValidationSchema = Joi.object().keys({
	title: Joi.string().required().messages({
		'string.empty': errorMessages.EMPTY_TITLE,
		'any.required': errorMessages.REQUIRED_TITLE,
	}),
	content: Joi.string().required().messages({
		'string.empty': errorMessages.INVALID_CONTENT,
		'any.required': errorMessages.INVALID_CONTENT,
	}),
	slug: Joi.string().required().messages({
		'string.empty': errorMessages.INVALID_SLUG,
		'any.required': errorMessages.INVALID_SLUG,
	}),

	// meta: Joi.string().required().messages({
	meta: Joi.string().messages({
		'string.empty': errorMessages.INVALID_META,
		'any.required': errorMessages.INVALID_META,
	}),
	tags: Joi.array().items(Joi.string()).messages({
		'array.base': errorMessages.INVALID_TAGS, // Когда tags не массив
		'string.base': errorMessages.INVALID_TAGS, // Когда элементы не строки
	}),
})
export const validateSchema = (schema: ObjectSchema, value: any) => {
	const { error } = schema.validate(value, {
		errors: { label: 'key', wrap: { label: false, array: false } },
        allowUnknown:true //allow any optional values for example thumbnail (wich not in joi)
	})
	if (error) {
		console.log(error);
		return error.details[0].message
	}
	return '';
	
}

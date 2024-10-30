import { FinalPost } from '@/components/editor'

export const generateFormData = (post: FinalPost) => {
	const formData = new FormData()
	for (let key in post) {
		let value = (post as any)[key]
		if (key === 'tags') {
			// Преобразуем строку tags в массив строк, обрезаем пробелы и фильтруем пустые строки
			const tags = value
				.split(',')
				.map((tag: string) => tag.trim())
				.filter((tag: string) => tag !== '')
			formData.append('tags', JSON.stringify(tags))
		} else {
			formData.append(key, value)
		}
	}
	return formData
}

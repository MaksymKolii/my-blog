import { FinalPost } from '@/components/editor'
import { PostDetail } from './types'

export const generateFormData = (post: FinalPost) => {
  console.log(' IN helper.ts (post: FinalPost)', post)
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
export const filterPosts = (posts: PostDetail[], postToFilter: PostDetail) => {
  return posts.filter((post) => {
    return post.id !== postToFilter.id
  })
}

export const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
};
import { Editor } from '@tiptap/react'

export const getFocusedEditor = (editor: Editor) => {
  return editor.chain().focus()
}
export const validateUrl = (url: string) => {
  if (!url.trim()) return ''
  let finalUrlPath
  try {
    finalUrlPath = new URL(url)
  } catch (error) {
    finalUrlPath = new URL('http://' + url)
  }
  return finalUrlPath.origin
}

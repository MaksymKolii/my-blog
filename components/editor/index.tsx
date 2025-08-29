import {  EditorContent, } from '@tiptap/react'


import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react'
import ToolBar from './ToolBar'
import EditLink from './Link/EditLink'
import GalleryModal, { ImageSelectionResult } from './GaleryModal'
import axios from 'axios'
import SEOForm, { type SeoResult } from './SeoForm'
import ThumbnailSelector from './ThumbnailSelector'
import ActionButton from '../common/ActionButton'
import useEditorConfig from '@/hooks/useEditorConfig'

export interface FinalPost extends SeoResult {
  id?: string
  title: string
  content: string
  thumbnail?: File | string
}

interface ITipTapEditor {
  onSubmit(post: FinalPost): void
  btnTitle?: string
  initialValue?: FinalPost
  busy?: boolean
}

const TipTapEditor: FC<ITipTapEditor> = ({
  onSubmit,
  busy = false,
  btnTitle = 'Submit',
  initialValue,
}): JSX.Element => {
  // const [selectionRange, setSelectionRange] = useState<Range>()
  const [showGallery, setShowGallery] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<{ src: string }[]>([])
  const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>()
  const [post, setPost] = useState<FinalPost>({
    title: '',
    content: '',
    meta: '',
    tags: '',
    slug: '',
  })

  const fetchImages = async () => {
    const { data } = await axios('/api/image')
    setImages(data.images)
  }
  const handleImageUpload = async (image: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('image', image)
      const { data } = await axios.post('/api/image', formData)
      // console.log(data)
      setUploading(false)
      //* for array version formidable": "^3.5.1","@types/formidable": "^3.4.5"
      setImages([data.images[0], ...images])

      //* for single image  "@types/formidable": "^2.0.5","formidable": "^2.0.1",
      // setImages([data, ...images]);
    } catch (error: any) {
      setUploading(false)
      console.error('Image upload failed:', error)
      alert('Image upload failed. Please try again.')
    }
  }
  const { editor, selectionRange } = useEditorConfig({
    placeholder: 'Write something ...',
  })

  const handleImageSelection = (res: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: res.src, alt: res.altTextInterface })
      .run()

    // work
    // setShowGallery(false)
  }

  const handleSubmit: MouseEventHandler<HTMLButtonElement> | undefined = () => {
    if (!editor) return
    onSubmit({ ...post, content: editor.getHTML() })
  }

  const updateTitle: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setPost({ ...post, title: target.value })

  const updateSeoValue = (result: SeoResult) => setPost({ ...post, ...result })

  const updateThumbnail = (file: File) => setPost({ ...post, thumbnail: file })

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange)
    }
  }, [editor, selectionRange])

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    if (initialValue) {
      setPost({ ...initialValue })
      editor?.commands.setContent(initialValue.content)

      const { meta, tags, slug } = initialValue
      setSeoInitialValue({ meta, tags, slug })
    }
  }, [initialValue, editor])
  return (
    <>
      <div className="p-3 dark:bg-primary-dark bg-primary transition">
        <div className="sticky top-0 z-10 dark:bg-primary-dark bg-primary">
          {/* Thumbnail select & submit button */}
          <div className="flex items-center justify-between mb-3">
            <ThumbnailSelector
              initialValue={post.thumbnail as string}
              // onChange={file => {
              // 	console.log('FILE', file)
              // }}
              onChange={updateThumbnail}
            />
            <div className="inline-block">
              <ActionButton
                busy={busy}
                title={btnTitle}
                onClick={handleSubmit}
              />
            </div>
          </div>
          {/* Title Input */}
          <input
            type="text"
            className="py-2 outline-none bg-transparent w-full border-0 border-b-[1px] border-secondary-dark dark:border-secondary-light text-3xl font-semibold italic text-primary-dark dark:text-primary mb-3"
            placeholder="Title"
            onChange={updateTitle}
            value={post.title}
          />
          <ToolBar
            editor={editor}
            onOpenImageClick={() => setShowGallery(true)}
          />
          <div className=" h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3" />
        </div>
        {/* for Bubble menu */}
        {editor ? <EditLink editor={editor} /> : null}
        {/* --------------------------- */}

        <EditorContent editor={editor} className="min-h-[300px]" />
        <div className=" h-[1px] w-full dark:bg-secondary-light bg-secondary-light my-3" />
        <SEOForm
          title={post.title}
          onChange={updateSeoValue}
          initialValue={seoInitialValue}
        />
      </div>
      <GalleryModal
        uploading={uploading}
        images={images}
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
      />
    </>
  )
}

export default TipTapEditor

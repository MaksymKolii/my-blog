import { FC, useState } from 'react'
import Button from '../ToolBar/Button'
import { BsYoutube } from 'react-icons/bs'

interface IEmbedYoutube {
  onSubmit(some: string): void
}

const EmbedYoutube: FC<IEmbedYoutube> = ({ onSubmit }): JSX.Element => {
  const [visible, setVisible] = useState(false)
  const [url, setUrl] = useState('')

  const handleSubmit = () => {
    if (!url.trim()) return hideForm()

    onSubmit(url)
    setUrl('')
    hideForm()
  }
  const hideForm = () => setVisible(false)
  const showForm = () => setVisible(true)

  return (
    <div
      onKeyDown={({ key }) => {
        if (key === 'Escape') hideForm()
        // console.log(key)
      }}
      className="relative"
    >
      <Button
        onClick={() => {
          visible ? hideForm() : showForm()
        }}
      >
        <BsYoutube />
      </Button>
      <div className="absolute top-full mt-5 z-50 right-0">
        {visible && (
          <div className="flex  space-x-2">
            <input
              autoFocus
              type="text"
              className="rounded border-2 outline-none  bg-transparent focus:ring-0 focus:border-primary-dark dark:focus:border-primary border-secondary-dark transition dark:text-primary text-primary-dark px-2 py-1"
              placeholder="https://youtube.com"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-action text-primary 
                    text-sm px-2 rounded"
            >
              Embed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmbedYoutube

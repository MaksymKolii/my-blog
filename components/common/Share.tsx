import { FC } from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'next-share'
interface ShareProps {
  url: string
  title?: string
  quote?: string
}

const Share: FC<ShareProps> = ({ url, title, quote }): JSX.Element => {
  return (
    <div className="flex items-center space-x-3">
      <p className="font-semibold text-primary-dark dark:text-primary">
        Share:{' '}
      </p>
      <FacebookShareButton url={url} quote={quote} title={title}>
        <FacebookIcon round size={32} />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon round size={32} />
      </TwitterShareButton>
      <LinkedinShareButton url={url} source={quote} title={title}>
        <LinkedinIcon round size={32} />
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={title} separator=":: ">
        <WhatsappIcon round size={32} />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon round size={32} />
      </TelegramShareButton>
      <RedditShareButton url={url} title={title}>
        <RedditIcon round size={32} />
      </RedditShareButton>
    </div>
  )
}

export default Share

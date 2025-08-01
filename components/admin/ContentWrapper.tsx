import Link from 'next/link'
import { FC, ReactNode } from 'react'

interface ContentWrapperProps {
  title: string
  children: ReactNode
  seeAllRoute: string
}

const ContentWrapper: FC<ContentWrapperProps> = ({
  title,
  children,
  seeAllRoute,
}): JSX.Element => {
  return (
    <div className="flex flex-col min-w-[300px]">
      <h3 className="text-2xl dark:text-primary text-primary-dark font-semibold py-2 transition">
        {title}
      </h3>
      <div className="border-2 border-secondary-dark p-3 rounded flex-1">
        <div className="space-y-5">{children}</div>
        <div className="mt-2 text-right self-end">
          <Link
            className="text-primary-dark dark:text-primary hover:underline transition"
            href={seeAllRoute}
          >
            See all
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ContentWrapper

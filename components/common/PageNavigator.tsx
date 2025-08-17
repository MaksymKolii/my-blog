import { FC, MouseEventHandler } from 'react'

interface PageNavigatorProps {
  onPrevClick?(): void
  onNextClick?(): void
}

const PageNavigator: FC<PageNavigatorProps> = ({onPrevClick,
onNextClick}): JSX.Element => {
  return (
    <div className=" flex items-center space-x-3">
      <Button onClick={onPrevClick} title="Prev"></Button>
      <Button onClick={onNextClick} title="Next"></Button>
    </div>
  )
}

const Button: FC<{
  title: string
  onClick?: MouseEventHandler
}> = ({ title, onClick }) => {
  return (
    <button
      className="text-primary-dark dark:text-primary hover:underline transition  bg-slate-400 rounded-md px-2 py-1"
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default PageNavigator

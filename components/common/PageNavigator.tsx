// import { FC, MouseEventHandler } from 'react'

// interface PageNavigatorProps {
//   onPrevClick?(): void
//   onNextClick?(): void
// }

// const PageNavigator: FC<PageNavigatorProps> = ({onPrevClick,
// onNextClick}): JSX.Element => {
//   return (
//     <div className=" flex items-center space-x-3">
//       <Button onClick={onPrevClick} title="Prev"></Button>
//       <Button onClick={onNextClick} title="Next"></Button>
//     </div>
//   )
// }

// const Button: FC<{
//   title: string
//   onClick?: MouseEventHandler
// }> = ({ title, onClick }) => {
//   return (
//     <button
//       className="text-primary-dark dark:text-primary hover:underline transition  bg-slate-400 rounded-md px-2 py-1"
//       onClick={onClick}
//     >
//       {title}
//     </button>
//   )
// }

// export default PageNavigator


import { FC, MouseEventHandler } from 'react'

interface PageNavigatorProps {
  onPrevClick?(): void
  onNextClick?(): void
  showPrev?: boolean
  showNext?: boolean
  isPrevDisabled?: boolean
  isNextDisabled?: boolean
}

const PageNavigator: FC<PageNavigatorProps> = ({
  onPrevClick,
  onNextClick,
  showPrev = true,
  showNext = true,
  isPrevDisabled = false,
  isNextDisabled = false,
}): JSX.Element | null => {
  // если обе кнопки скрыты — вообще ничего не рендерим
  if (!showPrev && !showNext) return null

  return (
    <div className="flex items-center space-x-3">
      {showPrev && (
        <Button title="Prev" onClick={onPrevClick} disabled={isPrevDisabled} />
      )}
      {showNext && (
        <Button title="Next" onClick={onNextClick} disabled={isNextDisabled} />
      )}
    </div>
  )
}

const Button: FC<{
  title: string
  onClick?: MouseEventHandler
  disabled?: boolean
}> = ({ title, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        'rounded-md px-2 py-1 transition',
        'text-primary-dark dark:text-primary bg-slate-400 hover:underline',
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none hover:no-underline' : '',
      ].join(' ')}
    >
      {title}
    </button>
  )
}

export default PageNavigator

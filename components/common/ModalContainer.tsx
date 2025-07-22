import {
  FC,
  KeyboardEvent,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from 'react'

export interface ModalContainerProps {
  // children: ReactNode
  visible?: boolean
  onClose?(): void
}
interface Props extends ModalContainerProps {
  children: ReactNode
}
const ModalContainer: FC<Props> = ({
  visible,
  children,
  onClose,
}): JSX.Element | null => {
  const containerId = useId()

  const handleClose = useCallback(() => onClose && onClose(), [onClose])

  const handleClick = ({ target }: any) => {
    if (target.id === containerId) handleClose()
  }
  //* For closing this div(blur) by Escape
  useEffect(() => {
    const closeModal = (ev: any) => {
      // console.log(ev);
      ev.key === 'Escape' && handleClose()
    }
    document.addEventListener('keydown', closeModal)
    return () => document.removeEventListener('keydown', closeModal)
  }, [handleClose])

  if (!visible) return null

  return (
    <div
      id={containerId}
      onClick={handleClick}
      className="fixed inset-0 bg-primary dark:bg-primary-dark dark:bg-opacity-5 bg-opacity-5 backdrop-blur-[2px] z-50 flex items-center justify-center"
    >
      {children}
    </div>
  )
}

export default ModalContainer

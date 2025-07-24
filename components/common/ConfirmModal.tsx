import { FC } from 'react'
import ModalContainer, { ModalContainerProps } from './ModalContainer'
import classNames from 'classnames'
import { ImSpinner9 } from 'react-icons/im'

interface IConfirmModal extends ModalContainerProps {
  title: string
  subTitle: string
  busy?: boolean
  onCancel?(): void
  onConfirm?(): void
}

const commonBtnClasses = 'px-3 py-1  rounded'

const ConfirmModal: FC<IConfirmModal> = ({
  onClose,
  busy = false,
  visible,
  title,
  subTitle,
  onCancel,
  onConfirm,
}): JSX.Element => {
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="bg-primary-dark dark:bg-primary rounded p-3 space-y-2 max-w-[380px]">
        {' '}
        {/* title */}
        <p className="dark:text-primary-dark text-primary font-semibold tet-lg">
          {title}
        </p>
        {/* subtitle */}
        <p className="dark:text-primary-dark text-primary">{subTitle}</p>
        {/* buttons */}
        {busy && (
          <p className=" flex items-center justify-center space-x-2  dark:text-primary-dark text-primary">
            <ImSpinner9 className="animate-spin" />
            <span>Please wait!</span>
          </p>
        )}
        {!busy && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onConfirm}
              className={classNames(commonBtnClasses, 'bg-red-500 ')}
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className={classNames(commonBtnClasses, 'bg-blue-500 ')}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </ModalContainer>
  )
}

export default ConfirmModal

import { FC } from 'react'
import DropdownOptions, { dropDownOptions } from '../DropdownOptions'
import ProfileHead from '../ProfileHead'
import { useRouter } from 'next/router'
import useDarkMode from '@/hooks/userDarkMode'
import { signOut } from 'next-auth/react'
import SearchBar from '../SearchBar'

interface IAdminSecondaryNav {}

const AdminSecondaryNav: FC<IAdminSecondaryNav> = (props): JSX.Element => {
  const router = useRouter()
  const { toggleTheme } = useDarkMode()
  const navigateToCreateNewPost = () => router.push('/admin/posts/create')
  const handleLogOut = async () => await signOut()

  const options: dropDownOptions = [
    {
      label: 'Add new post',
      onClick: navigateToCreateNewPost,
    },
    {
      label: 'Change color theme',
      onClick: toggleTheme,
    },
    {
      label: 'Log out',
      onClick: handleLogOut,
    },
  ]
  return (
    <div className="flex items-center justify-between">
      {/* search bar */}
      <SearchBar />
      {/* options / profile head */}
      <DropdownOptions
        head={<ProfileHead nameInitial="J" />}
        options={options}
      />
    </div>
  )
}

export default AdminSecondaryNav

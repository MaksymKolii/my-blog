import { FC, useMemo } from 'react'
import DropdownOptions, { dropDownOptions } from '../DropdownOptions'
import ProfileHead from '../ProfileHead'
import { useRouter } from 'next/router'
import useDarkMode from '@/hooks/userDarkMode'
import { signOut, useSession } from 'next-auth/react'
import SearchBar from '../SearchBar'
import { UserProfile } from '@/utils/types'

// --- локальный хелпер (EN + PL + RU/UA гласные)
const VOWELS = /[aeiouyąęóаеёиоуыэюяєії]/gi

const getInitialsNextConsonant = (name?: string) => {
  if (!name) return ''
  const first = name.charAt(0).toUpperCase()
  const rest = name.slice(1)
  const nextConsonant = rest.replace(VOWELS, '').charAt(0)
  const second = (nextConsonant || rest.charAt(0) || '').toLowerCase()
  return first + second // пример: "Maksym" -> "Mk"
}

interface IAdminSecondaryNav {}

const AdminSecondaryNav: FC<IAdminSecondaryNav> = (props): JSX.Element => {
  const router = useRouter()

  const { data } = useSession()

  const profile = data?.user as UserProfile | undefined

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

  // чтобы не пересчитывать на каждый ререндер
  const nameInitial = useMemo(
    () => getInitialsNextConsonant(profile?.name),
    [profile?.name],
  )

const handleSearchSubmit=(query:string)=>{
if(!query) return
// search

router.push('/admin/search?title='+query)

}

  return (
    <div className="flex items-center justify-between">
      {/* search bar */}
      <SearchBar onsubmit={handleSearchSubmit}/>
      {/* options / profile head */}
      <DropdownOptions
        head={
          <ProfileHead
            nameInitial={nameInitial}
            avatar={profile?.avatar}
            // lightOnly
          />
        }
        options={options}
      />
    </div>
  )
}

export default AdminSecondaryNav

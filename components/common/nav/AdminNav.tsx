import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'
import { RiMenuFold4Fill, RiMenuFold3Fill } from 'react-icons/ri'
import { IconType } from 'react-icons'
import Logo from '../Logo'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

interface IAdminNavProps {
  navItem: {
    label: string
    icon: IconType
    href: string
  }[]
}

const AdminNav: FC<IAdminNavProps> = ({ navItem }): JSX.Element => {
  const NAV_OPEN_WIDTH = 'w-60'
  const NAV_CLOSE_WIDTH = 'w-12'
  //*  take reference for our nav
  const navRef = useRef<HTMLElement>(null)

  const [visible, setVisible] = useState(true)

  const toggleNav = (visibility: boolean) => {
    const currentNav = navRef.current
    if (!currentNav) {
      return
    }
    const { classList } = currentNav
    if (visibility) {
      //* hide our nav
      classList.remove(NAV_OPEN_WIDTH)
      classList.add(NAV_CLOSE_WIDTH)
    } else {
      //* show our nav
      classList.remove(NAV_CLOSE_WIDTH)
      classList.add(NAV_OPEN_WIDTH)
    }
    navRef.current?.style
    // setVisible(!visible)
  }

  const updateNavState = () => {
    toggleNav(visible)
    const newToggleState = !visible
    setVisible(newToggleState)
    localStorage.setItem('nav-visibility', JSON.stringify(newToggleState))
  }

  useEffect(() => {
    const navState = localStorage.getItem('nav-visibility')

    if (navState !== null) {
      const newState = JSON.parse(navState)

      setVisible(newState)
      toggleNav(!newState)
    } else {
      setVisible(true)
    }
  }, [])
  return (
    <nav
      ref={navRef}
      className=" flex flex-col justify-between h-screen w-60 shadow-sm bg-secondary-light dark:bg-secondary-dark transition-width overflow-hidden sticky top-0"
    >
      {/* logo */}
      <div>
        <Link href="/admin" className="flex items-center space-x-2 p-3 mb-10">
          <Logo className="fill-highlight-light dark:fill-highlight-dark w-5 h-5" />
          {visible && (
            <span className="text-highlight-light dark:text-highlight-dark text-xl font-semibold leading-none">
              Admin
            </span>
          )}
        </Link>
        {/* nav items  */}
        <div className="space-y-6">
          {navItem &&
            navItem.map((item) => {
              return (
                <Tippy key={item.href} content={item.label}>
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center p-3 text-highlight-light dark:text-highlight-dark text-xl hover:font-semibold hover:scale-[0.98] hover:text-[#eb9b07] transition"
                  >
                    <item.icon size={24} />
                    {visible && (
                      <span className="ml-2 leading-none">{item.label}</span>
                    )}
                  </Link>
                </Tippy>
              )
            })}
        </div>
      </div>

      <button
        onClick={updateNavState}
        className="p-3 text-highlight-light dark:text-highlight-dark text-xl hover:font-semibold hover:scale-[0.94] hover:text-[#eb9b07] transition self-end"
      >
        {visible ? (
          <RiMenuFold3Fill size={28} />
        ) : (
          <RiMenuFold4Fill size={28} />
        )}

        <span className="sr-only">Toggle Button</span>
      </button>
    </nav>
  )
}

export default AdminNav

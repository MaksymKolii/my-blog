// import Image from 'next/image'
// import { FC } from 'react'

// export interface AuthorProfile {
//   id: string
//   name: string
//   avatar: string
//   message: string
//   github?: string 
// }
// interface Props {
//   profile: AuthorProfile
// }

// const AuthorInfo: FC<Props> = ({ profile }): JSX.Element => {
//   const {  name, avatar, message } = profile
//   return (
//     <div className="p-2 border-2 border-secondary-dark rounded flex ">
//       {/* profile icons */}
//       <div className="w-12 shrink-0">
//         <div className="aspect-square relative">
//           <Image src={avatar} alt={name} fill className="rounded object-cover" />
//         </div>
//       </div>
//       {/* profile name message */}
//       <div className="ml-12 flex-1">
//         <h4 className="font-semibold text-primary-dark dark:text-primary ">
//           {name}
//         </h4>
//         <p className=" text-primary-dark dark:text-primary opacity-90 ">
//           {message}
//         </p>
//       </div>
//     </div>
//   )
// }

// export default AuthorInfo





import Image from 'next/image'
import { FC } from 'react'

export interface AuthorProfile {
  id: string
  name: string
  avatar: string            // ожидаем строку (может быть пустой)
  message: string           // текст без URL!
  github?: string           // ссылка на профиль (если есть — показываем)
}

interface Props {
  profile: AuthorProfile
}

const AuthorInfo: FC<Props> = ({ profile }): JSX.Element => {
  const { name, avatar, message, github } = profile

  return (
    <div className="p-4 border-2 border-secondary-dark rounded flex gap-4">
      {/* avatar */}
      <div className="w-12 shrink-0">
        <div className="relative aspect-square">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="rounded object-cover"
            />
          ) : (
            <div className="w-full h-full rounded bg-gray-300" />
          )}
        </div>
      </div>

      {/* name + message */}
      <div className="flex-1">
        <h4 className="font-semibold text-primary-dark dark:text-primary">
          {name}
        </h4>

        <p className="text-primary-dark dark:text-primary opacity-90">
          {message}{' '}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {github}
            </a>
          )}
        </p>
      </div>
    </div>
  )
}

export default AuthorInfo

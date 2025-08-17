import { LatestUserProfile } from '@/utils/types'
import { FC } from 'react'
import ProfileIcon from '../common/ProfileIcon'

interface LatestUserTableProps {
  users?: LatestUserProfile[]
}

const LatestUserTable: FC<LatestUserTableProps> = ({ users }): JSX.Element => {
  return (
    <div className='pt-4'>
      <table className="w-full text-left text-primary-dark dark:text-primary ">
        <tbody>
          <tr className=" text-left bg-secondary-dark text-primary ">
            <th className=" p-2 ">Profile</th>
            <th className=" p-2 ">Email</th>
            <th className=" p-2 ">Provider</th>
            {/* <th className=" p-2 ">Role</th> */}
          </tr>
          {users?.map((profile) => {
            return (
              <tr className='border-b' key={profile.id}>
                <td className='py-2'>
                  <div className='flex items-center space-x-2 '>
                    <ProfileIcon
                      avatar={profile.avatar}
                      nameInitial={profile.name[0].toUpperCase()}
                    />
                    <p>
                        {profile.name}
                    </p>
                  </div>
                </td>
               
                <td>{profile.email} </td>
                <td>{profile.provider} </td>
                {/* <td>{profile.role} </td> */}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LatestUserTable

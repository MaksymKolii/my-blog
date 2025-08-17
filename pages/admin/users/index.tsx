// import LatestUserTable from '@/components/admin/LatestUserTable'
// import PageNavigator from '@/components/common/PageNavigator'
// import AdminLayout from '@/components/layout/AdminLayout'
// import { LatestUserProfile } from '@/utils/types'
// import axios, { CanceledError } from 'axios'
// import { NextPage } from 'next'
// import { useEffect, useState } from 'react'

// const LIMIT = 5

// const Users: NextPage = () => {
//   const [users, setUsers] = useState<LatestUserProfile[]>([])
//   const [page, setPage] = useState(0)
//   const [hasMore, setHasMore] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const controller = new AbortController()

//     ;(async () => {
//       try {
//         setLoading(true)
//         setError(null)

//         const { data } = await axios.get('/api/user', {
//           params: { pageNo: page, limit: LIMIT },
//           signal: controller.signal,
//         })

//         // ожидаем ответ вида { users, pageNo, limit, total, hasMore }
//         setUsers(Array.isArray(data.users) ? data.users : [])
//         setHasMore(Boolean(data.hasMore))
//       } catch (e: any) {
//         if (e instanceof CanceledError) return
//         if (e?.response?.status === 403) {
//           setError('Нет прав: доступ только для администратора.')
//         } else {
//           setError('Не удалось загрузить пользователей.')
//         }
//         console.error('GET /api/user failed:', e)
//       } finally {
//         setLoading(false)
//       }
//     })()

//     return () => controller.abort()
//   }, [page])

//   const handleOnNextClick = () => {
//     if (!loading && hasMore) setPage((p) => p + 1)
//   }

//   const handleOnPrevClick = () => {
//     if (!loading && page > 0) setPage((p) => p - 1)
//   }

//   return (
//     <AdminLayout>
//       <h1 className="text-2xl dark:text-primary text-primary-dark font-semibold py-2 transition">
//         Users
//       </h1>

//       {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

//       {/* всегда отдаём массив, даже если пустой */}
//       <LatestUserTable users={users} />

//       <div className="mt-auto py-10 flex justify-end">
//         <PageNavigator
//           onNextClick={handleOnNextClick}
//           onPrevClick={handleOnPrevClick}
//           showPrev={page > 0}
//           showNext={hasMore}
//           isPrevDisabled={page===0 ||loading}
//           isNextDisabled={!hasMore ||loading}
//         />
//       </div>
//     </AdminLayout>
//   )
// }

// export default Users

import LatestUserTable from '@/components/admin/LatestUserTable'
import PageNavigator from '@/components/common/PageNavigator'
import AdminLayout from '@/components/layout/AdminLayout'
import { LatestUserProfile } from '@/utils/types'
import axios, { CanceledError } from 'axios'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const LIMIT = 5

const Users: NextPage = () => {
  const [users, setUsers] = useState<LatestUserProfile[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const { data } = await axios.get('/api/user', {
          params: { pageNo: page, limit: LIMIT },
          signal: controller.signal,
        })

        // ожидаем ответ вида { users, pageNo, limit, total, hasMore }
        setUsers(Array.isArray(data.users) ? data.users : [])
        setHasMore(Boolean(data.hasMore))
      } catch (e: any) {
        if (e instanceof CanceledError) return
        if (e?.response?.status === 403) {
          setError('Нет прав: доступ только для администратора.')
        } else {
          setError('Не удалось загрузить пользователей.')
        }
        console.error('GET /api/user failed:', e)
      } finally {
        setLoading(false)
      }
    })()

    return () => controller.abort()
  }, [page])

  const handleOnNextClick = () => {
    if (!loading && hasMore) setPage((p) => p + 1)
  }

  const handleOnPrevClick = () => {
    if (!loading && page > 0) setPage((p) => p - 1)
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl dark:text-primary text-primary-dark font-semibold py-2 transition">
        Users
      </h1>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* всегда отдаём массив, даже если пустой */}
      <LatestUserTable users={users} />

      <div className="mt-auto py-10 flex justify-end">
        <PageNavigator
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
          showPrev={page > 0}
          showNext={hasMore}
          isPrevDisabled={page === 0 || loading}
          isNextDisabled={!hasMore || loading}
        />
      </div>
    </AdminLayout>
  )
}

export default Users

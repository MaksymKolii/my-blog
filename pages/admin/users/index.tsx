import LatestUserTable from '@/components/admin/LatestUserTable'
import PageNavigator from '@/components/common/PageNavigator'
import AdminLayout from '@/components/layout/AdminLayout'
import { LatestUserProfile } from '@/utils/types'
import axios, { CanceledError } from 'axios'
import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'

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

//   const reqIdRef = useRef(0)

// useEffect(() => {
//   const controller = new AbortController()
//   const reqId = ++reqIdRef.current
//   const requestedPage = page

//   ;(async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const { data } = await axios.get('/api/user', {
//         params: { pageNo: requestedPage, limit: LIMIT /*, role: 'all'*/ },
//         signal: controller.signal,
//         headers: { 'Cache-Control': 'no-store' }, // без 304 в dev
//       })

//       // устаревший ответ — игнорируем полностью
//       if (reqIdRef.current !== reqId) return

//       setUsers(Array.isArray(data.users) ? data.users : [])
//       setHasMore(Boolean(data.hasMore))

//       // сервер «зажал» страницу — синхронизируем
//       if (typeof data.pageNo === 'number' && data.pageNo !== requestedPage) {
//         setPage(data.pageNo)
//       }

//       console.log('resp:', {
//         reqPage: requestedPage,
//         gotPage: data.pageNo,
//         total: data.total,
//         hasMore: data.hasMore,
//         len: data.users?.length,
//         reqId,
//         latestId: reqIdRef.current,
//       })
//     } catch (e: any) {
//       if (e instanceof CanceledError) return
//       if (reqIdRef.current !== reqId) return
//       setError(e?.response?.status === 403
//         ? 'Нет прав: доступ только для администратора.'
//         : 'Не удалось загрузить пользователей.')
//     } finally {
//       if (reqIdRef.current === reqId) setLoading(false)
//     }
//   })()

//   return () => controller.abort()
// }, [page])


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
          isPrevDisabled={page===0 ||loading}
          isNextDisabled={!hasMore ||loading}
        />
      </div>
    </AdminLayout>
  )
}

export default Users




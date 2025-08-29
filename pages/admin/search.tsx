import InfiniteScrollPosts from '@/components/common/InfiniteScrollPosts'
import AdminLayout from '@/components/layout/AdminLayout'
import { filterPosts } from '@/utils/helper'
import { PostDetail } from '@/utils/types'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Search: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [results, setResults] = useState<PostDetail[]>([])
  const { query, isReady } = useRouter()

  //   const title = query.title as string

  //   const handleSearch = async () => {
  //     try {
  //       setLoading(true)
  //       const { data } = await axios('/api/posts/search?title=' + title)
  //       setLoading(false)

  //       setResults(data.results)
  // if(!data.results.length) setNotFound(true)
  //     else setNotFound(false)

  //     } catch (error: any) {
  //       console.log('error while searching post: ', error.message)
  //     }
  //   }
  //   useEffect(() => {
  //     if (loading) return
  //     handleSearch()
  //   }, [title])

  // безопасно достаём title из query (string | string[] | undefined)
  const raw = query?.title
  const title =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? (raw[0] ?? '') : ''

//   useEffect(() => {
//     if (!isReady) return

//     const t = title.trim()
//     if (!t) {
//       setResults([])
//       setNotFound(false)
//       return
//     }

//     const controller = new AbortController()

//     ;(async () => {
//       try {
//         setLoading(true)
  
//         const { data } = await axios.get('/api/posts/search', {
//           params: { title: t },
//           signal: controller.signal,
//         })
//         const list = Array.isArray(data?.results) ? data.results : []
//         setResults(list)
//         setNotFound(list.length === 0)
//       } catch (err) {
//         // игнорируем отменённые запросы
//         if (axios.isCancel?.(err)) return
//         console.error('error while searching post:', err)
//       } finally {
//         setLoading(false)
//       }
//     })()

//     return () => controller.abort()
//   }, [isReady, title])


useEffect(() => {
  if (!isReady) return;

  const t = title.trim();
  if (!t) {
    setResults([]);
    setNotFound(false);
    return;
  }

  const controller = new AbortController();

  // ждём 400мс после последнего изменения title
  const id = setTimeout(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/posts/search', {
        params: { title: t },
        signal: controller.signal,
      });
      const list = Array.isArray(data?.results) ? data.results : [];
      setResults(list);
      setNotFound(list.length === 0);
    } catch (err) {
      if (axios.isCancel?.(err)) return; // запрос отменён — игнорим
      console.error('error while searching post:', err);
    } finally {
      setLoading(false);
    }
  }, 400);

  // при изменении title или размонтировании:
  // 1) чистим таймер дебаунса
  // 2) отменяем возможный in-flight запрос
  return () => {
    clearTimeout(id);
    controller.abort();
  };
}, [isReady, title]);

  return (
    <AdminLayout>
            {loading && (
        <h1 className="text-center text-3xl text-secondary-dark  font-semibold opacity-40">
          Searching...
        </h1>
      ) }
      {!loading && notFound &&  (
        <h1 className="text-center text-3xl text-secondary-dark  font-semibold opacity-40">
          Not Found :(
        </h1>
      ) }
  

      <InfiniteScrollPosts
        hasMore={false}
        posts={results}
        dataLength={results.length}
        next={() => {}}
        showControls
        // onPostRemoved={(post) => {
        //   setResults(filterPosts(results, post))
        // }}
        onPostRemoved={(post) => {
          setResults((prev) => filterPosts(prev, post))
        }}
      />
    </AdminLayout>
  )
}

export default Search

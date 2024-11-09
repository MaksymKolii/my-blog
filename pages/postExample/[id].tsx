import { NextPage } from 'next'
import { useRouter } from 'next/router'

interface MyNextCoolPageID {}

const MyNextCoolPageID: NextPage<MyNextCoolPageID> = () => {
	const router = useRouter()
	console.log(router)
    return <div className=''>MyNextCoolPageID: </div>
}

export default MyNextCoolPageID

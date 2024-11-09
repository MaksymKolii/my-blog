import { NextPage } from 'next';
import { useRouter } from 'next/router';

interface OurCoolPage {}

const OurCoolPage: NextPage<OurCoolPage> = () => {
    const router = useRouter()
    console.log(router);
    return <div className=''>OurCoolPage:</div>
};

export default OurCoolPage;
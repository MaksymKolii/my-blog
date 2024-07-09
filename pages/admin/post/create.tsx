import TipTapEditor from '@/components/editor'
import { NextPage } from 'next';

interface ICreate {}

const Create: NextPage<ICreate> =()=>{
   return <div className="max-w-4xl mx-auto"><TipTapEditor/></div>;
};

export default Create;

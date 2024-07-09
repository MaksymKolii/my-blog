import { FC, useState } from 'react'
import Button from '../ToolBar/Button'
import { BsLink45Deg } from 'react-icons/bs'
import LinkForm from './LinkForm'


interface IInsertLink {}

const InsertLink: FC<IInsertLink> = (props): JSX.Element => {
    const [visible, setVisible] = useState(false)
	return (
		<div onKeyDown={({key})=>{
            // if(key === 'Escape'){}
            console.log(key)}}
        className='relative'>
			<Button 
            onClick={()=>setVisible(!visible)}>
				<BsLink45Deg />
			</Button>
            <div className="absolute top-full mt-4 z-50 right-0">
                <LinkForm visible={visible}/>
            </div>
		</div>
	)
}

export default InsertLink

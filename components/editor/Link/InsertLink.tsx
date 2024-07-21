import { FC, useState } from 'react'
import Button from '../ToolBar/Button'
import { BsLink45Deg } from 'react-icons/bs'
import LinkForm from './LinkForm'
import {type  LinkOption } from './LinkForm'

interface IInsertLink {
    onSubmit(someLink: LinkOption): void
   
}

const InsertLink: FC<IInsertLink> = ({onSubmit}): JSX.Element => {
    //* 1
    const [visible, setVisible] = useState(false)

    const handleSubmit =(link:LinkOption)=>{
        if(!link.url.trim()) return hideForm()

        onSubmit(link)
        hideForm()
    }
    const hideForm = ()=>setVisible(false)
    const showForm = ()=>setVisible(true)
    
	return (
		<div onKeyDown={({key})=>{
            if(key === 'Escape') hideForm()
          
            // console.log(key)
        }}
        className='relative'>
			<Button 
            onClick={()=>{visible ? hideForm(): showForm()}}>
				<BsLink45Deg />
			</Button>
            <div className="absolute top-full mt-4 z-50 right-0">
                <LinkForm onSubmit={handleSubmit} visible={visible}/>
            </div>
		</div>
	)
}

export default InsertLink


import { FC, FormEventHandler, useState } from 'react'

interface ISearchBar {
  onsubmit(query:string):void
}

const SearchBar: FC<ISearchBar> = ({onsubmit}): JSX.Element => {

  const [query, setQuery]=useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> =(e) =>{

    e.preventDefault()
    onsubmit(query)
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="search..."
        type="text"
        className="border-2 bg-transparent
       border-secondary-dark rounded  p-2  text-primary-dark
        dark:text-primary focus:border-primary-dark dark:focus:border-primary outline-none transition"
        value={query}
        onChange={({target})=> setQuery(target.value)}
      />
    </form>
  )
}

export default SearchBar

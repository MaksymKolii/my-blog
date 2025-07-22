import { FC } from 'react'

interface ISearchBar {}

const SearchBar: FC<ISearchBar> = (props): JSX.Element => {
  return (
    <input
      placeholder="search..."
      type="text"
      className="border-2 bg-transparent border-secondary-dark rounded  p-2  text-primary-dark dark:text-primary focus:border-primary-dark dark:focus:border-primary outline-none transition"
    />
  )
}

export default SearchBar

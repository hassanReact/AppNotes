// SearchBar.jsx
import React from "react"
import { FaMagnifyingGlass } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex items-center px-3 sm:px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes..."
        className="w-full text-xs sm:text-sm bg-transparent py-2 sm:py-[11px] outline-none"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />

      {value && (
        <IoMdClose
          className="text-slate-500 text-lg sm:text-xl cursor-pointer hover:text-black mr-2 sm:mr-3 flex-shrink-0"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-500 text-lg sm:text-xl cursor-pointer hover:text-black flex-shrink-0"
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
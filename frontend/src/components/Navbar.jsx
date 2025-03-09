// Navbar.jsx
import React, { useState, useEffect, useRef } from "react"
import SearchBar from "./SearchBar/SearchBar"
import ProfileInfo from "./Cards/ProfileInfo"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice"
import axios from "axios"
import { FaBars, FaTimes, FaSearch } from "react-icons/fa"

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Listen for scroll events to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
      setMobileSearchOpen(false)
    }
  }
  
  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }
  
  const onLogout = async () => {
    try {
      dispatch(signoutStart())
      const res = await axios.get(`${process.env.BECKEND_Base_URL}/api/auth/signout`, {
        withCredentials: true,
      })
      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message))
        toast.error(res.data.message)
        return
      }
      toast.success(res.data.message)
      dispatch(signInSuccess())
      navigate("/login")
    } catch (error) {
      toast.error(error.message)
      dispatch(signoutFailure(error.message))
    }
  }
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (mobileSearchOpen) setMobileSearchOpen(false)
  }

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen)
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }
  
  return (
    <div 
      className={`flex items-center justify-between px-4 sm:px-6 py-3 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg" 
          : "bg-gradient-to-r from-indigo-400 to-purple-500"
      }`}
    >
      {/* Logo */}
      <Link to={"/"} className="group z-10">
        <h2 className="text-xl sm:text-2xl font-bold py-2 transition-all duration-300 transform group-hover:scale-105">
          <span className="text-white">App</span>
          <span className="text-yellow-300">Notes</span>
        </h2>
      </Link>
      
      {/* Desktop Search Bar */}
      <div className="hidden md:block transition-all duration-300 transform hover:scale-102 flex-1 max-w-md mx-4">
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>
      
      {/* Mobile Search and Menu Buttons */}
      <div className="flex items-center md:hidden ml-auto mr-2">
        <button 
          onClick={toggleMobileSearch}
          className="p-2 text-white focus:outline-none"
        >
          <FaSearch className="text-xl" />
        </button>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 ml-1 text-white focus:outline-none"
          ref={mobileMenuRef}
        >
          {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>
      
      {/* Desktop Profile */}
      <div className="hidden md:block relative" ref={dropdownRef}>
        <div 
          className="cursor-pointer transition-transform duration-300 transform hover:scale-105"
          onClick={toggleDropdown}
        >
          <ProfileInfo userInfo={userInfo} />
        </div>
        
        {dropdownOpen && userInfo && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden transition-all duration-300 animate-dropdownFade">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{userInfo?.username || userInfo?.name}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
            </div>
            
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profile
            </Link>
            
            <Link 
              to="/mynotes" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              My Notes
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Settings
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button 
              onClick={onLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-0 bg-indigo-600 p-4 flex items-center transition-all duration-300 z-20">
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
          </div>
          <button onClick={toggleMobileSearch} className="ml-2 text-white">
            <FaTimes className="text-xl" />
          </button>
        </div>
      )}
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg overflow-hidden z-20 animate-slideDown">
          <div className="p-4 border-b border-gray-100 flex items-center">
            {userInfo && (
              <ProfileInfo userInfo={userInfo} isMobile={true} />
            )}
          </div>
          
          <nav className="py-2">
            <Link 
              to="/profile" 
              className="flex items-center px-4 py-3 hover:bg-indigo-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="text-gray-800">Profile</span>
            </Link>
            
            <Link 
              to="/mynotes" 
              className="flex items-center px-4 py-3 hover:bg-indigo-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="text-gray-800">My Notes</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-3 hover:bg-indigo-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="text-gray-800">Settings</span>
            </Link>
            
            <button 
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
            >
              <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export default Navbar
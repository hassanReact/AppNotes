import React, { useEffect, useState } from "react"
import NoteCard from "../../components/Cards/NoteCard"
import { MdAdd } from "react-icons/md"
import Modal from "react-modal"
import AddEditNotes from "./AddEditNotes"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import axios from "axios"
import { toast } from "react-toastify"
import EmptyCard from "../../components/EmptyCard/EmptyCard"

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  )

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login")
    } else {
      setUserInfo(currentUser?.rest)
      getAllNotes()
    }
  }, [])

  // get all notes
  const getAllNotes = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/note/all", {
        withCredentials: true,
      })

      if (res.data.success === false) {
        console.log(res.data)
        return
      }

      setAllNotes(res.data.notes)
    } catch (error) {
      console.log(error)
      toast.error("Failed to load notes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/note/delete/" + noteId,
        { withCredentials: true }
      )

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSearchNote = async (query) => {
    setIsLoading(true)
    try {
      const res = await axios.get("http://localhost:3000/api/note/search", {
        params: { query },
        withCredentials: true,
      })

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      setIsSearch(true)
      setAllNotes(res.data.notes)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id

    try {
      const res = await axios.put(
        "http://localhost:3000/api/note/update-note-pinned/" + noteId,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      )

      if (res.data.success === false) {
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="text-indigo-500">My</span>
            <span className="text-purple-500"> Notes</span>
            {isSearch && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                (Search Results)
              </span>
            )}
          </h1>
          
          <button
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null })
            }}
          >
            <MdAdd className="text-xl" />
            <span>Add Note</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : allNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <EmptyCard
              imgSrc={
                isSearch
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtakcQoMFXwFwnlochk9fQSBkNYkO5rSyY9A&s"
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"
              }
              message={
                isSearch
                  ? "Oops! No Notes found matching your search"
                  : `Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders. Let's get started!`
              }
            />
          </div>
        )}
      </div>

      {/* Mobile Add Button */}
      <button
        className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg fixed right-6 bottom-6 transition-all duration-300 transform hover:scale-105 z-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <MdAdd className="text-2xl sm:text-3xl text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(2px)",
            zIndex: 50,
          },
          content: {
            border: "none",
            borderRadius: "0.75rem",
            padding: 0,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }
        }}
        className="w-[90%] max-w-2xl mx-auto mt-20 bg-white rounded-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2"></div>
        <div className="p-6">
          <AddEditNotes
            onClose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            noteData={openAddEditModal.data}
            type={openAddEditModal.type}
            getAllNotes={getAllNotes}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Home

import React, { useState } from "react"
import { MdClose } from "react-icons/md"
import TagInput from "../../components/Input/TagInput "
import axios from "axios"
import { toast } from "react-toastify"

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "")
  const [content, setContent] = useState(noteData?.content || "")
  const [tags, setTags] = useState(noteData?.tags || [])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  //   Edit Note
  const editNote = async () => {
    const noteId = noteData._id
    setIsLoading(true)

    try {
      const res = await axios.post(
        "http://localhost:3000/api/note/edit/" + noteId,
        { title, content, tags },
        { withCredentials: true }
      )

      if (res.data.success === false) {
        setError(res.data.message)
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
      onClose()
    } catch (error) {
      toast.error(error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  //   Add Note
  const addNewNote = async () => {
    setIsLoading(true)
    
    try {
      const res = await axios.post(
        "http://localhost:3000/api/note/add",
        { title, content, tags },
        { withCredentials: true }
      )

      if (res.data.success === false) {
        setError(res.data.message)
        toast.error(res.data.message)
        return
      }

      toast.success(res.data.message)
      getAllNotes()
      onClose()
    } catch (error) {
      toast.error(error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!content) {
      setError("Please enter the content")
      return
    }

    setError("")

    if (type === "edit") {
      editNote()
    } else {
      addNewNote()
    }
  }

  return (
    <div className="relative">
      <div className="absolute -top-3 -right-3 z-10">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
          onClick={onClose}
        >
          <MdClose className="text-xl text-gray-500" />
        </button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-indigo-500">{type === "edit" ? "Edit" : "Add"}</span>
          <span className="text-purple-500"> Note</span>
        </h2>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-indigo-600 uppercase tracking-wide">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 outline-none"
            placeholder="Wake up at 6 a.m."
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-indigo-600 uppercase tracking-wide">
            Content
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 outline-none min-h-[200px] resize-none"
            placeholder="Content..."
            rows={8}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-indigo-600 uppercase tracking-wide">
            Tags
          </label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm animate-fadeIn">
            {error}
          </div>
        )}

        <button
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleAddNote}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {type === "edit" ? "Updating..." : "Adding..."}
            </span>
          ) : (
            type === "edit" ? "UPDATE NOTE" : "ADD NOTE"
          )}
        </button>
      </div>
    </div>
  )
}

export default AddEditNotes

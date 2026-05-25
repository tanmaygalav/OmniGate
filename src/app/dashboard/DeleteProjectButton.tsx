'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteProject } from './[id]/actions'

export default function DeleteProjectButton({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProject(projectId)
      if (!result?.success) {
        // Fallback error handling if the server fails
        console.error(result?.error)
      }
      // If successful, the page automatically revalidates and this unmounts
    } catch (error) {
      console.error('An error occurred while deleting.')
    } finally {
      setIsDeleting(false)
      setShowModal(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        title="Delete Project"
      >
        <Trash2 size={18} />
      </button>

      {/* The Custom Modal Backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          
          {/* The Modal Content */}
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Project?</h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{projectName}"</span>? This action cannot be undone and will permanently break any API keys associated with it.
            </p>
            
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete project'}
              </button>
            </div>
          </div>
          
        </div>
      )}
    </>
  )
}
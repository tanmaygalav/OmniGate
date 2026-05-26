'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProject } from './[id]/actions' // Make sure you have this server action

export default function DeleteProjectButton({ projectId, projectName }: { projectId: string, projectName: string }) {
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDelete = async () => {
    // Custom confirmation toast
    toast.error(
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-gray-900">Delete {projectName}?</span>
        <span className="text-sm text-gray-600">
          This will permanently delete the project, all its API keys, and instantly break any routing.
        </span>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={() => {
              toast.dismiss()
              
              // 1. OPTIMISTIC UI UPDATE: Hide the project instantly!
              setIsDeleted(true) 
              
              // 2. Fire the server action in the background
              toast.promise(
                deleteProject(projectId),
                {
                  loading: 'Deleting project...',
                  success: 'Project deleted permanently.',
                  error: () => {
                    // If it fails, bring the project back onto the screen!
                    setIsDeleted(false)
                    return 'Failed to delete project.'
                  }
                }
              )
            }}
          >
            Delete Project
          </button>
        </div>
      </div>,
      { duration: Infinity, position: 'bottom-right' }
    )
  }

  // If optimistic state is true, completely remove this component (and its parent card if handled via CSS)
  if (isDeleted) return null

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
      title="Delete Project"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
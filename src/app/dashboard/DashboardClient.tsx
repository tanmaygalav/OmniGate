'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import DeleteProjectButton from './DeleteProjectButton'

export default function DashboardClient({ projects, createProjectAction }: { projects: any[], createProjectAction: (formData: FormData) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    toast.promise(
      createProjectAction(formData).then(() => {
        formRef.current?.reset()
      }),
      {
        loading: 'Creating project...',
        success: 'Project created successfully!',
        error: 'Failed to create project.'
      }
    )
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-5xl mx-auto p-4 sm:p-6 mt-4 sm:mt-8 space-y-8 sm:space-y-12"
    >
      {/* Create Project Section */}
      <section className="bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Gateway Project</h2>
        <form ref={formRef} action={handleSubmit} className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Project Name
            </label>
            <input
              name="name"
              placeholder="e.g., Production API"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="target_url">
              Target URL (Your Backend)
            </label>
            <input
              name="target_url"
              type="url"
              placeholder="https://api.your-startup.com"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2 h-[42px] w-full md:w-auto text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </form>
      </section>

      {/* Project List Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
        {projects?.length === 0 ? (
          <div className="text-center py-12 bg-white border rounded-xl border-dashed mx-2 sm:mx-0">
            <p className="text-gray-500">No projects found. Create one above to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {projects?.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-4 sm:p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold truncate pr-4">{project.name}</h3>
                  <DeleteProjectButton projectId={project.id} projectName={project.name} />
                </div>
                
                {/* URLs Container - Fixed for Mobile */}
                <div className="mt-auto space-y-2 w-full min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg border w-full overflow-hidden">
                    <span className="font-medium shrink-0">Target:</span>
                    <span className="truncate w-full min-w-0">{project.target_url}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-blue-700 bg-blue-50 p-2 sm:p-3 rounded-lg border border-blue-100 w-full overflow-hidden">
                    <span className="font-medium shrink-0">Proxy:</span>
                    <span className="break-all sm:truncate w-full min-w-0 font-mono text-xs sm:text-sm">
                      omnigatev1.vercel.app/v1/{project.id}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t flex justify-end">
                  <Link 
                    href={`/dashboard/${project.id}`} 
                    prefetch={true}
                    className="flex items-center gap-1 text-sm font-medium hover:text-gray-600 transition-colors"
                  >
                    Manage Keys <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.main>
  )
}
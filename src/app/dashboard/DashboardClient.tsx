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
    // Wrap the server action in a toast promise!
    toast.promise(
      createProjectAction(formData).then(() => {
        formRef.current?.reset() // Clear the form on success
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
      className="max-w-5xl mx-auto p-6 mt-8 space-y-12"
    >
      {/* Create Project Section */}
      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create New Gateway Project</h2>
        <form ref={formRef} action={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
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
            className="flex items-center justify-center gap-2 px-6 py-2 h-[42px] text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </form>
      </section>

      {/* Project List Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Active Projects</h2>
        {projects?.length === 0 ? (
          <div className="text-center py-12 bg-white border rounded-xl border-dashed">
            <p className="text-gray-500">No projects found. Create one above to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects?.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // Stagger the cards!
                className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <DeleteProjectButton projectId={project.id} projectName={project.name} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                    <span className="font-medium shrink-0">Target:</span>
                    <span className="truncate">{project.target_url}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-100">
                    <span className="font-medium shrink-0">Proxy:</span>
                    <span className="truncate font-mono">omnigatev1.vercel.app/v1/{project.id}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link 
                    href={`/dashboard/${project.id}`} 
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
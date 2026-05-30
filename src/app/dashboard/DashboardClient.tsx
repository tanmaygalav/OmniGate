'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Server, Plus, ArrowRight, Trash2, Link2, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
// Import your existing server actions here:
// import { createProject, deleteProject } from './actions' 

type Project = {
  id: string
  name: string
  target_url: string
  created_at: string
}

export default function DashboardClient({ initialProjects, userId }: { initialProjects: Project[], userId: string }) {
  const [projects, setProjects] = useState(initialProjects)
  const [isCreating, setIsCreating] = useState(false)

  // Replace this with your actual form action logic
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    // const formData = new FormData(e.currentTarget)
    // await createProject(formData)
    // ... update state or refresh ...
    setIsCreating(false)
  }

  // Replace this with your actual delete logic
  const handleDelete = async (id: string) => {
    // await deleteProject(id)
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-16">
      
      {/* Creation Panel - Frosted Glass */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-cards shadow-floating p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-glow opacity-[0.03] blur-[80px] pointer-events-none" />
        
        <h3 className="text-[18px] font-bold text-cloud-white mb-6 tracking-[0.14px]">Initialize New Gateway</h3>
        
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row items-end gap-4">
          <div className="w-full md:w-1/3 space-y-2">
            <label className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist">Project Name</label>
            <input 
              name="name"
              required
              placeholder="e.g., Production API" 
              className="w-full bg-deep-night border border-white/10 rounded-md px-4 py-2.5 text-[14px] text-cloud-white outline-none focus:border-amber-glow transition-all placeholder:text-ash-gray/50"
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-2">
            <label className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist">Target URL (Your Backend)</label>
            <input 
              name="target_url"
              required
              type="url"
              placeholder="https://api.your-startup.com" 
              className="w-full bg-deep-night border border-white/10 rounded-md px-4 py-2.5 text-[14px] font-mono text-cloud-white outline-none focus:border-amber-glow transition-all placeholder:text-ash-gray/50"
            />
          </div>

          <button 
            type="submit"
            disabled={isCreating}
            className="w-full md:w-auto px-6 py-2.5 text-[14px] font-semibold text-cloud-white bg-transparent border border-amber-glow rounded-buttons hover:bg-amber-glow/10 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(242,185,139,0.15)] hover:shadow-[0_0_25px_rgba(242,185,139,0.25)] shrink-0"
          >
            {isCreating ? 'Deploying...' : <><Plus className="w-4 h-4 text-amber-glow" /> Create Node</>}
          </button>
        </form>
      </motion.div>

      {/* Active Projects Grid */}
      <div>
        <h3 className="text-[14px] font-semibold text-silver-whisper mb-6 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-glow" /> Active Infrastructure
        </h3>
        
        {projects.length === 0 ? (
          <div className="p-12 text-center border border-white/5 border-dashed rounded-cards bg-deep-night/50">
            <p className="text-[14px] text-warm-mist">No gateway nodes deployed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-graphite border border-white/5 rounded-cards shadow-floating flex flex-col overflow-hidden hover:border-white/10 transition-colors"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-white/5 flex items-start justify-between bg-deep-night/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Server className="w-4 h-4 text-silver-whisper" />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-cloud-white">{project.name}</h4>
                      <span className="text-[10px] uppercase tracking-[1px] text-warm-mist">Active Node</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-ash-gray hover:text-red-400 hover:bg-red-900/20 rounded-buttons opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] uppercase tracking-[1px] font-semibold text-warm-mist block mb-1.5 flex items-center gap-1.5">
                      <Link2 className="w-3 h-3" /> Target Route
                    </span>
                    <div className="text-[13px] font-mono text-silver-whisper truncate bg-deep-night px-3 py-2 rounded-md border border-white/5">
                      {project.target_url}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] uppercase tracking-[1px] font-semibold text-amber-glow block mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3" /> Edge Proxy
                    </span>
                    <div className="text-[13px] font-mono text-cloud-white truncate bg-amber-glow/5 px-3 py-2 rounded-md border border-amber-glow/20 selection:bg-amber-glow/30">
                      omnigate.vercel.app/v1/{project.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-2 bg-deep-night/50 border-t border-white/5">
                  <Link 
                    href={`/dashboard/${project.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold text-silver-whisper hover:text-cloud-white rounded-buttons hover:bg-white/5 transition-colors"
                  >
                    Configure Edge <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
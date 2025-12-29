'use client'

import { useEffect, useState } from 'react'

interface PortfolioData {
  name: string
  title: string
  about: string
  image: string
  skills: string[]
  projects: { title: string; description: string; link: string; image: string }[]
  contact: { email: string; phone: string; linkedin: string; github: string }
}

export default function Admin() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [projectEditIdx, setProjectEditIdx] = useState<number | null>(null)
  const [projectDraft, setProjectDraft] = useState<any>({ title: '', description: '', link: '', image: '' })

  useEffect(() => {
    fetch('/api/portfolio')
      .then(async res => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to fetch data')
        }
        return res.json()
      })
      .then(setData)
      .catch(e => {
        alert('Error loading data: ' + e.message)
      })
  }, [])

  const handleSave = async () => {
    if (!data) return
    setLoading(true)
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      setLoading(false)
      if (res.ok) alert('Saved successfully')
      else {
        const err = await res.json()
        alert('Error saving: ' + (err.error || 'Unknown error'))
      }
    } catch (e: any) {
      setLoading(false)
      alert('Error saving: ' + e.message)
    }
  }

  // Simple password check (replace with secure auth in production)
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            onClick={() => {
              if (password === '@geif247') setAuthenticated(true)
              else alert('Incorrect password')
            }}
          >Login</button>
        </div>
      </div>
    )
  }

  if (!data) return <div>Loading...</div>

  // Project editing helpers
  const handleProjectChange = (idx: number, field: string, value: string) => {
    if (!data) return
    const updated = data.projects.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    setData({ ...data, projects: updated })
  }
  const handleProjectRemove = (idx: number) => {
    if (!data) return
    const updated = data.projects.filter((_, i) => i !== idx)
    setData({ ...data, projects: updated })
  }
  const handleProjectAdd = () => {
    if (!data) return
    setData({ ...data, projects: [...data.projects, { ...projectDraft }] })
    setProjectDraft({ title: '', description: '', link: '', image: '' })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Panel</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
            {/* Personal Info Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-600">Profile Image URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={data.image}
                  onChange={e => setData({ ...data, image: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-600">About</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-vertical"
                  value={data.about}
                  onChange={e => setData({ ...data, about: e.target.value })}
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Skills</h2>
              <label className="block text-sm font-medium mb-2 text-gray-600">Skills (comma separated)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.skills.join(', ')}
                onChange={e => setData({ ...data, skills: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="e.g., JavaScript, React, Node.js"
              />
            </div>

            {/* Projects Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Projects</h2>
              <div className="space-y-6">
                {data.projects.map((project, idx) => (
                  <div key={idx} className="border rounded-lg p-4 mb-2 bg-white shadow-sm relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      onClick={() => handleProjectRemove(idx)}
                    >Remove</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Title</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={project.title}
                          onChange={e => handleProjectChange(idx, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Project Link</label>
                        <input
                          type="url"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={project.link}
                          onChange={e => handleProjectChange(idx, 'link', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1">Image URL</label>
                      <input
                        type="url"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={project.image}
                        onChange={e => handleProjectChange(idx, 'image', e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        value={project.description}
                        onChange={e => handleProjectChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                {/* Add new project */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">Add New Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={projectDraft.title}
                        onChange={e => setProjectDraft({ ...projectDraft, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Project Link</label>
                      <input
                        type="url"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={projectDraft.link}
                        onChange={e => setProjectDraft({ ...projectDraft, link: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-medium mb-1">Image URL</label>
                    <input
                      type="url"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={projectDraft.image}
                      onChange={e => setProjectDraft({ ...projectDraft, image: e.target.value })}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded"
                      value={projectDraft.description}
                      onChange={e => setProjectDraft({ ...projectDraft, description: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleProjectAdd}
                  >Add Project</button>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.contact.email}
                    onChange={e => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.contact.phone}
                    onChange={e => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">LinkedIn URL</label>
                  <input
                    type="url"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.contact.linkedin}
                    onChange={e => setData({ ...data, contact: { ...data.contact, linkedin: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-600">GitHub URL</label>
                  <input
                    type="url"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={data.contact.github}
                    onChange={e => setData({ ...data, contact: { ...data.contact, github: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <a href="/" className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                Back to Portfolio
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
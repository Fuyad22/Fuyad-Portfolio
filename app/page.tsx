'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface BlogPost {
  title: string;
  date: string;
  summary: string;
  link: string;
}

interface PortfolioData {
  name: string;
  title: string;
  about: string;
  image: string;
  skills: string[];
  projects: { title: string; description: string; link: string; image: string }[];
  contact: { email: string; phone: string; linkedin: string; github: string };
  blog?: BlogPost[];
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="hero-bg text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <Image src={data.image} alt={data.name} width={128} height={128} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-xl" />
            <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg tracking-tight">{data.name}</h1>
            <p className="text-2xl font-medium drop-shadow">{data.title}</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-bg section-padding">
        <div className="container mx-auto px-4">
          <div className="section-panel animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">About Me</h2>
            <p className="text-lg text-center font-medium text-gray-700">{data.about}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-alt-bg section-padding">
        <div className="container mx-auto px-4">
          <div className="section-panel animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">Skills</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {data.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 hover:bg-blue-200 hover:scale-110 cursor-default shadow-sm border border-blue-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section-bg section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 animate-fade-in-up">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project, index) => (
              <div key={index} className="card animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <Image src={project.image} alt={project.title} width={400} height={192} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <a href={project.link} className="btn inline-block">View Project</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {data.blog && data.blog.length > 0 && (
        <section className="section-bg section-padding">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
              <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Blog</h2>
              <div className="space-y-6">
                {data.blog.map((post, idx) => (
                  <a href={post.link} key={idx} className="block card hover:bg-indigo-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-indigo-700 mb-1">{post.title}</h3>
                        <p className="text-gray-600 mb-2">{post.summary}</p>
                      </div>
                      <span className="text-sm text-gray-400 md:ml-4">{post.date}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="section-alt-bg section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 animate-fade-in-up">Contact</h2>
          <div className="text-center animate-fade-in-up animation-delay-200">
            <p className="mb-2 text-gray-700">Email: <a href={`mailto:${data.contact.email}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">{data.contact.email}</a></p>
            <p className="mb-2 text-gray-700">Phone: {data.contact.phone}</p>
            <p className="mb-2 text-gray-700">LinkedIn: <a href={data.contact.linkedin} className="text-indigo-600 hover:text-indigo-800 transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            <p className="text-gray-700">GitHub: <a href={data.contact.github} className="text-indigo-600 hover:text-indigo-800 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></p>
          </div>
        </div>
      </section>
    </div>
  )
}
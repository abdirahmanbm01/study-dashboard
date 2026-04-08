import { useState } from 'react'

export default function Header({
  view,
  setView,
  activeFilter,
  setActiveFilter,
  courses,
  onAddTask,
}) {
  const courseIds = Object.keys(courses).sort()

  return (
    <header className="sticky top-0 z-40 bg-[#151824] border-b border-[#2a2f3f] px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Adi's Dashboard</h1>
          <p className="text-sm text-[#a8b2d1]">Spring 2026</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('week')} className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === 'week' ? 'bg-[#e2e8f0] text-[#0d0f18]' : 'bg-[#2a2f3f] text-[#e2e8f0] hover:bg-[#3a3f4f]'}`}>Week</button>
          <button onClick={() => setView('tasks')} className={`px-4 py-2 rounded text-sm font-medium transition-colors ${view === 'tasks' ? 'bg-[#e2e8f0] text-[#0d0f18]' : 'bg-[#2a2f3f] text-[#e2e8f0] hover:bg-[#3a3f4f]'}`}>Tasks</button>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={() => setActiveFilter('all')} className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-[#e2e8f0] text-[#0d0f18]' : 'bg-[#2a2f3f] text-[#e2e8f0] hover:bg-[#3a3f4f]'}`}>All</button>
          {courseIds.map(courseId => {
            const course = courses[courseId]
            const color = course.color
            const isActive = activeFilter === courseId
            return (
              <button key={courseId} onClick={() => setActiveFilter(courseId)} className={`px-3 py-2 rounded text-sm font-medium transition-colors text-white ${isActive ? 'opacity-100 border-2' : 'opacity-60 hover:opacity-80'}`} style={isActive ? { background: color, borderColor: 'rgba(255,255,255,0.3)' } : { color: color }}>{course.label}</button>
            )
          })}
          <button onClick={() => setActiveFilter('Personal')} className={`px-3 py-2 rounded text-sm font-medium transition-colors ${activeFilter === 'Personal' ? 'bg-[#8b7bff] text-white' : 'bg-[#2a2f3f] text-[#e2e8f0] hover:bg-[#3a3f4f]'}`}>Personal</button>
        </div>
        <div className="flex-shrink-0">
          <button onClick={onAddTask} className="px-4 py-2 bg-[#e2e8f0] text-[#0d0f18] rounded font-medium hover:bg-white transition-colors">+ Add task</button>
        </div>
      </div>
    </header>
  )
}

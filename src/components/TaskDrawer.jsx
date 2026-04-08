import { useState } from 'react'

export default function TaskDrawer({ task, data, doneMap, toggleDone, notesMap, setNote, closeDrawer, deleteCustomTask }) {
  const isDone = doneMap[task.id]
  const notes = notesMap[task.id] || ''
  const [editingNotes, setEditingNotes] = useState(notes)
  const courseColor = data.courses[task.course]?.color || '#8b7bff'
  const course = data.courses[task.course]
  const today = new Date(); today.setHours(0,0,0,0)
  const todayStr = today.toISOString().split('T')[0]

  const getDueBadge = () => {
    if (isDone) return 'Completed'
    if (task.dueDate < todayStr) return 'Overdue'
    if (task.dueDate === todayStr) return 'Due today'
    const daysUntil = Math.ceil((new Date(task.dueDate) - new Date(todayStr)) / (1000*60*60*24))
    return 'Due in ' + daysUntil + 'd'
  }

  const buildLinks = () => {
    const links = []; const seenUrls = new Set()
    if (task.url && !seenUrls.has(task.url)) {
      seenUrls.add(task.url)
      const source = task.source ? task.source.charAt(0).toUpperCase() + task.source.slice(1) : 'Open link'
      links.push({ label: 'Open on ' + source, url: task.url })
    }
    if (course) {
      if (course.home && !seenUrls.has(course.home)) { seenUrls.add(course.home); links.push({ label: 'Course Home', url: course.home }) }
      if (course.canvas && !seenUrls.has(course.canvas)) { seenUrls.add(course.canvas); links.push({ label: 'Canvas', url: course.canvas }) }
      if (course.gradescope && !seenUrls.has(course.gradescope)) { seenUrls.add(course.gradescope); links.push({ label: 'Gradescope', url: course.gradescope }) }
      if (course.edstem && !seenUrls.has(course.edstem)) { seenUrls.add(course.edstem); links.push({ label: 'EdStem', url: course.edstem }) }
    }
    return links
  }

  const links = buildLinks()
  const isCustomTask = task.source === 'manual'

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeDrawer}></div>
      <div className="fixed right-0 top-0 h-full w-96 bg-[#151824] border-l border-[#2a2f3f] shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between border-b border-[#2a2f3f] p-6">
          <h2 className="text-lg font-bold text-[#e2e8f0] flex-grow pr-4 break-words">{task.name}</h2>
          <button onClick={closeDrawer} className="text-[#a8b2d1] hover:text-[#e2e8f0] text-2xl flex-shrink-0 leading-none">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3"><span className="px-3 py-1 text-sm font-medium text-white rounded" style={{ background: courseColor }}>{course?.label || task.course}</span></div>
            <div className="space-y-2"><p className="text-xs font-semibold text-[#a8b2d1] uppercase tracking-wider">Status</p><p className="text-sm text-[#e2e8f0]">{getDueBadge()}</p></div>
            <div className="space-y-2"><p className="text-xs font-semibold text-[#a8b2d1] uppercase tracking-wider">Due Date</p><p className="text-sm text-[#e2e8f0]">{new Date(task.dueDate).toLocaleDateString()}{task.dueTime && ' at ' + task.dueTime}</p></div>
            {task.source && task.source !== 'manual' && <div className="space-y-2"><p className="text-xs font-semibold text-[#a8b2d1] uppercase tracking-wider">Source</p><p className="text-sm text-[#e2e8f0]">{task.source}</p></div>}
          </div>
          {links.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#a8b2d1] uppercase tracking-wider">Links</p>
              <div className="space-y-2 flex flex-col">
                {links.map((link, idx) => <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 underline break-all">{link.label}</a>)}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#a8b2d1] uppercase tracking-wider">Notes</p>
            <textarea value={editingNotes} onChange={(e) => { setEditingNotes(e.target.value); setNote(task.id, e.target.value) }} placeholder="Add notes..." className="w-full h-24 bg-[#0d0f18] border border-[#2a2f3f] rounded p-3 text-sm text-[#e2e8f0] placeholder-[#6b7280] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
        </div>
        <div className="border-t border-[#2a2f3f] p-6 space-y-3">
          <button onClick={() => toggleDone(task.id)} className="w-full px-4 py-2 rounded font-medium transition-colors text-sm" style={{ background: isDone ? '#6b7280' : courseColor, color: 'white' }}>{isDone ? 'Mark incomplete' : 'Mark complete'}</button>
          {isCustomTask && <button onClick={() => { deleteCustomTask(task.id); closeDrawer() }} className="w-full px-4 py-2 bg-red-600/20 text-red-400 rounded font-medium hover:bg-red-600/30 transition-colors text-sm">Delete</button>}
          <button onClick={closeDrawer} className="w-full px-4 py-2 bg-[#2a2f3f] text-[#e2e8f0] rounded font-medium hover:bg-[#3a3f4f] transition-colors text-sm">Close</button>
        </div>
      </div>
    </>
  )
}

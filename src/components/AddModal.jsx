import { useState } from 'react'

export default function AddModal({ courses, onAdd, onClose, selectedDate }) {
  const today = new Date()
  const defaultDate = selectedDate || today.toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [dueDate, setDueDate] = useState(defaultDate)
  const [dueTime, setDueTime] = useState('23:59')
  const [category, setCategory] = useState('Personal')
  const [url, setUrl] = useState('')
  const [notes, setNotes] = useState('')
  const courseIds = Object.keys(courses).sort()
  const categories = ['Personal', ...courseIds]

  const handleSave = () => {
    if (!name.trim()) return
    onAdd({
      id: 'c' + Date.now(),
      course: category,
      name: name.trim(),
      dueDate, dueTime,
      completed: false,
      source: 'manual',
      url: url.trim() || null,
      notes: notes.trim() || null,
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()} className="bg-[#151824] border border-[#2a2f3f] rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-lg font-bold text-[#e2e8f0] mb-6">Add Task</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">Task name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Finish project report" className="w-full px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] placeholder-[#6b7280] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">Due time</label>
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] focus:outline-none focus:border-[#3a3f4f]">
              {categories.map((cat) => <option key={cat} value={cat}>{courses[cat]?.label || cat}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">URL (optional)</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] placeholder-[#6b7280] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#a8b2d1] mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes..." className="w-full h-20 px-3 py-2 bg-[#0d0f18] border border-[#2a2f3f] rounded text-[#e2e8f0] placeholder-[#6b7280] focus:outline-none focus:border-[#3a3f4f]" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#2a2f3f] text-[#e2e8f0] rounded font-medium hover:bg-[#3a3f4f] transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 px-4 py-2 bg-[#e2e8f0] text-[#0d0f18] rounded font-medium hover:bg-white transition-colors">Save</button>
          </div>
        </div>
      </div>
    </>
  )
}

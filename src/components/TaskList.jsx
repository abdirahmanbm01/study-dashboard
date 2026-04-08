import { useMemo } from 'react'

export default function TaskList({ data, activeFilter, selectedDate, doneMap, toggleDone, openDrawer, customTasks }) {
  const allTasks = useMemo(() => {
    const tasks = [...(data.assignments || []), ...(data.gcalEvents || []), ...customTasks]
    let filtered = tasks
    if (activeFilter !== 'all') filtered = filtered.filter(t => activeFilter === 'Personal' ? t.course === 'Personal' : t.course === activeFilter)
    if (selectedDate) filtered = filtered.filter(t => t.dueDate === selectedDate)
    filtered.sort((a, b) => {
      if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59')
    })
    return filtered
  }, [data, customTasks, activeFilter, selectedDate])

  const today = new Date(); today.setHours(0,0,0,0)
  const todayStr = today.toISOString().split('T')[0]
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndStr = weekEnd.toISOString().split('T')[0]

  const grouped = useMemo(() => {
    const g = { OVERDUE: [], 'DUE TODAY': [], 'THIS WEEK': [], UPCOMING: [], COMPLETED: [] }
    allTasks.forEach(task => {
      if (doneMap[task.id]) g.COMPLETED.push(task)
      else if (task.dueDate < todayStr) g.OVERDUE.push(task)
      else if (task.dueDate === todayStr) g['DUE TODAY'].push(task)
      else if (task.dueDate <= weekEndStr) g['THIS WEEK'].push(task)
      else g.UPCOMING.push(task)
    })
    return g
  }, [allTasks, doneMap, todayStr, weekEndStr])

  const getSectionColor = (s) => {
    if (s === 'OVERDUE') return 'text-red-400'
    if (s === 'DUE TODAY') return 'text-amber-400'
    if (s === 'THIS WEEK') return 'text-amber-300'
    if (s === 'COMPLETED') return 'text-[#6b7280]'
    return 'text-[#a8b2d1]'
  }

  const getDueBadge = (task) => {
    if (doneMap[task.id]) return null
    if (task.dueDate < todayStr) return <span className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded">Overdue</span>
    if (task.dueDate === todayStr) return <span className="px-2 py-1 text-xs font-semibold bg-amber-600 text-white rounded">Due today</span>
    const daysUntil = Math.ceil((new Date(task.dueDate) - new Date(todayStr)) / (1000*60*60*24))
    return <span className="px-2 py-1 text-xs font-semibold bg-amber-600 text-white rounded">Due in {daysUntil}d</span>
  }

  return (
    <div className="mt-6 space-y-6">
      {Object.entries(grouped).map(([section, tasks]) => {
        if (tasks.length === 0) return null
        return (
          <div key={section}>
            <h3 className={"text-sm font-bold mb-3 " + getSectionColor(section)}>{section}</h3>
            <div className="space-y-2">
              {tasks.map(task => {
                const isDone = doneMap[task.id]
                const courseColor = data.courses[task.course]?.color || '#8b7bff'
                return (
                  <div key={task.id} className="bg-[#151824] border border-[#2a2f3f] rounded p-4 flex items-center gap-4 hover:border-[#3a3f4f] transition-colors">
                    <input type="checkbox" checked={isDone} onChange={() => toggleDone(task.id)} className="w-5 h-5 rounded cursor-pointer accent-blue-500" />
                    <div className="flex-grow min-w-0">
                      <p className={"text-sm font-medium " + (isDone ? 'text-[#6b7280] line-through' : 'text-[#e2e8f0]')}>{task.name}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="px-2 py-1 text-xs font-medium text-white rounded" style={{ background: courseColor, opacity: isDone ? 0.5 : 1 }}>{data.courses[task.course]?.label || task.course}</span>
                        {getDueBadge(task)}
                        <span className={"text-xs " + (isDone ? 'text-[#6b7280]' : 'text-[#a8b2d1]')}>{new Date(task.dueDate).toLocaleDateString()}{task.dueTime && ' at ' + task.dueTime}</span>
                        {task.source && task.source !== 'manual' && <span className={"text-xs " + (isDone ? 'text-[#6b7280]' : 'text-[#a8b2d1]')}>from {task.source}</span>}
                      </div>
                    </div>
                    <button onClick={() => openDrawer(task)} className="text-[#a8b2d1] hover:text-[#e2e8f0] transition-colors flex-shrink-0">&rsaquo;</button>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

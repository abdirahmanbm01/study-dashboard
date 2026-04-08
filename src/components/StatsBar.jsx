import { useMemo } from 'react'

export default function StatsBar({ data, doneMap, customTasks, selectedDate, activeFilter }) {
  const stats = useMemo(() => {
    const allTasks = [...(data.assignments || []), ...(data.gcalEvents || []), ...customTasks]
    let filtered = allTasks
    if (activeFilter !== 'all') {
      filtered = filtered.filter(t => activeFilter === 'Personal' ? t.course === 'Personal' : t.course === activeFilter)
    }
    if (selectedDate) filtered = filtered.filter(t => t.dueDate === selectedDate)

    const today = new Date(); today.setHours(0,0,0,0)
    const todayStr = today.toISOString().split('T')[0]
    const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 6)
    const weekEndStr = weekEnd.toISOString().split('T')[0]

    return {
      overdue: filtered.filter(t => !doneMap[t.id] && t.dueDate < todayStr).length,
      dueThisWeek: filtered.filter(t => !doneMap[t.id] && t.dueDate >= todayStr && t.dueDate <= weekEndStr).length,
      total: filtered.length,
      completed: filtered.filter(t => doneMap[t.id]).length,
    }
  }, [data, doneMap, customTasks, selectedDate, activeFilter])

  return (
    <div className="bg-[#151824] border-b border-[#2a2f3f] px-6 py-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500"></div><div><p className="text-sm text-[#a8b2d1]">Overdue</p><p className="text-lg font-semibold text-red-400">{stats.overdue}</p></div></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-amber-500"></div><div><p className="text-sm text-[#a8b2d1]">Due this week</p><p className="text-lg font-semibold text-amber-400">{stats.dueThisWeek}</p></div></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><div><p className="text-sm text-[#a8b2d1]">Total</p><p className="text-lg font-semibold text-blue-400">{stats.total}</p></div></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500"></div><div><p className="text-sm text-[#a8b2d1]">Completed</p><p className="text-lg font-semibold text-green-400">{stats.completed}</p></div></div>
      </div>
    </div>
  )
}

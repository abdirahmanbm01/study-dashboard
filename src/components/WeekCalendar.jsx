import { useMemo, useState } from 'react'

const HOUR_HEIGHT = 60
const START_HOUR = 8
const END_HOUR = 18

export default function WeekCalendar({ data, activeFilter, selectedDate, setSelectedDate, doneMap }) {
  const today = new Date()
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const d = new Date(today); d.setDate(d.getDate() - d.getDay()); return d
  })

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) { const d = new Date(weekStartDate); d.setDate(d.getDate() + i); days.push(d) }
    return days
  }, [weekStartDate])

  const classBlocks = useMemo(() => {
    const blocks = []
    ;(data.classSchedule || []).forEach(cls => {
      cls.days.forEach(dayOfWeek => {
        const dayIndex = dayOfWeek - 1
        if (dayIndex >= 0 && dayIndex < 7) {
          const [startH, startM] = cls.startTime.split(':').map(Number)
          const [endH, endM] = cls.endTime.split(':').map(Number)
          const topPx = ((startH - START_HOUR) * 60 + startM) * (HOUR_HEIGHT / 60)
          const durationMin = (endH - startH) * 60 + (endM - startM)
          const heightPx = durationMin * (HOUR_HEIGHT / 60)
          blocks.push({ id: cls.id, dayIndex, course: cls.course, name: cls.name, location: cls.location, top: topPx, height: heightPx })
        }
      })
    })
    return blocks
  }, [data])

  const assignmentsByDay = useMemo(() => {
    const map = {}
    weekDays.forEach(d => { map[d.toISOString().split('T')[0]] = [] })
    ;[...(data.assignments || []), ...(data.gcalEvents || [])].forEach(a => { if (map[a.dueDate]) map[a.dueDate].push(a) })
    return map
  }, [data, weekDays])

  const examsByDay = useMemo(() => {
    const map = {}
    weekDays.forEach(d => { map[d.toISOString().split('T')[0]] = false })
    ;[...(data.assignments || []), ...(data.gcalEvents || [])].forEach(a => { if (a.isExam && map[a.dueDate] !== undefined) map[a.dueDate] = true })
    return map
  }, [data, weekDays])

  const navPrev = () => { const d = new Date(weekStartDate); d.setDate(d.getDate() - 7); setWeekStartDate(d) }
  const navNext = () => { const d = new Date(weekStartDate); d.setDate(d.getDate() + 7); setWeekStartDate(d) }
  const navToday = () => { const d = new Date(today); d.setDate(d.getDate() - d.getDay()); setWeekStartDate(d) }

  const weekRangeStr = weekDays[0].toLocaleDateString() + ' - ' + weekDays[6].toLocaleDateString()
  const todayStr = today.toISOString().split('T')[0]

  return (
    <div className="bg-[#151824] border-b border-[#2a2f3f] px-6 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={navPrev} className="px-3 py-2 bg-[#2a2f3f] text-[#e2e8f0] rounded hover:bg-[#3a3f4f] transition-colors">&lt;</button>
        <button onClick={navToday} className="px-4 py-2 bg-[#2a2f3f] text-[#e2e8f0] rounded hover:bg-[#3a3f4f] transition-colors font-medium">Today</button>
        <span className="text-[#e2e8f0] font-medium flex-grow">{weekRangeStr}</span>
        <button onClick={navNext} className="px-3 py-2 bg-[#2a2f3f] text-[#e2e8f0] rounded hover:bg-[#3a3f4f] transition-colors">&gt;</button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex min-w-min">
          <div className="flex flex-col pr-4 pt-12">
            {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
              <div key={i} style={{ height: HOUR_HEIGHT + 'px' }} className="text-xs text-[#a8b2d1] text-right">
                {String(START_HOUR + i).padStart(2, '0')}:00
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {weekDays.map((dayDate, dayIndex) => {
              const dateStr = dayDate.toISOString().split('T')[0]
              const dayOfWeek = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][dayIndex]
              const isToday = dateStr === todayStr
              const isSelected = selectedDate === dateStr
              return (
                <div key={dayIndex} className={"flex flex-col border transition-colors rounded " + (isToday ? 'border-blue-500' : 'border-[#2a2f3f]')} style={{ width: '140px' }}>
                  <div onClick={() => setSelectedDate(isSelected ? null : dateStr)} className={"p-3 border-b border-[#2a2f3f] cursor-pointer transition-colors " + (isSelected ? 'bg-[#2a5f7f]' : 'hover:bg-[#1f2430]')}>
                    <p className="text-sm font-semibold text-[#e2e8f0]">{dayOfWeek}</p>
                    <p className="text-xs text-[#a8b2d1]">{dayDate.getDate()}</p>
                    {examsByDay[dateStr] && <div className="mt-1 text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">EXAM</div>}
                    {assignmentsByDay[dateStr] && assignmentsByDay[dateStr].length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {assignmentsByDay[dateStr].filter(a => activeFilter === 'all' || (activeFilter === 'Personal' ? a.course === 'Personal' : a.course === activeFilter)).slice(0, 3).map((a, idx) => (
                          <div key={idx} className="w-2 h-2 rounded-full" style={{ background: data.courses[a.course]?.color || '#8b7bff' }}></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => (
                      <div key={i} style={{ height: HOUR_HEIGHT + 'px' }} className="border-t border-[#2a2f3f]"></div>
                    ))}
                    {classBlocks.filter(b => b.dayIndex === dayIndex).map(block => (
                      <div key={block.id} className="absolute left-1 right-1 rounded p-2 text-xs text-white overflow-hidden" style={{ top: (block.top + 48) + 'px', height: block.height + 'px', background: data.courses[block.course]?.color || '#8b7bff', opacity: 0.85 }}>
                        <p className="font-semibold line-clamp-2">{block.name}</p>
                        {block.location && <p className="text-xs opacity-80 line-clamp-1">{block.location}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

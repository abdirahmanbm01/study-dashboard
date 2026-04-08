import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import StatsBar from './components/StatsBar.jsx'
import WeekCalendar from './components/WeekCalendar.jsx'
import TaskList from './components/TaskList.jsx'
import TaskDrawer from './components/TaskDrawer.jsx'
import AddModal from './components/AddModal.jsx'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('week')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)
  const [drawerTask, setDrawerTask] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customTasks, setCustomTasks] = useState([])
  const [doneMap, setDoneMap] = useState({})
  const [notesMap, setNotesMap] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(import.meta.env.BASE_URL + 'data.json')
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to load data.json:', err)
      }
      try {
        const stored = localStorage.getItem('dashboard_custom_tasks_v2')
        if (stored) setCustomTasks(JSON.parse(stored))
      } catch (err) { console.error(err) }
      try {
        const stored = localStorage.getItem('dashboard_done_v2')
        if (stored) setDoneMap(JSON.parse(stored))
      } catch (err) { console.error(err) }
      try {
        const stored = localStorage.getItem('dashboard_notes_v2')
        if (stored) setNotesMap(JSON.parse(stored))
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    loadData()
  }, [])

  const toggleDone = (taskId) => {
    const newMap = { ...doneMap }
    newMap[taskId] = !newMap[taskId]
    setDoneMap(newMap)
    try { localStorage.setItem('dashboard_done_v2', JSON.stringify(newMap)) } catch (err) { console.error(err) }
  }

  const setNote = (taskId, note) => {
    const newMap = { ...notesMap }
    if (note) newMap[taskId] = note
    else delete newMap[taskId]
    setNotesMap(newMap)
    try { localStorage.setItem('dashboard_notes_v2', JSON.stringify(newMap)) } catch (err) { console.error(err) }
  }

  const handleAddTask = (newTask) => {
    const updated = [...customTasks, newTask]
    setCustomTasks(updated)
    try { localStorage.setItem('dashboard_custom_tasks_v2', JSON.stringify(updated)) } catch (err) { console.error(err) }
    setShowAddModal(false)
  }

  const deleteCustomTask = (taskId) => {
    const updated = customTasks.filter(t => t.id !== taskId)
    setCustomTasks(updated)
    try { localStorage.setItem('dashboard_custom_tasks_v2', JSON.stringify(updated)) } catch (err) { console.error(err) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0f18]">
        <div className="text-[#e2e8f0]">Loading...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0f18]">
        <div className="text-[#e2e8f0]">Failed to load data</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0f18] text-[#e2e8f0]">
      <Header
        view={view}
        setView={setView}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        courses={data.courses}
        onAddTask={() => setShowAddModal(true)}
      />
      <StatsBar data={data} doneMap={doneMap} customTasks={customTasks} selectedDate={selectedDate} activeFilter={activeFilter} />
      {view === 'week' && (
        <WeekCalendar
          data={data}
          activeFilter={activeFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          doneMap={doneMap}
        />
      )}
      <div className="px-6 pb-6">
        <TaskList
          data={data}
          activeFilter={activeFilter}
          selectedDate={selectedDate}
          doneMap={doneMap}
          toggleDone={toggleDone}
          openDrawer={setDrawerTask}
          customTasks={customTasks}
        />
      </div>
      {drawerTask && (
        <TaskDrawer
          task={drawerTask}
          data={data}
          doneMap={doneMap}
          toggleDone={toggleDone}
          notesMap={notesMap}
          setNote={setNote}
          closeDrawer={() => setDrawerTask(null)}
          deleteCustomTask={deleteCustomTask}
        />
      )}
      {showAddModal && (
        <AddModal
          courses={data.courses}
          onAdd={handleAddTask}
          onClose={() => setShowAddModal(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}

export default App

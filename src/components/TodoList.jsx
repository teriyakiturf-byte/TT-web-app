import { useState } from 'react'
import { CheckSquare, Square, Plus, Trash2, ClipboardList } from 'lucide-react'
import { calendarData, getZoneGroup, MONTH_NAMES, CATEGORY_COLORS } from '../utils/calendarData.js'

const SEASONAL_SEED_LABELS = {
  0: 'January', 1: 'February', 2: 'March', 3: 'April',
  4: 'May', 5: 'June', 6: 'July', 7: 'August',
  8: 'September', 9: 'October', 10: 'November', 11: 'December',
}

export default function TodoList({ todos, onTodosChange, zone }) {
  const [newTask, setNewTask] = useState('')

  const monthIndex = new Date().getMonth()
  const zoneGroup = getZoneGroup(zone) || 'transition'
  const calendarTasks = calendarData[zoneGroup][monthIndex] ?? []

  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    onTodosChange([...todos, { id: Date.now(), text: trimmed, done: false, createdAt: new Date().toISOString() }])
  }

  function handleAdd(e) {
    e.preventDefault()
    addTask(newTask)
    setNewTask('')
  }

  function toggleDone(id) {
    onTodosChange(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    onTodosChange(todos.filter(t => t.id !== id))
  }

  function clearCompleted() {
    onTodosChange(todos.filter(t => !t.done))
  }

  function addFromCalendar(title) {
    if (!todos.some(t => t.text === title)) {
      addTask(title)
    }
  }

  const pending = todos.filter(t => !t.done)
  const done = todos.filter(t => t.done)

  return (
    <div className="card">
      <h2 className="section-title">
        <ClipboardList className="w-5 h-5 text-lawn-600" />
        Task Manager
        {pending.length > 0 && (
          <span className="ml-auto bg-lawn-100 text-lawn-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {pending.length} pending
          </span>
        )}
      </h2>

      {/* Add task form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a lawn care task…"
          className="input flex-1"
        />
        <button type="submit" className="btn-primary flex items-center gap-1.5" disabled={!newTask.trim()}>
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Seasonal suggestions from calendar */}
      {calendarTasks.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            📅 Suggested for {MONTH_NAMES[monthIndex]}
          </p>
          <div className="space-y-1.5">
            {calendarTasks.map((task, i) => {
              const colors = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.cleanup
              const alreadyAdded = todos.some(t => t.text === task.title)
              return (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                  <span className={`text-xs font-semibold ${colors.text} flex-1`}>{task.title}</span>
                  <button
                    onClick={() => addFromCalendar(task.title)}
                    disabled={alreadyAdded}
                    className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors
                      ${alreadyAdded ? 'text-stone-300 cursor-default' : `${colors.text} hover:opacity-70`}`}
                  >
                    {alreadyAdded ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pending tasks */}
      {pending.length === 0 && done.length === 0 && (
        <div className="text-center py-8 text-stone-300">
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks yet. Add one above or import from the calendar suggestions.</p>
        </div>
      )}

      <div className="space-y-2">
        {pending.map(task => (
          <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 group">
            <button onClick={() => toggleDone(task.id)} className="text-stone-300 hover:text-lawn-600 transition-colors flex-shrink-0">
              <Square className="w-5 h-5" />
            </button>
            <span className="flex-1 text-stone-700 text-sm">{task.text}</span>
            <button onClick={() => deleteTask(task.id)} className="text-stone-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Completed ({done.length})</p>
              <button onClick={clearCompleted} className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
                Clear all
              </button>
            </div>
            {done.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100 opacity-50 group">
                <button onClick={() => toggleDone(task.id)} className="text-lawn-500 flex-shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </button>
                <span className="flex-1 text-stone-400 text-sm line-through">{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="text-stone-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { CheckSquare, Square, Plus, Trash2, ClipboardList } from 'lucide-react'
import { calendarData, getZoneGroup, MONTH_NAMES, CATEGORY_COLORS } from '../utils/calendarData.js'

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
    if (!todos.some(t => t.text === title)) addTask(title)
  }

  const pending = todos.filter(t => !t.done)
  const done = todos.filter(t => t.done)

  return (
    <div className="card">
      <h2 className="section-title">
        <ClipboardList className="w-5 h-5 text-tt-lime" />
        Task Manager
        {pending.length > 0 && (
          <span className="ml-auto bg-tt-light-lime text-tt-forest text-xs font-bold px-2 py-0.5 rounded-full border border-tt-lime/40">
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

      {/* Seasonal suggestions */}
      {calendarTasks.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-tt-charcoal/40 uppercase tracking-wider mb-2">
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
                    className={`text-xs px-2 py-0.5 rounded font-bold transition-colors
                      ${alreadyAdded ? 'text-tt-charcoal/20 cursor-default' : `${colors.text} hover:opacity-70`}`}
                  >
                    {alreadyAdded ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pending.length === 0 && done.length === 0 && (
        <div className="text-center py-8 text-tt-charcoal/30">
          <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No tasks yet. Add one above or import from calendar suggestions.</p>
        </div>
      )}

      {/* Pending tasks */}
      <div className="space-y-2">
        {pending.map(task => (
          <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-tt-cream border border-tt-lime/20 group">
            <button onClick={() => toggleDone(task.id)} className="text-tt-lime/40 hover:text-tt-forest transition-colors flex-shrink-0">
              <Square className="w-5 h-5" />
            </button>
            <span className="flex-1 text-tt-charcoal text-sm">{task.text}</span>
            <button onClick={() => deleteTask(task.id)} className="text-tt-charcoal/20 hover:text-tt-orange transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-xs font-bold text-tt-charcoal/30 uppercase tracking-wider">Completed ({done.length})</p>
              <button onClick={clearCompleted} className="text-xs text-tt-orange hover:text-tt-orange/70 font-bold transition-colors">
                Clear all
              </button>
            </div>
            {done.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-tt-light-lime border border-tt-lime/20 opacity-60 group">
                <button onClick={() => toggleDone(task.id)} className="text-tt-lime flex-shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </button>
                <span className="flex-1 text-tt-charcoal/50 text-sm line-through">{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="text-tt-charcoal/20 hover:text-tt-orange transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
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

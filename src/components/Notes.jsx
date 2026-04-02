import { useState } from 'react'
import { NotebookPen, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const NOTE_TEMPLATES = [
  { label: 'pH Test Result', text: 'Date: \nLocation: \npH Reading: \nAction taken: ' },
  { label: 'Grass Type Log', text: 'Front lawn: \nBack lawn: \nShaded areas: \nSun exposure: ' },
  { label: 'Product Used', text: 'Product name: \nBrand: \nApplication rate: \nDate applied: \nArea covered: sq ft\nResults: ' },
  { label: 'Irrigation Notes', text: 'Zone 1: \nZone 2: \nRun time: min\nSchedule: \nNotes: ' },
  { label: 'Problem Area', text: 'Location: \nProblem type: \nFirst noticed: \nAction taken: \nFollowup needed: ' },
]

function NoteCard({ note, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border border-tt-lime/30 rounded-xl overflow-hidden">
      <div className="flex items-center bg-tt-cream px-4 py-2.5 gap-2">
        <button onClick={() => setExpanded(v => !v)} className="text-tt-charcoal/30 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <input
          type="text"
          value={note.title}
          onChange={e => onUpdate({ ...note, title: e.target.value })}
          className="flex-1 bg-transparent font-bold text-tt-charcoal text-sm focus:outline-none placeholder-tt-charcoal/30"
          placeholder="Note title…"
        />
        <span className="text-xs text-tt-charcoal/30 flex-shrink-0">{new Date(note.updatedAt).toLocaleDateString()}</span>
        <button onClick={onDelete} className="text-tt-charcoal/20 hover:text-tt-orange transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {expanded && (
        <textarea
          value={note.body}
          onChange={e => onUpdate({ ...note, body: e.target.value, updatedAt: new Date().toISOString() })}
          rows={5}
          className="w-full p-4 text-sm text-tt-charcoal bg-white focus:outline-none resize-y font-mono leading-relaxed"
          placeholder="Write your notes here…"
        />
      )}
    </div>
  )
}

export default function Notes({ notes, onNotesChange }) {
  function addNote(prefill = {}) {
    const newNote = {
      id: Date.now(),
      title: prefill.title || 'New Note',
      body: prefill.text || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onNotesChange([newNote, ...notes])
  }

  function updateNote(updated) {
    onNotesChange(notes.map(n => n.id === updated.id ? updated : n))
  }

  function deleteNote(id) {
    onNotesChange(notes.filter(n => n.id !== id))
  }

  return (
    <div className="card">
      <h2 className="section-title">
        <NotebookPen className="w-5 h-5 text-tt-orange" />
        Lawn Notes
        <span className="ml-auto text-xs font-normal text-tt-charcoal/40">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </h2>

      {/* Quick templates */}
      <div className="mb-4">
        <p className="text-xs font-bold text-tt-charcoal/40 uppercase tracking-wider mb-2">Quick Templates</p>
        <div className="flex flex-wrap gap-2">
          {NOTE_TEMPLATES.map(tpl => (
            <button
              key={tpl.label}
              onClick={() => addNote(tpl)}
              className="text-xs px-3 py-1.5 rounded-lg bg-tt-light-lime border border-tt-lime/40 text-tt-forest hover:bg-tt-lime/20 transition-colors font-semibold"
            >
              + {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => addNote()}
        className="w-full flex items-center justify-center gap-2 mb-5 py-2.5 border-2 border-dashed border-tt-lime/30 rounded-xl text-tt-charcoal/40 hover:border-tt-orange/50 hover:text-tt-orange transition-colors text-sm font-semibold"
      >
        <Plus className="w-4 h-4" />
        New Blank Note
      </button>

      {notes.length === 0 && (
        <div className="text-center py-8 text-tt-charcoal/30">
          <NotebookPen className="w-12 h-12 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No notes yet. Use a template above or add a blank note to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={() => deleteNote(note.id)}
          />
        ))}
      </div>
    </div>
  )
}

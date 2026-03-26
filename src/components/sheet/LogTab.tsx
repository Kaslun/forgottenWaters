'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState, EMPTY_STATES } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';
import type { ShipLogEntry } from '@/types/game';

interface LogTabProps {
  entries: ShipLogEntry[];
  onAddEntry: (content: string, type: ShipLogEntry['entry_type']) => void;
  onUpdateEntry: (id: string, content: string) => void;
}

const ENTRY_TYPES: {
  value: ShipLogEntry['entry_type'];
  label: string;
  icon: string;
}[] = [
  { value: 'log', label: "Ship's Log", icon: '📜' },
  { value: 'threat_event', label: 'Threat Event', icon: '⚠️' },
  { value: 'captains_quarters', label: "Captain's Quarters", icon: '🚪' },
  { value: 'captains_mission', label: "Captain's Mission", icon: '🗺️' },
];

function getTypeLabel(type: ShipLogEntry['entry_type']): string {
  return ENTRY_TYPES.find((t) => t.value === type)?.label ?? type;
}

function getTypeIcon(type: ShipLogEntry['entry_type']): string {
  return ENTRY_TYPES.find((t) => t.value === type)?.icon ?? '📝';
}

export function LogTab({ entries, onAddEntry, onUpdateEntry }: LogTabProps) {
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<ShipLogEntry['entry_type']>('log');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const grouped = ENTRY_TYPES.map((type) => ({
    ...type,
    entries: entries.filter((e) => e.entry_type === type.value),
  })).filter((g) => g.entries.length > 0);

  function handleAdd() {
    const trimmed = newContent.trim();
    if (!trimmed) return;
    onAddEntry(trimmed, newType);
    setNewContent('');
  }

  function startEdit(entry: ShipLogEntry) {
    setEditingId(entry.id);
    setEditContent(entry.content);
  }

  function saveEdit() {
    if (editingId && editContent.trim()) {
      onUpdateEntry(editingId, editContent.trim());
    }
    setEditingId(null);
    setEditContent('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent('');
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState {...EMPTY_STATES.LOG_EMPTY} />
        <AddEntryForm
          newContent={newContent}
          newType={newType}
          onContentChange={setNewContent}
          onTypeChange={setNewType}
          onAdd={handleAdd}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <section key={group.value}>
          <h3 className="font-pirata text-gold-400 text-base mb-2 flex items-center gap-2">
            <span>{group.icon}</span>
            {group.label}
            <span className="text-parchment-500 font-body text-xs ml-auto">
              {group.entries.length}
            </span>
          </h3>

          <div className="space-y-2">
            {group.entries.map((entry) => (
              <Card key={entry.id}>
                {editingId === entry.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border bg-navy-700 border-gold-700/30 text-parchment-200 font-body text-sm focus:outline-none focus:border-gold-600/60 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(entry)}
                    className="w-full text-left min-h-[48px]"
                  >
                    <p className="text-parchment-300 text-sm font-body leading-relaxed">
                      {entry.content}
                    </p>
                    <p className="text-parchment-500 text-xs font-body mt-1">
                      Tap to edit
                    </p>
                  </button>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}

      <AddEntryForm
        newContent={newContent}
        newType={newType}
        onContentChange={setNewContent}
        onTypeChange={setNewType}
        onAdd={handleAdd}
      />
    </div>
  );
}

function AddEntryForm({
  newContent,
  newType,
  onContentChange,
  onTypeChange,
  onAdd,
}: {
  newContent: string;
  newType: ShipLogEntry['entry_type'];
  onContentChange: (val: string) => void;
  onTypeChange: (val: ShipLogEntry['entry_type']) => void;
  onAdd: () => void;
}) {
  return (
    <Card variant="highlighted" className="sticky bottom-0">
      <h3 className="font-pirata text-gold-400 text-base mb-3">
        New Entry
      </h3>

      <div className="flex gap-1 mb-3 overflow-x-auto">
        {ENTRY_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={cn(
              'flex-shrink-0 px-3 min-h-[48px] rounded-lg font-body text-xs transition-colors flex items-center gap-1.5',
              newType === type.value
                ? 'bg-gold-600/20 text-gold-400 border border-gold-600/40'
                : 'text-parchment-500 active:text-parchment-300 border border-transparent'
            )}
          >
            <span>{type.icon}</span>
            <span className="hidden sm:inline">{type.label}</span>
          </button>
        ))}
      </div>

      <textarea
        value={newContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={`Write a ${getTypeLabel(newType).toLowerCase()} entry...`}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border bg-navy-700 border-gold-700/30 text-parchment-200 placeholder:text-parchment-500 font-body text-sm focus:outline-none focus:border-gold-600/60 resize-none mb-3"
      />

      <Button
        variant="primary"
        size="sm"
        className="w-full"
        onClick={onAdd}
        disabled={!newContent.trim()}
      >
        ✏️ Add Entry
      </Button>
    </Card>
  );
}

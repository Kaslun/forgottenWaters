'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import type { SelectionMode } from '@/types/game';

interface GameSettingsProps {
  characterMode: SelectionMode;
  roleMode: SelectionMode;
  onChangeCharacterMode: (mode: SelectionMode) => void;
  onChangeRoleMode: (mode: SelectionMode) => void;
}

interface SegmentedControlProps {
  label: string;
  value: SelectionMode;
  onChange: (mode: SelectionMode) => void;
  options: { value: SelectionMode; label: string }[];
}

function SegmentedControl({ label, value, onChange, options }: SegmentedControlProps) {
  return (
    <div className="space-y-2">
      <label className="font-pirata text-sm text-gold-500">{label}</label>
      <div className="flex rounded-2xl bg-surface-lowest p-1 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 font-body text-sm py-2 rounded-xl transition-all min-h-[48px]',
              value === opt.value
                ? 'bg-gold-gradient text-navy-900 font-semibold shadow-glow-gold'
                : 'bg-surface-high text-parchment-400 hover:bg-teal-600/15 active:bg-teal-600/25 active:opacity-90'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const CHARACTER_OPTIONS: { value: SelectionMode; label: string }[] = [
  { value: 'choice', label: "Player's Choice" },
  { value: 'random', label: 'Random' },
];

const ROLE_OPTIONS: { value: SelectionMode; label: string }[] = [
  { value: 'choice', label: "Player's Choice" },
  { value: 'random', label: 'Random' },
];

export function GameSettings({
  characterMode,
  roleMode,
  onChangeCharacterMode,
  onChangeRoleMode,
}: GameSettingsProps) {
  return (
    <Card variant="default" className="space-y-4">
      <h3 className="font-pirata text-lg text-gold-500">Ship&apos;s Orders</h3>

      <SegmentedControl
        label="Character Selection"
        value={characterMode}
        onChange={onChangeCharacterMode}
        options={CHARACTER_OPTIONS}
      />

      <SegmentedControl
        label="Role Assignment"
        value={roleMode}
        onChange={onChangeRoleMode}
        options={ROLE_OPTIONS}
      />
    </Card>
  );
}

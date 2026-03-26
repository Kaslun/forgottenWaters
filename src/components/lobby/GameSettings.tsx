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
      <div className="flex rounded-xl bg-navy-900 border border-gold-700/20 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 font-body text-sm py-2 rounded-lg transition-colors min-h-[48px]',
              value === opt.value
                ? 'bg-gold-600 text-navy-900 font-semibold'
                : 'text-parchment-400 active:bg-navy-700'
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

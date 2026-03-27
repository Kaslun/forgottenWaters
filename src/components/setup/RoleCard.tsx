'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ShipRole } from '@/types/roles';

interface RoleCardProps {
  role: ShipRole;
  isAssigned: boolean;
  assignedTo: string | null;
  isMine: boolean;
  onClaim: () => void;
}

export function RoleCard({ role, isAssigned, assignedTo, isMine, onClaim }: RoleCardProps) {
  return (
    <Card
      variant={isMine ? 'highlighted' : 'default'}
      className={cn(
        'flex items-center gap-3 bg-surface ghost-border shadow-ambient',
        isAssigned && !isMine && 'opacity-70'
      )}
    >
      <span className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center" role="img" aria-label={role.name}>
        {role.icon}
      </span>

      <div className="flex-1 min-w-0">
        <h4 className="font-pirata text-gold-400 text-base leading-tight">{role.name}</h4>
        <p className="font-body text-parchment-400 text-xs mt-0.5 leading-snug">{role.shortDescription}</p>

        {isAssigned && assignedTo && (
          <Badge variant={isMine ? 'success' : 'default'} className="mt-1.5">
            {isMine ? 'You' : assignedTo}
          </Badge>
        )}
      </div>

      {!isAssigned && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClaim}
          className="flex-shrink-0 text-teal-400"
        >
          Claim
        </Button>
      )}

      {isMine && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClaim}
          className="flex-shrink-0 text-parchment-500"
        >
          Drop
        </Button>
      )}
    </Card>
  );
}

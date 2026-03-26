'use client';

import { SHIP_ROLES } from '@/data/roles';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RoleCard } from '@/components/setup/RoleCard';
import type { Player } from '@/types/game';

interface RolePickerProps {
  players: Player[];
  currentPlayer: Player;
  roleMode: 'choice' | 'random';
  isHost: boolean;
  onClaimRole: (roleId: string) => void;
  onAutoDistribute: () => void;
}

export function RolePicker({
  players,
  currentPlayer,
  roleMode,
  isHost,
  onClaimRole,
  onAutoDistribute,
}: RolePickerProps) {
  const roleAssignments = new Map<string, Player>();

  for (const player of players) {
    for (const roleId of player.ship_roles) {
      roleAssignments.set(roleId, player);
    }
  }

  const unassignedCount = SHIP_ROLES.filter(r => !roleAssignments.has(r.id)).length;

  return (
    <div className="space-y-4">
      {unassignedCount > 0 && (
        <Card variant="warning">
          <p className="font-body text-amber-300 text-sm">
            {unassignedCount} role{unassignedCount !== 1 && 's'} still unassigned.
            {players.length < 7 && ' Some players will need multiple roles.'}
          </p>
        </Card>
      )}

      {roleMode === 'random' && isHost && unassignedCount > 0 && (
        <Button onClick={onAutoDistribute} className="w-full">
          Auto-Assign All Roles
        </Button>
      )}

      <div className="space-y-3">
        {SHIP_ROLES.map(role => {
          const assignee = roleAssignments.get(role.id);
          const isMine = currentPlayer.ship_roles.includes(role.id);

          return (
            <RoleCard
              key={role.id}
              role={role}
              isAssigned={!!assignee}
              assignedTo={
                assignee
                  ? assignee.id === currentPlayer.id
                    ? null
                    : (assignee.pirate_name || assignee.display_name)
                  : null
              }
              isMine={isMine}
              onClaim={() => onClaimRole(role.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

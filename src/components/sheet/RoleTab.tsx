'use client';

import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { SHIP_ROLES } from '@/data/roles';
import type { Player } from '@/types/game';

interface RoleTabProps {
  roles: string[];
  allPlayers: Player[];
}

export function RoleTab({ roles, allPlayers }: RoleTabProps) {
  const myRoles = SHIP_ROLES.filter((r) => roles.includes(r.id));

  const crewAssignments = SHIP_ROLES.map((role) => ({
    role,
    players: allPlayers.filter((p) => p.ship_roles.includes(role.id)),
  })).filter((a) => a.players.length > 0);

  return (
    <div className="space-y-6">
      {/* Player's own roles */}
      <section>
        <h2 className="font-pirata text-gold-400 text-lg mb-3">
          Your Roles
        </h2>

        {myRoles.length === 0 ? (
          <Card>
            <p className="text-parchment-500 font-body text-sm text-center py-4">
              No roles assigned yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {myRoles.map((role) => (
              <Card key={role.id} variant="highlighted">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">
                    {role.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pirata text-gold-400 text-base mb-1">
                      {role.name}
                    </h3>
                    <p className="text-parchment-300 font-body text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* All crew assignments */}
      <section>
        <h2 className="font-pirata text-gold-400 text-lg mb-3">
          Crew Assignments
        </h2>

        <Card>
          <div className="divide-y divide-gold-700/10">
            {crewAssignments.map(({ role, players }) => (
              <div
                key={role.id}
                className={cn(
                  'flex items-center gap-3 py-3 first:pt-0 last:pb-0',
                  roles.includes(role.id) && 'bg-gold-600/5 -mx-4 px-4 rounded-lg'
                )}
              >
                <span className="text-lg flex-shrink-0">{role.icon}</span>
                <span className="text-parchment-400 font-body text-sm flex-shrink-0 min-w-[100px]">
                  {role.name}
                </span>
                <span className="text-parchment-500 font-body text-xs flex-shrink-0">
                  →
                </span>
                <span className="text-parchment-200 font-body text-sm truncate">
                  {players
                    .map((p) => p.pirate_name || p.display_name)
                    .join(', ')}
                </span>
              </div>
            ))}

            {crewAssignments.length === 0 && (
              <p className="text-parchment-500 font-body text-sm text-center py-4">
                No roles assigned to the crew yet.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

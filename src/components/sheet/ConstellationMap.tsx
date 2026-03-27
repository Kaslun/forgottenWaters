'use client';

import { useCallback } from 'react';
import { getEligibleStarIds } from '@/lib/constellation';
import { starFeedback } from '@/lib/haptics';
import type { ConstellationData } from '@/types/character';

interface ConstellationMapProps {
  constellation: ConstellationData;
  filledStars: number[];
  onStarFill: (starId: number) => void;
  highlightEligible: boolean;
}

export function ConstellationMap({
  constellation,
  filledStars,
  onStarFill,
  highlightEligible,
}: ConstellationMapProps) {
  const filledSet = new Set(filledStars);
  const eligibleIds = highlightEligible
    ? getEligibleStarIds(constellation, filledStars)
    : [];
  const eligibleSet = new Set(eligibleIds);

  const startStar = constellation.stars.find((s) => s.isStart);

  const handleTap = useCallback(
    (starId: number) => {
      starFeedback();
      onStarFill(starId);
    },
    [onStarFill]
  );

  const starById = new Map(constellation.stars.map((s) => [s.id, s]));

  return (
    <div
      className="w-full aspect-square touch-none"
      style={{ touchAction: 'none' }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {constellation.edges.map(([a, b], i) => {
          const starA = starById.get(a);
          const starB = starById.get(b);
          if (!starA || !starB) return null;
          return (
            <line
              key={i}
              x1={starA.x}
              y1={starA.y}
              x2={starB.x}
              y2={starB.y}
              className="stroke-parchment-500/20"
              strokeWidth={0.5}
            />
          );
        })}

        {constellation.stars.map((star) => {
          const isFilled = filledSet.has(star.id);
          const isStart = star.isStart;
          const isEligible = eligibleSet.has(star.id);
          const tappable = isEligible && !isFilled && !isStart;

          return (
            <g key={star.id}>
              {/* Invisible large tap target */}
              {tappable && (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={8}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => handleTap(star.id)}
                />
              )}

              {/* Visible star */}
              {isStart ? (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={4}
                  className="fill-gold-400 stroke-gold-500 [filter:drop-shadow(0_0_14px_rgba(240,165,0,0.45))]"
                  strokeWidth={0.8}
                />
              ) : isFilled ? (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3.5}
                  className="fill-gold-400 [filter:drop-shadow(0_0_8px_rgba(240,165,0,0.35))]"
                />
              ) : isEligible ? (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3}
                  className="fill-none stroke-teal-400 animate-pulse [filter:drop-shadow(0_0_4px_rgba(68,226,205,0.35))]"
                  strokeWidth={0.8}
                />
              ) : (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3}
                  className="fill-none stroke-parchment-500/20"
                  strokeWidth={0.5}
                />
              )}

              {/* Event marker */}
              {star.hasEvent && !isStart && (
                <text
                  x={star.x}
                  y={star.y + 1.2}
                  textAnchor="middle"
                  className="fill-red-500 font-mono text-[4px] font-bold select-none [filter:drop-shadow(0_0_3px_rgba(239,68,68,0.65))]"
                >
                  !
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

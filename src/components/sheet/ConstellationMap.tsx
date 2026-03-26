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
              className="stroke-parchment-500/30"
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
                  className="fill-gold-400 stroke-gold-500"
                  strokeWidth={0.8}
                />
              ) : isFilled ? (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3.5}
                  className="fill-gold-500"
                />
              ) : isEligible ? (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3}
                  className="fill-none stroke-gold-400 animate-pulse-glow"
                  strokeWidth={0.8}
                />
              ) : (
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={3}
                  className="fill-none stroke-parchment-500/30"
                  strokeWidth={0.5}
                />
              )}

              {/* Event marker */}
              {star.hasEvent && !isStart && (
                <text
                  x={star.x}
                  y={star.y + 1.2}
                  textAnchor="middle"
                  className={
                    isFilled
                      ? 'fill-navy-900 text-[4px] font-bold select-none'
                      : 'fill-gold-500/60 text-[4px] font-bold select-none'
                  }
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

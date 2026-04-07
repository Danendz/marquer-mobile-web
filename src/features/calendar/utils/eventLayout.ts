import type { WeekEvent } from '@/features/calendar/utils/weekEvent';

export interface PositionedEvent {
  event: WeekEvent;
  left: number;
  width: number;
  colIndex: number;
  overflowCount: number;
  overflowEvents: WeekEvent[];
}

/**
 * Groups sorted events into clusters by transitive overlap.
 * Two events overlap if one starts before the other ends.
 */
function buildClusters(sorted: WeekEvent[]): WeekEvent[][] {
  const clusters: WeekEvent[][] = [];
  let current: WeekEvent[] = [];
  let clusterEnd = -1;

  for (const event of sorted) {
    if (current.length === 0 || event.startMinutes < clusterEnd) {
      current.push(event);
      clusterEnd = Math.max(clusterEnd, event.startMinutes + event.durationMinutes);
    } else {
      clusters.push(current);
      current = [event];
      clusterEnd = event.startMinutes + event.durationMinutes;
    }
  }

  if (current.length > 0) {
    clusters.push(current);
  }

  return clusters;
}

/**
 * Sweep-line layout algorithm ported from Flutter.
 * - Sort events by startMinutes
 * - Group into transitive clusters
 * - For each cluster, find peak concurrency
 * - 3+ simultaneous: first gets full width, rest become "+N" overflow badge
 * - 1-2: side by side, width = columnWidth / count
 */
export function layoutEvents(
  events: WeekEvent[],
  columnWidth: number,
): PositionedEvent[] {
  if (events.length === 0) return [];

  const sorted = [...events].sort((a, b) => a.startMinutes - b.startMinutes);
  const clusters = buildClusters(sorted);
  const result: PositionedEvent[] = [];

  for (const cluster of clusters) {
    // Find peak concurrency via sweep line
    const points: { minute: number; delta: number }[] = [];
    for (const ev of cluster) {
      points.push({ minute: ev.startMinutes, delta: 1 });
      points.push({ minute: ev.startMinutes + ev.durationMinutes, delta: -1 });
    }
    points.sort((a, b) => a.minute - b.minute || a.delta - b.delta);

    let peak = 0;
    let concurrent = 0;
    for (const p of points) {
      concurrent += p.delta;
      peak = Math.max(peak, concurrent);
    }

    if (peak >= 3) {
      // First event full width, rest collapsed into overflow badge
      const first = cluster[0];
      const overflow = cluster.slice(1);
      result.push({
        event: first,
        left: 0,
        width: columnWidth,
        colIndex: 0,
        overflowCount: overflow.length,
        overflowEvents: overflow,
      });
    } else {
      // Side by side
      const colCount = Math.min(cluster.length, 2);
      const w = columnWidth / colCount;
      cluster.forEach((ev, i) => {
        const colIdx = i % colCount;
        result.push({
          event: ev,
          left: colIdx * w,
          width: w,
          colIndex: colIdx,
          overflowCount: 0,
          overflowEvents: [],
        });
      });
    }
  }

  return result;
}

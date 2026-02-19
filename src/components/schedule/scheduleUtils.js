/**
 * Build display rows from schedule config: P1..P(n), with break rows after specified periods.
 * config.breaks = [{ afterPeriodIndex, durationMinutes, label }] – e.g. short break after P2, lunch after P4.
 * Lesson periods all use the same duration; each break can have a different duration and label.
 */
export function buildPeriodsDisplay(config) {
  if (!config) return [];
  const { periodCount, periodDurationMinutes, firstPeriodStartTime, breaks = [] } = config;
  const rows = [];
  const [h, m] = (firstPeriodStartTime || '08:00').split(':').map(Number);
  let minutes = (h || 0) * 60 + (m || 0);
  const breakByPeriod = new Map((breaks || []).map((b) => [b.afterPeriodIndex, b]));

  for (let p = 1; p <= periodCount; p++) {
    const start = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    minutes += periodDurationMinutes || 45;
    const end = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    rows.push({
      type: 'period',
      periodIndex: p,
      label: `P${p}`,
      time: `${start} – ${end}`,
      rowIndex: rows.length,
    });
    const breakDef = breakByPeriod.get(p);
    if (breakDef && breakDef.durationMinutes > 0) {
      rows.push({
        type: 'break',
        rowIndex: rows.length,
        label: breakDef.label || 'Break',
        durationMinutes: breakDef.durationMinutes,
      });
      minutes += breakDef.durationMinutes;
    }
  }
  return rows;
}

/**
 * Build grid[dayIndex 0-4][displayRowIndex][classIndex] from slots and class list.
 * slots: [{ classId, dayOfWeek, periodIndex, subjectName, teacherName, room }]
 * classes: [{ id, name }]
 * displayRows: from buildPeriodsDisplay (each row has type and periodIndex if type==='period')
 */
export function buildGridFromSlots(slots, classes, displayRows) {
  const dayCount = 5;
  const slotMap = new Map();
  for (const s of slots || []) {
    const key = `${s.dayOfWeek}-${s.periodIndex}-${s.classId}`;
    slotMap.set(key, { subjectName: s.subjectName, teacherName: s.teacherName, room: s.room || '—', slotId: s.id });
  }

  const grid = [];
  for (let d = 0; d < dayCount; d++) {
    const dayOfWeek = d + 1; // 1=Monday
    const dayRows = [];
    for (let r = 0; r < displayRows.length; r++) {
      const row = displayRows[r];
      if (row.type === 'break') {
        dayRows.push(classes.map(() => ({ subjectName: 'Break', teacherName: '—', room: '—', isBreak: true })));
        continue;
      }
      const periodIndex = row.periodIndex;
      dayRows.push(
        classes.map((c) => {
          const key = `${dayOfWeek}-${periodIndex}-${c.id}`;
          const slot = slotMap.get(key);
          return slot
            ? { subjectName: slot.subjectName, teacherName: slot.teacherName, room: slot.room, slotId: slot.slotId }
            : { subjectName: '—', teacherName: '—', room: '—', empty: true };
        })
      );
    }
    grid.push(dayRows);
  }
  return grid;
}

/** Day labels for Monday=0 .. Friday=4 */
export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

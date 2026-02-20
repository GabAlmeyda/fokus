export function generateWeeklyDays(date: Date): {
  label: string;
  dayNum: number;
  isToday: boolean;
  fullDate: string;
}[] {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    days.push({
      label: day
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .slice(0, 3)
        .replace('.', ''),
      dayNum: day.getDate(),
      isToday: day.toDateString() === today.toDateString(),
      fullDate: generateISODate(day),
    });
  }

  return days;
}

export function generateHeaderDateString(date: Date) {
  let weekDay = date
    .toLocaleDateString('pt-BR', { weekday: 'long' })
    .split('-')[0];
  weekDay = weekDay[0].toUpperCase() + weekDay.slice(1);
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '');
  const day = date.getDate();
  const year = date.getFullYear();

  return `${weekDay}, ${day} ${month}, ${year}`;
}

export function generateISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

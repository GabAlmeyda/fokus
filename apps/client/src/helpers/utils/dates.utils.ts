import { addDays, format, isToday, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export function generateWeeklyDays(date: Date): {
  label: string;
  dayNum: number;
  isToday: boolean;
  fullDate: string;
}[] {
  const weekStart = startOfWeek(date);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);

    days.push({
      label: day
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .slice(0, 3)
        .replace('.', ''),
      dayNum: day.getDate(),
      isToday: isToday(day),
      fullDate: format(day, 'yyyy-MM-dd'),
    });
  }

  return days;
}

export function generateHeaderDateString(date: Date) {
  const formattedDate = format(date, 'EEE, dd MMM, yyyy', { locale: ptBR });

  return formattedDate[0].toUpperCase() + formattedDate.slice(1).replaceAll('.', '');
}
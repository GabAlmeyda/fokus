import { GoalFormSchema, HabitFormSchema } from '@fokus/shared';

export function parseGoal(goalId: string) {
  try {
    const storedKey = 'goal-data' + (goalId === 'new' ? '-new' : '-update');
    const storedGoal = sessionStorage.getItem(storedKey);
    if (!storedGoal) return null;

    return GoalFormSchema.parse(JSON.parse(storedGoal));
  } catch (_err) {
    console.error('Error while attempting to read stored data.');
    return null;
  }
}

export function parseHabit(habitId: string) {
  try {
    const storedKey = 'habit-data' + (habitId === 'new' ? '-new' : '-update');
    const storedHabit = sessionStorage.getItem(storedKey);
    if (!storedHabit) return null;

    return HabitFormSchema.parse(JSON.parse(storedHabit));
  } catch (_err) {
    console.error('Error while attempting to read stored data.');
    return null;
  }
}

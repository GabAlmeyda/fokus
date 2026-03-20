import { GoalCreateSchema, HabitCreateSchema } from '@fokus/shared';

export function parseGoal(goalId: string) {
  try {
    const storedKey = 'goal-data' + (goalId === 'new' ? '-new' : '-update');
    const storedGoal = sessionStorage.getItem(storedKey);
    if (!storedGoal) return null;

    return GoalCreateSchema.omit({ userId: true }).parse(
      JSON.parse(storedGoal),
    );
  } catch (err) {
    console.error('Error while attempting to read stored data.');
    return null;
  }
}

export function parseHabit(habitId: string) {
  try {
    const storedKey = 'habit-data' + (habitId === 'new' ? '-new' : '-update');
    const storedHabit = sessionStorage.getItem(storedKey);
    if (!storedHabit) return null;

    return HabitCreateSchema.omit({ userId: true }).parse(
      JSON.parse(storedHabit),
    );
  } catch (err) {
    console.error('Error while attempting to read stored data.');
    return null;
  }
}

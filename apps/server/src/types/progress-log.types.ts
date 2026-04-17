import type { EntityIdDTO } from '@fokus/shared';

export type ProgressLogDeleteDTO = {
  entityType: 'habitId' | 'goalId';
  entityId?: EntityIdDTO;
  date?: Date;
};

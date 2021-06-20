import Dexie from 'dexie';
import { Plan } from './features/plansSlice';
import { Week } from './features/weeksSlice';
import { Workout } from './features/workoutsSlice';

export class TrainingPlannerDatabase extends Dexie {
  plans: Dexie.Table<Plan, string>;
  workouts: Dexie.Table<Workout, string>;
  weeks: Dexie.Table<Week, string>;

  constructor() {
    super('TrainngLogDatabase');
    this.version(1).stores({
      plans: '&id, name, numWeeks, eventDate',
      workouts:
        '&id, planId, weekId, type, workout, dayOfWeek, completed, distance, distanceUnits, notes',
      weeks: 'id, planId, position, notes',
    });
    this.plans = this.table('plans');
    this.workouts = this.table('workouts');
    this.weeks = this.table('weeks');
  }
}

export const db = new TrainingPlannerDatabase();

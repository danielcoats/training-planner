import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { WeekDay } from '../features/types';
import { addWeekToDb, selectWeeks } from '../features/weeksSlice';
import { addWorkoutsToDb } from '../features/workoutsSlice';
import { AppDispatch, RootState } from '../store';

const testWorkouts = [
  {
    description: '30 mins',
    type: 'Run',
    dayOfWeek: WeekDay.Friday,
  },
  {
    description: '60 mins',
    type: 'Run',
    dayOfWeek: WeekDay.Monday,
  },
  {
    description: '45 mins',
    type: 'Cross-train',
    dayOfWeek: WeekDay.Friday,
  },
  {
    description: '10km',
    type: 'Time Trial',
    dayOfWeek: WeekDay.Saturday,
  },
  {
    description: '45 mins',
    type: 'Cross-train',
    dayOfWeek: WeekDay.Wednesday,
  },
  {
    description: '80 mins',
    type: 'Long run',
    dayOfWeek: WeekDay.Sunday,
  },
  {
    description: '4 x 800m, 200m recovery',
    type: 'Intervals',
    dayOfWeek: WeekDay.Tuesday,
  },
  {
    description: '45 mins',
    type: 'Fartlek',
    dayOfWeek: WeekDay.Thursday,
  },
];

export const addSeedDataToPlan = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('development/addSeedDataToPlan', async (planId, thunkApi) => {
  const numWeeks = selectWeeks(thunkApi.getState()).length;
  const resultAction = await thunkApi.dispatch(
    addWeekToDb({
      planId,
      position: numWeeks,
    }),
  );
  const week = unwrapResult(resultAction);
  await thunkApi.dispatch(
    addWorkoutsToDb(
      testWorkouts.map((workout) => ({
        ...workout,
        planId,
        weekId: week.id,
      })),
    ),
  );
});

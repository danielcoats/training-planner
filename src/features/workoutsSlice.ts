import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
  unwrapResult,
} from '@reduxjs/toolkit';
import { db } from '../db';
import { AppDispatch, RootState } from '../store';
import { Unit, WeekDay } from './types';

export interface Workout {
  id: string;
  planId: string;
  weekId: string;
  type: string;
  description: string;
  dayOfWeek: WeekDay;
  distance?: number;
  distanceUnits?: Unit;
  notes?: string;
}

export const loadWorkoutsFromDb = createAsyncThunk(
  'workouts/loadWorkoutsFromDb',
  async () => {
    return await db.workouts.toArray();
  },
);

export const updateWorkoutInDb = createAsyncThunk(
  'workouts/updateWorkoutInDb',
  async (payload: { id: string; changes: Partial<Workout> }) => {
    const { id, changes } = payload;
    await db.workouts.update(id, changes);
    return payload;
  },
);

export const deleteWorkoutFromDb = createAsyncThunk(
  'workouts/deleteWorkoutFromDb',
  async (payload: { id: string }) => {
    const { id } = payload;
    await db.workouts.delete(id);
    return id;
  },
);

export const deleteWorkoutsByPlanIdFromDb = createAsyncThunk<
  void,
  string,
  {
    state: RootState;
  }
>('workouts/deleteWorkoutsByPlanIdFromDb', async (planId, thunkApi) => {
  const workoutIds = selectWorkoutsByPlanId(thunkApi.getState(), planId).map(
    (workout) => workout.id,
  );
  await db.workouts.bulkDelete(workoutIds);
});

export const deleteWorkoutsByWeekIdFromDb = createAsyncThunk<
  void,
  string,
  {
    state: RootState;
  }
>('workouts/deleteWorkoutsByWeekIdFromDb', async (weekId, thunkApi) => {
  const workoutIds = selectWorkoutsByWeekId(thunkApi.getState(), weekId).map(
    (workout) => workout.id,
  );
  await db.workouts.bulkDelete(workoutIds);
});

export const addWorkoutToDb = createAsyncThunk(
  'workouts/addWorkoutToDb',
  async (payload: Omit<Workout, 'id'>) => {
    const week = {
      ...payload,
      id: nanoid(),
    };
    await db.workouts.add(week);
    return week;
  },
);

export const loadAndAddWorkoutsFromDb = createAsyncThunk<
  Workout[],
  undefined,
  {
    dispatch: AppDispatch;
  }
>('workouts/loadAndAddWorkoutsFromDb', async (_, thunkApi) => {
  const result = await thunkApi.dispatch(loadWorkoutsFromDb());
  return unwrapResult(result);
});

const workoutsAdapter = createEntityAdapter<Workout>();

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: workoutsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWorkoutToDb.fulfilled, (state, { payload }) => {
        workoutsAdapter.upsertOne(state, payload);
      })
      .addCase(updateWorkoutInDb.fulfilled, (state, { payload }) => {
        workoutsAdapter.updateOne(state, payload);
      })
      .addCase(deleteWorkoutFromDb.fulfilled, (state, { payload }) => {
        workoutsAdapter.removeOne(state, payload);
      })
      .addCase(loadAndAddWorkoutsFromDb.fulfilled, (state, { payload }) => {
        workoutsAdapter.addMany(state, payload);
      });
  },
});

export default workoutsSlice.reducer;

export const { selectAll: selectWorkouts, selectById: selectWorkoutById } =
  workoutsAdapter.getSelectors((state: RootState) => state.workouts);

export const selectWorkoutsByPlanId = (
  state: RootState,
  planId: string,
): Workout[] => {
  return selectWorkouts(state).filter((workout) => workout.planId === planId);
};

export const selectWorkoutsByWeekId = (
  state: RootState,
  weekId: string,
): Workout[] => {
  return selectWorkouts(state).filter((workout) => workout.weekId === weekId);
};

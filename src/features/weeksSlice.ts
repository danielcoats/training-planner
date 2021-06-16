import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
  unwrapResult,
} from '@reduxjs/toolkit';
import { db } from '../db';
import { AppDispatch, RootState } from '../store';

export interface Week {
  id: string;
  planId: string;
  position: number;
  notes?: string;
}

export const loadWeeksFromDb = createAsyncThunk(
  'weeks/loadWeeksFromDb',
  async () => {
    return await db.weeks.toArray();
  },
);

export const addWeekToDb = createAsyncThunk(
  'weeks/addWeekToDb',
  async (payload: Omit<Week, 'id'>) => {
    const week = {
      ...payload,
      id: nanoid(),
    };
    await db.weeks.add(week);
    return week;
  },
);

export const deleteWeekFromDb = createAsyncThunk(
  'weeks/deleteWeekFromDb',
  async (weekId: string) => {
    await db.weeks.delete(weekId);
    return weekId;
  },
);

export const updateWeekInDb = createAsyncThunk(
  'weeks/updateWeekInDb',
  async (payload: { id: string; changes: Partial<Week> }) => {
    const { id, changes } = payload;
    await db.weeks.update(id, changes);
    return payload;
  },
);

export const loadAndAddWeeksFromDb = createAsyncThunk<
  Week[],
  undefined,
  {
    dispatch: AppDispatch;
  }
>('plans/loadAndAddWeeksFromDb', async (_, thunkApi) => {
  const result = await thunkApi.dispatch(loadWeeksFromDb());
  return unwrapResult(result);
});

export const deleteWeeksByPlanIdFromDb = createAsyncThunk<
  void,
  string,
  {
    state: RootState;
  }
>('workouts/deleteWeeksByPlanIdFromDb', async (planId, thunkApi) => {
  const weekIds = selectWeeksByPlanId(thunkApi.getState(), planId).map(
    (week) => week.id,
  );
  await db.weeks.bulkDelete(weekIds);
});

const weeksAdapter = createEntityAdapter<Week>();

const weeksSlice = createSlice({
  name: 'weeks',
  initialState: weeksAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWeekToDb.fulfilled, (state, { payload }) => {
        weeksAdapter.upsertOne(state, payload);
      })
      .addCase(updateWeekInDb.fulfilled, (state, { payload }) => {
        weeksAdapter.updateOne(state, payload);
      })
      .addCase(deleteWeekFromDb.fulfilled, (state, { payload }) => {
        weeksAdapter.removeOne(state, payload);
      })
      .addCase(loadAndAddWeeksFromDb.fulfilled, (state, { payload }) => {
        weeksAdapter.addMany(state, payload);
      });
  },
});

export default weeksSlice.reducer;

export const { selectAll: selectWeeks, selectById: selectWeekById } =
  weeksAdapter.getSelectors((state: RootState) => state.weeks);

export const selectWeeksByPlanId = (
  state: RootState,
  planId: string,
): Week[] => {
  return selectWeeks(state)
    .filter((week) => week.planId === planId)
    .sort((a, b) => a.position - b.position);
};

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  nanoid,
  unwrapResult,
} from '@reduxjs/toolkit';
import { db } from '../db';
import { AppDispatch, RootState } from '../store';
import { addWeekToDb, deleteWeeksByPlanIdFromDb } from './weeksSlice';
import { deleteWorkoutsByPlanIdFromDb } from './workoutsSlice';

export interface Plan {
  id: string;
  name: string;
  eventDate: string;
}

const plansAdapter = createEntityAdapter<Plan>();

export const loadPlansFromDb = createAsyncThunk(
  'plans/loadPlansFromDb',
  async () => {
    return await db.plans.toArray();
  },
);

export const addNewPlanToDb = createAsyncThunk(
  'plans/addNewPlanToDb',
  async (payload: Omit<Plan, 'id'>) => {
    const plan: Plan = {
      ...payload,
      id: nanoid(),
    };
    await db.plans.add(plan);
    return plan;
  },
);

export const updatePlanInDb = createAsyncThunk(
  'plans/updatePlanInDb',
  async (payload: { id: string; changes: Partial<Plan> }) => {
    const { id, changes } = payload;
    await db.plans.update(id, changes);
    return payload;
  },
);

export const deletePlanFromDb = createAsyncThunk(
  'plans/deletePlanFromDb',
  async (id: string) => {
    await db.plans.delete(id);
    return id;
  },
);

export const deleteAllPlanDataFromDb = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
  }
>('plans/deleteAllPlanDataFromDb', async (id: string, thunkApi) => {
  thunkApi.dispatch(deletePlanFromDb(id));
  thunkApi.dispatch(deleteWorkoutsByPlanIdFromDb(id));
  thunkApi.dispatch(deleteWeeksByPlanIdFromDb(id));
});

export const addPlanWithWeekToDb = createAsyncThunk<
  Plan,
  Omit<Plan, 'id'>,
  {
    dispatch: AppDispatch;
  }
>('plans/addPlanWithWeekToDb', async (payload, thunkApi) => {
  const resultAction = await thunkApi.dispatch(addNewPlanToDb(payload));
  const result = unwrapResult(resultAction);
  await thunkApi.dispatch(addWeekToDb({ planId: result.id, position: 1 }));
  return result;
});

export const loadAndAddPlansFromDb = createAsyncThunk<
  Plan[],
  undefined,
  {
    dispatch: AppDispatch;
  }
>('plans/loadAndAddPlansFromDb', async (_, thunkApi) => {
  const result = await thunkApi.dispatch(loadPlansFromDb());
  return unwrapResult(result);
});

const plansSlice = createSlice({
  name: 'plans',
  initialState: plansAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewPlanToDb.fulfilled, (state, { payload }) => {
        plansAdapter.upsertOne(state, payload);
      })
      .addCase(updatePlanInDb.fulfilled, (state, { payload }) => {
        plansAdapter.updateOne(state, payload);
      })
      .addCase(deletePlanFromDb.fulfilled, (state, { payload }) => {
        plansAdapter.removeOne(state, payload);
      })
      .addCase(loadAndAddPlansFromDb.fulfilled, (state, { payload }) => {
        plansAdapter.addMany(state, payload);
      });
  },
});

export default plansSlice.reducer;

export const { selectAll: selectPlans, selectById: selectPlanById } =
  plansAdapter.getSelectors((state: RootState) => state.plans);

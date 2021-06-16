import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { loadAndAddPlansFromDb } from './plansSlice';
import { loadAndAddWeeksFromDb } from './weeksSlice';
import { loadAndAddWorkoutsFromDb } from './workoutsSlice';

interface App {
  selectedPlanId: string;
  loading: boolean;
  sidebarVisible: boolean;
}

const initialState: App = {
  selectedPlanId: '',
  loading: true,
  sidebarVisible: false,
};

export const initializeData = createAsyncThunk<
  void,
  undefined,
  {
    dispatch: AppDispatch;
  }
>('app/initializeData', async (_, thunkApi) => {
  await thunkApi.dispatch(loadAndAddPlansFromDb());
  await thunkApi.dispatch(loadAndAddWorkoutsFromDb());
  await thunkApi.dispatch(loadAndAddWeeksFromDb());
  thunkApi.dispatch(appLoadingCompleted());
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    selectedPlanIdUpdated: (state, action: PayloadAction<string>) => {
      state.selectedPlanId = action.payload;
    },
    appLoadingCompleted: (state) => {
      state.loading = false;
    },
    sidebarVisibilitySet: (state, action: PayloadAction<boolean>) => {
      state.sidebarVisible = action.payload;
    },
  },
});

export const { selectedPlanIdUpdated, appLoadingCompleted, sidebarVisibilitySet } = appSlice.actions;

export default appSlice.reducer;

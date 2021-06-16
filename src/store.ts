import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appSlice from './features/appSlice';
import plansSlice from './features/plansSlice';
import settingsSlice from './features/settingsSlice';
import weeksSlice from './features/weeksSlice';
import workoutsSlice from './features/workoutsSlice';

const rootReducer = combineReducers({
  app: appSlice,
  settings: settingsSlice,
  workouts: workoutsSlice,
  plans: plansSlice,
  weeks: weeksSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

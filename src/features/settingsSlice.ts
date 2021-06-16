import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Unit, WeekDay } from './types';

// TODO: implement settings ui
interface Settings {
  units: Unit;
  weekStarts: WeekDay;
}

const initialState: Settings = {
  units: Unit.Km,
  weekStarts: WeekDay.Monday,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateUnits: (state, action: PayloadAction<Unit>) => {
      state.units = action.payload;
    },
    updateWeekStarts: (state, action: PayloadAction<WeekDay>) => {
      state.weekStarts = action.payload;
    },
  },
});

export const { updateUnits, updateWeekStarts } = settingsSlice.actions;

export default settingsSlice.reducer;

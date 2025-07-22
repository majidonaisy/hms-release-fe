import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface currencyState {
  currency: string | null;
}

const initialState: currencyState = {
  currency: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<{ currency: string }>) => {
      state.currency = action.payload.currency;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
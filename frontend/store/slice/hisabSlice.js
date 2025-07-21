import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hisabs: [],
};

const hisabsSlice = createSlice({
  name: 'hisabs',
  initialState,
  reducers: {
    setHisabs: (state, action) => {
      state.hisabs = action.payload;
    },
    addHisab: (state, action) => {
      state.hisabs.push(action.payload);
    },
    updateHisab: (state, action) => {
      const { id, transactions  } = action.payload;
      state.hisabs = state.hisabs.map(hisab => hisab.id === id ? { ...hisab, transactions: [...hisab.transactions, transactions] } : hisab);
    },
    deleteHisab: (state, action) => {
      state.hisabs = state.hisabs.filter(hisab => hisab.id !== action.payload);
    },
  },
});

export const { setHisabs, addHisab, updateHisab, deleteHisab } = hisabsSlice.actions;
export default hisabsSlice.reducer;
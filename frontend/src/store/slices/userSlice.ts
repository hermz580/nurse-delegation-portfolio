import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: any | null;
  progress: any | null;
}

const initialState: UserState = {
  profile: null,
  progress: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    setProgress: (state, action: PayloadAction<any>) => {
      state.progress = action.payload;
    },
  },
});

export const { setProfile, setProgress } = userSlice.actions;
export default userSlice.reducer;

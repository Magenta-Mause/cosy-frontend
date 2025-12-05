import {combineReducers} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useSelector} from "react-redux";
import {gameServerSliceReducer} from "@/stores/slices/gameServerSlice.ts";
import type {RootState} from ".";
import {userSliceReducer} from "@/stores/slices/userSlice.ts";
import {userInviteSliceReducer} from "@/stores/slices/userInviteSlice.ts";

const appReducer = combineReducers({
  gameServerSliceReducer,
  userInviteSliceReducer,
  userSliceReducer
});

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default appReducer;

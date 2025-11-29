import {combineReducers} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useSelector} from "react-redux";
import type {RootState} from ".";
import {gameServerConfigurationSliceReducer} from "@/stores/slices/gameServerConfigurationSlice.ts";

const appReducer = combineReducers({
  gameServerConfigurationSliceReducer
});

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default appReducer;

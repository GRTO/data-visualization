import { createSelector } from "@ngrx/store";

export const selectMapState = state => state.map;

export const getMap = createSelector(
    selectMapState,
    map => map
);

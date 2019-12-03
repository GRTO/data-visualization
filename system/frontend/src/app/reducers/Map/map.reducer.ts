import { IGeoJson } from './map.model';
import { MapsActions, MapActionTypes } from './map.actions';

export interface MapState {
    map: IGeoJson
};

export const initialMapState: MapState = {
    map: undefined,
};

export function MapReducer(state = initialMapState, action: MapsActions) : MapState {
    switch(action.type) {
        case MapActionTypes.getMap: 
            return {
                map: action.payload.map
            }
        default: 
            return state;
    }
}

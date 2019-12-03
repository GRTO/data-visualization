import { Action } from '@ngrx/store';
import { IGeoJson } from './map.model';

export enum MapActionTypes {
  getMap = '[Map] Get Map Filters',
}

export class Maps implements Action {
  readonly type = MapActionTypes.getMap;

  constructor(public payload: {map: IGeoJson}) {
  }
}


export type MapsActions = Maps;

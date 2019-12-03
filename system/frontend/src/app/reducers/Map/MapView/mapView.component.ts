import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "src/assets/departements.json";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ConfigLeaflet } from 'src/app/shared/config/config';
import { FeatureCollection } from 'geojson';

interface IOption {
  id: number;
  description: string;
}

@Component({
  selector: "app-map",
  templateUrl: "./mapView.component.html",
})

export class MapComponent {
  // List options
  formCtrl = new FormControl();
  optionList$: Observable<IOption[]>;

  optionList = [{id: 1, description: 'Field 1'}, {id: 2, description: 'Analista 2'}];
  
  map: L.Map;
  json;
  options;

  constructor(private http: HttpClient, configLeaflet: ConfigLeaflet) {
    this.options = configLeaflet.getOptionsLeaflet();
    this.optionList$ = this.formCtrl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterInput(option) : this.optionList.slice())
      );
  }

  private _filterInput(value: string): IOption[] {
    const filterValue = value.toLowerCase();
    const mapJ = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [
                  -78.046875,
                  -5.7908968128719565
                ],
                [
                  -75.849609375,
                  -9.622414142924805
                ],
                [
                  -74.267578125,
                  -5.00339434502215
                ],
                [
                  -77.607421875,
                  -5.878332109674314
                ],
                [
                  -78.046875,
                  -5.7908968128719565
                ]
              ]
            ]
          }
        }
      ]
    }
    L.geoJSON(<FeatureCollection> mapJ).addTo(this.map);
    return this.optionList.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  onMapReady(map: L.Map) {
    this.json = jsonObject;
    L.geoJSON(this.json).addTo(map);
    this.map = map;
  }
}
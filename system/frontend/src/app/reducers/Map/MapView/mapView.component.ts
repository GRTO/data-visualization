import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "src/assets/departements.json";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap, switchMap } from 'rxjs/operators';
import { ConfigLeaflet } from 'src/app/shared/config/config';
import { FeatureCollection } from 'geojson';
import { FilterService } from 'src/app/shared/services/filter.service';

interface IOption {
  id: number;
  description: string;
}

@Component({
  selector: "app-map",
  templateUrl: "./mapView.component.html",
})

export class MapComponent {
  FORM_FIELD = {};
  // List options
  optionList$: Observable<IOption[]>;
  // observable
  observableForm$: Observable<any>;

  form: FormGroup;

  optionList = [{ id: 1, description: 'Field 1' }, { id: 2, description: 'Analista 2' }];

  map: L.Map;
  json;
  options;

  constructor(private http: HttpClient, configLeaflet: ConfigLeaflet, public fb: FormBuilder, filterService: FilterService) {
    // Get map
    this.options = configLeaflet.getOptionsLeaflet();
    // Bulding Form
    this.FORM_FIELD = {
      formCtrl: [null],
      credit: [null],
      debit: [null],
      transactions: [null],
      amount: [null],
      male: [null],
      female: [null],
    }
    this.form = this.fb.group(this.FORM_FIELD);

    // Filter options
    this.optionList$ = this.formCtrl.valueChanges
      .pipe(
        startWith(''),
        map(option => option ? this._filterInput(option) : this.optionList.slice())
      );
    // Call backend
    const formChanges$ = this.form.valueChanges.pipe(
      switchMap(form => filterService.GetFilters(form))
    );
    formChanges$.subscribe(); // Fixme: Adding to map values
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
    L.geoJSON(<FeatureCollection>mapJ).addTo(this.map);
    return this.optionList.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  onMapReady(map: L.Map) {
    this.json = jsonObject;
    L.geoJSON(this.json).addTo(map);
    this.map = map;
  }

  // Getters
  get formCtrl() { return this.form.get('formCtrl') };
  get credit() { return this.form.get('credit') };
  get debit() { return this.form.get('debit') };
  get transactions() { return this.form.get('transactions') };
  get amount() { return this.form.get('amount') };
  get male() { return this.form.get('male') };
  get female() { return this.form.get('female') };
}
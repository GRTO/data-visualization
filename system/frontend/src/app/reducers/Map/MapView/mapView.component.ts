import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "src/assets/departements.json";
import jsonLince from "src/assets/lince.json";
import jsonSJL from "src/assets/sjl.json";
import jsonMerchantType from "src/assets/merchantType.json";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, tap, switchMap } from 'rxjs/operators';
import { ConfigLeaflet } from 'src/app/shared/config/config';
import { FeatureCollection, MultiPolygon } from 'geojson';
import { FilterService } from 'src/app/shared/services/filter.service';

interface IOption {
  id: string;
  description: string;
}

@Component({
  selector: "app-map",
  templateUrl: "./mapView.component.html",
})

export class MapComponent {
  // Polygons
  lincePolygon = L.geoJSON(<MultiPolygon> jsonLince).setTooltipContent('Lince');
  sjlPolygon = L.geoJSON(<MultiPolygon> jsonSJL).setStyle({color: 'green'});
  centerSJL = L.marker([-11.9819111,-76.9963552]).bindTooltip('San Juan de Lurigancho', {direction: 'right'});
  centerLince = L.marker([-12.0839797,-77.036239]).bindTooltip('Lince', {direction: 'right'});

  objLincePolygon;
  objSJLPolygon;
  objCenterSJL;
  objCenterLince;
  // --------
  FORM_FIELD = {};
  // List options
  optionList$: Observable<IOption[]>;
  // observable
  observableForm$: Observable<any>;

  form: FormGroup;

  optionList = jsonMerchantType;

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
      startDate: [null],
      endDate: [null],
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
      switchMap(form => filterService.GetFilters(form)),
      tap(({ result }) => {
        this.lincePolygon.bindTooltip(`La cantidad en lince fue de ${result.Lince[0] !== null ? result.Lince[0] : 0}`).addTo(this.map);
        this.sjlPolygon.bindTooltip(`La cantidad en SJL fue de ${result.SJL[0] !== null ? result.SJL[0] : 0}`).addTo(this.map);
      }),
    );
    formChanges$.subscribe();
  }

  private _filterInput(value: string): IOption[] {
    const filterValue = value.toLowerCase();
    return this.optionList.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
  }

  onMapReady(map: L.Map) {
    this.json = jsonObject;
    this.objLincePolygon = this.lincePolygon.addTo(map);
    this.objSJLPolygon = this.sjlPolygon.addTo(map);
    this.objCenterSJL = this.centerSJL.addTo(map);
    this.objCenterLince = this.centerLince.addTo(map);
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
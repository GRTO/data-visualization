import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "src/assets/departements.json";
import jsonLince from "src/assets/lince.json";
import jsonSJL from "src/assets/sjl.json";
import jsonTops from "src/assets/tops.json";
import jsonMerchantType from "src/assets/merchantType.json";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { Observable, from } from "rxjs";
import { map, startWith, tap, switchMap } from "rxjs/operators";
import { ConfigLeaflet } from "src/app/shared/config/config";
import { FeatureCollection, MultiPolygon } from "geojson";
import { FilterService } from "src/app/shared/services/filter.service";
import { Options, LabelType, ChangeContext } from 'ng5-slider';
import moment from 'moment';
import 'moment/locale/pt-br';

interface IOption {
  id: string;
  description: string;
}

interface ITop {
  id: number;
  description: string;
}

@Component({
  selector: "app-map",
  templateUrl: "./mapView.component.html"
})
export class MapComponent {
  // Polygons
  lincePolygon = L.geoJSON(<MultiPolygon>jsonLince).setTooltipContent("Lince");
  sjlPolygon = L.geoJSON(<MultiPolygon>jsonSJL).setStyle({ color: "green" });
  centerSJL = L.marker([
    -11.9819111,
    -76.9963552
  ]).bindTooltip("San Juan de Lurigancho", { direction: "right" });
  centerLince = L.marker([-12.0839797, -77.036239]).bindTooltip("Lince", {
    direction: "right"
  });

  // Slider
  listDates = this.getListDates();
  minValue = 0;
  maxValue = this.listDates.length;
  optionsSlider: Options = {
    floor: 0,
    ceil: 1820,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min Date:</b> ' + this.listDates[value];
        case LabelType.High:
          return '<b>Max Date:</b> ' + this.listDates[value];
        default:
          return this.listDates[value];
      }
    }
  };

  objLincePolygon;
  objSJLPolygon;
  objCenterSJL;
  objCenterLince;
  // --------
  FORM_FIELD = {};
  FORM_FIELD_MICRO = {};
  // List options
  optionList$: Observable<IOption[]>;
  optionTopList$: Observable<ITop[]>;
  // observable
  observableForm$: Observable<any>;

  form: FormGroup;
  formMicro: FormGroup;

  optionList = jsonMerchantType;
  optionTopsList = jsonTops;

  map: L.Map;
  json;
  options;

  constructor(
    private http: HttpClient,
    configLeaflet: ConfigLeaflet,
    public fb: FormBuilder,
    filterService: FilterService
  ) {
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
      endDate: [null]
    };
    this.FORM_FIELD_MICRO = {
      type_consult: [null],
      plac: [false],
    };
    this.form = this.fb.group(this.FORM_FIELD);
    this.formMicro = this.fb.group(this.FORM_FIELD_MICRO);

    // Filter options
    this.optionList$ = this.formCtrl.valueChanges.pipe(
      startWith(""),
      map(option =>
        option ? this._filterInput(option) : this.optionList.slice()
      )
    );
    this.optionTopList$ = from([this.optionTopsList]);
    // Call backend
    const formChanges$ = this.form.valueChanges.pipe(
      switchMap(form => filterService.GetFilters(form)),
      tap(({ result }) => {
        this.lincePolygon
          .bindTooltip(
            `La cantidad en lince fue de ${
              result.Lince[0] !== null ? result.Lince[0] : 0
            }`
          )
          .addTo(this.map);
        this.sjlPolygon
          .bindTooltip(
            `La cantidad en SJL fue de ${
              result.SJL[0] !== null ? result.SJL[0] : 0
            }`
          )
          .addTo(this.map);
      })
    );
    formChanges$.subscribe();

    const formMicroChanges$ = this.formMicro.valueChanges.pipe(
      map(result => ({
          ...result,
          ...{
            formCtrl: this.formCtrl.value,
            startDate: this.startDate.value,
            endDate: this.endDate.value
          }
      })),
      switchMap(form => filterService.GetMicroFilters(form)),
      tap((data) => {
        const geoJsonOb = {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {
                "title": "DESARROLLO GLOBAL",
                "value": 1,
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -76.95373535156249,
                  -11.958723393646638
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -76.86035156249999,
                  -12.162855874337241
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -76.7669677734375,
                  -11.89422836054339
                ]
              }
            },
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -76.61865234374999,
                  -12.082295837363578
                ]
              }
            }
          ]
        }
        L.geoJSON(<FeatureCollection>data).addTo(this.map);
      })
    );
    formMicroChanges$.subscribe();
  }

  private _filterInput(value: string): IOption[] {
    const filterValue = value.toLowerCase();
    return this.optionList.filter(
      option => option.description.toLowerCase().indexOf(filterValue) === 0
    );
  }

  getListDates () {
    const dateStart = moment("2015-01-01");
    const data = [dateStart];
    for(let i = 1; i < 1825; i++) {
      data.push(data[i - 1].clone().add(1, 'd'));
    }
    const dataChanged = [];
    for(let j = 0; j < data.length; j++) {
      dataChanged.push(data[j].format('YYYY-MM-DD'));
    }
    return dataChanged;
  }

  onMapReady(map: L.Map) {
    this.json = jsonObject;
    this.objLincePolygon = this.lincePolygon.addTo(map);
    this.objSJLPolygon = this.sjlPolygon.addTo(map);
    this.objCenterSJL = this.centerSJL.addTo(map);
    this.objCenterLince = this.centerLince.addTo(map);
    this.map = map;
  }

  onChange(changeContext: ChangeContext): void {
    const minValue = changeContext.value;
    const highValue = changeContext.highValue;
    this.endDate.setValue(this.listDates[highValue]);
    this.startDate.setValue(this.listDates[minValue]);
    this.plac.setValue(!this.plac.value);
  }

  // Getters
  get formCtrl() {
    return this.form.get("formCtrl");
  }
  get credit() {
    return this.form.get("credit");
  }
  get debit() {
    return this.form.get("debit");
  }
  get transactions() {
    return this.form.get("transactions");
  }
  get amount() {
    return this.form.get("amount");
  }
  get male() {
    return this.form.get("male");
  }
  get female() {
    return this.form.get("female");
  }
  get type_consult() {
    return this.formMicro.get("type_consult");
  }
  get startDate() {
    return this.form.get("startDate");
  }
  get endDate() {
    return this.form.get("endDate");
  }
  get plac() {
    return this.formMicro.get("plac");
  }
}

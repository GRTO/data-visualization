import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "../assets/departements.json";
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ConfigLeaflet } from './shared/config/config';
import { FeatureCollection } from 'geojson';
import { setTheme } from 'ngx-bootstrap/utils';

interface IOption {
  id: number;
  description: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})

export class AppComponent {
  constructor(private http: HttpClient, configLeaflet: ConfigLeaflet) {
    setTheme('bs4');
  }
}
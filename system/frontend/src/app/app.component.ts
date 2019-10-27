import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import jsonObject from "../assets/departements.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"]
})
export class AppComponent {
  map: L.Map;
  json;
  options = {
    layers: [
      L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: ""
      })
    ],
    zoom: 7,
    center: L.latLng(47.482019, -1)
  };

  constructor(private http: HttpClient) {}

  onMapReady(map: L.Map) {
    this.json = jsonObject;
    L.geoJSON(this.json).addTo(map);
  }
}
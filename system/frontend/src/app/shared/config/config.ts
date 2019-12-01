import { Injectable } from '@angular/core';
import * as L from "leaflet";

@Injectable()
export class ConfigLeaflet {
    private options = {
        layers: [
            L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 18,
                attribution: ""
            })
        ],
        zoom: 7,
        center: L.latLng(70.482019, -1)
    };

    constructor() {
    }

    public getOptionsLeaflet() {
        return this.options;
    }
}
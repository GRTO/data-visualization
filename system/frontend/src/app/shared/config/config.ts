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
        center: L.latLng(-9.1899672, -75.015152)
    };

    constructor() {
    }

    public getOptionsLeaflet() {
        return this.options;
    }
}
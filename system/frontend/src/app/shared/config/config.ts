import { Injectable } from '@angular/core';
import * as L from "leaflet";

@Injectable()
export class ConfigLeaflet {
    private options = {
        layers: [
            L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                minZoom: 11,
                attribution: ""
            })
        ],
        zoom: 7,
        center: L.latLng(-12.046374, -77.042793)
    };

    constructor() {
    }

    public getOptionsLeaflet() {
        return this.options;
    }
}
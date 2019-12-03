import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './MapView/mapView.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import * as fromMap from './map.reducer';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ConfigLeaflet } from 'src/app/shared/config/config';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([{path: '', component: MapComponent}]),
        StoreModule.forFeature('maps', fromMap.MapReducer),
        LeafletModule.forRoot(),
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
    ],
    declarations: [MapComponent],
    providers: [
      ConfigLeaflet,
    ],
    exports: [MapComponent]
})
export class MapModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: MapModule
        }
    }
}

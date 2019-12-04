import { NgModule } from '@angular/core';
import { ConfigLeaflet } from './config/config';
import { FilterService } from './services/filter.service';

@NgModule({
    declarations: [
    ],
    providers: [
      ConfigLeaflet,
      FilterService,
    ],
})

export class SharedModule {
}
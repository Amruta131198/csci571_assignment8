import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes} from '@angular/router'
import { EventPageComponent } from './event-page/event-page.component'
import { FavouritePageComponent } from './favourite-page/favourite-page.component'

// generate routes
const routes:Routes = [
  { path:'search', component: EventPageComponent },
  { path:'favourite', component: FavouritePageComponent }
]

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes)

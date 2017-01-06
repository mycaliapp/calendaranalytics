import {Component, View} from 'angular2/angular2';
import {Router, RouteConfig, RouterLink, RouterOutlet} from 'angular2/router';
import {Inject} from 'angular2/di';
import {Appointments} from '../views/appointments';
import {Header} from '../views/header';
import {Calendars} from '../views/calendars';

import { _settings } from '../../settings';
import {Home} from '../home/home';
import {Add} from '../add/add';

@Component({
  selector: 'my-app'
})
@View({
  templateUrl: _settings.buildPath + '/components/app/app.html',
  //directives: [RouterLink, RouterOutlet, Appointments]
  directives: [Header, Calendars]
})
export class MyApp {
  // constructor(@Inject(Router) router: Router) {
  //   router.config([
  //     { path: '', as: 'home', component: Home },
  //     { path: '/add', as: 'add', component: Add },
  //     { path: '', as: 'appointment', component: Appointments}
  //   ]);
  // }
}

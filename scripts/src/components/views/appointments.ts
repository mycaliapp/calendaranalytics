
/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {AppointmentsService} from '../../services/appointmentsservice';
import {AuthenticationService} from '../../services/authenticationservice';
import {Calendars} from '../views/calendars';
import { _settings } from '../../settings';

declare var jQuery: any;


@Component({
	selector: 'a2os-appointments'
})
@View({
	templateUrl: _settings.buildPath +'/components/views/appointments.html',	
	directives: [NgFor, NgIf]
})
export class Appointments{
	appointments: Array<string>;	
	authenticationService: AuthenticationService;
	calendarid: string;
	appointmentService: AppointmentsService;

	constructor(appointmentService: AppointmentsService, authenticationService: AuthenticationService){
		// initial				
		this.authenticationService = authenticationService;
		this.appointmentService = appointmentService;		
	}
	
}
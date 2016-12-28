
/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {AppointmentsService} from '../../services/appointmentsservice';
import {AuthenticationService} from '../../services/authenticationservice';
import { _settings } from '../../settings';


@Component({
	selector: 'a2os-appointments'
})
@View({
	templateUrl: _settings.buildPath +'/components/views/appointments.html',	
	directives: [NgFor, NgIf]
})
export class Appointments {
	appointments: Array<string>;
	calendarlist: Array<string>;
	authenticationService: AuthenticationService;
	appointmentService: AppointmentsService;

	constructor(appointmentService: AppointmentsService, authenticationService: AuthenticationService){
		// initial
		this.appointments = ['please refresh view'];
		this.calendarlist = ['please refresh view'];
		this.authenticationService = authenticationService;
		this.appointmentService = appointmentService;
	}

	refreshAppointments() {
		/*
		 * loading the appointments is done asychronously. the service's loadAppointments() method
		 * returns a Promise that provides access to the newly loaded set of appointments. Updating
		 * the array of appointments triggers angular's one-way-binding between the field and the 
		 * widget.
		 */	
		this.appointmentService.loadCalendarlists().then((newcalendars) => {			
			// clean the array of existing calendars
			this.calendarlist.splice(0, this.calendarlist.length);
			// copy all new items to the array of existing calendars
			this.calendarlist.push.apply(this.calendarlist, newcalendars);
			console.log('displaying ' + this.calendarlist.length + ' calendars')
		});	
		this.appointmentService.loadAppointments().then((newAppointments) => {
			// clean the array of existing appointments			
			this.appointments.splice(0, this.appointments.length);
			// copy all new items to the array of existing appointments
			this.appointments.push.apply(this.appointments, newAppointments);
			console.log('displaying ' + this.appointments.length + ' appointments')
		});
	}


}
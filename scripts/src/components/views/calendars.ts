/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import { Component, View, NgFor, NgIf, ElementRef } from 'angular2/angular2';
import { Appointments } from '../views/appointments';
import { AuthenticationService } from '../../services/authenticationservice';
import { AppointmentsService } from '../../services/appointmentsservice';
import { CalendarService } from '../../services/calendarService';
import { _settings } from '../../settings';

@Component({
    selector: 'calendars'      
})
@View({
    templateUrl: _settings.buildPath + '/components/views/calendars.html',
    directives: [NgFor, NgIf, Appointments]
})

export class Calendars{
    calendarlist: Array<Object>;
    appointments: Array<Object>;
    calendarid: string;
    calendar: string;
    timemin: Date;
    timemax: Date;
    rangetime: string;
    authenticationService: AuthenticationService;
    calendarService: CalendarService;
    appointmentService: AppointmentsService;
    attendees: Array<Object>;
    most: string;
    
    constructor(authenticationService: AuthenticationService, calendarService: CalendarService, appointmentService: AppointmentsService, private elementRef:ElementRef) {
        this.calendarlist = [{ summary: 'Please refresh view', id: 'none' }];
        this.attendees = [{email: '', invitenum: 0}];
		this.most = '0';
        this.appointments = [{id: 0, meeting: '', title: 'Please select calendar', time: 0, invite: 0, attendees: []}];
        this.timemin = new Date();
        this.timemax = new Date();
        this.timemax.setHours(23, 59, 59);
        this.timemin.setHours(0, 0, 0);
        this.authenticationService = authenticationService;
        this.appointmentService = appointmentService;
        this.calendarService = calendarService;      
    }

    refreshAppointments() {
		/*
		 * loading the appointments is done asychronously. the service's loadAppointments() method
		 * returns a Promise that provides access to the newly loaded set of appointments. Updating
		 * the array of appointments triggers angular's one-way-binding between the field and the 
		 * widget.
		 */
        this.calendarService.loadCalendarlists().then((newcalendars) => {
            // clean the array of existing calendars
            this.calendarlist.splice(0, this.calendarlist.length);
            // copy all new items to the array of existing calendars
            this.calendarlist.push.apply(this.calendarlist, newcalendars);
            console.log('displaying ' + this.calendarlist.length + ' calendars')
        });
    }

    public viewevents(){
        this.appointmentService.loadAppointments(this.calendarid, this.timemax, this.timemin).then((newAppointments) => {
            // clean the array of existing appointments			
            this.appointments.splice(0, this.appointments.length);
            this.attendees.splice(0, this.attendees.length);
            // copy all new items to the array of existing appointments
            this.appointments.push.apply(this.appointments, newAppointments);
            this.attendees.push.apply(this.attendees, this.appointmentService.attendees);                        
            console.log('displaying ' + this.appointments.length + ' appointments')
            var max;
            var temp;
            this.most = '0';
            if(this.attendees.length != 0){
                max = this.attendees[0].invitenum;
                for (var i = 1; i < this.attendees.length; i++){
                    if(max < this.attendees[i].invitenum){
                        max = this.attendees[i].invitenum;
                    }                    
                }
                console.log("max" + max);
                for (var i = 0; i < this.attendees.length; i++){
                    if (this.attendees[i].invitenum == max){
                        this.most = this.most + "   " + this.attendees[i].email;
                    }
                }
            }
        });        
    }
    
    rangefilter(value: string) {        
         var min;
         var max;
         var d = value.split(" ~ ");
         min = d[0];
         max = d[1];         
         this.timemin = new Date(min);
         this.timemax = new Date(max);
         this.viewevents();
         console.log(this.timemin);
         console.log(this.timemax);
    }
    

    public setdata(){
        
        alert('It works!');
    }
    selectcalendar(calendar) {
        this.calendarid = calendar.id;
        this.calendar = calendar.summary;
        console.log(this.calendarid);
        this.viewevents();        
    }
    setdate(datarange) {
        this.timemax = new Date();
        this.timemin = new Date();
        if (datarange == 'lastmonth') {
            var date = new Date();
            var lastmonth = date.getMonth() - 1;
            this.timemax.setMonth(lastmonth + 1);
            this.timemin.setMonth(lastmonth);
            this.timemax.setDate(0);
            this.timemin.setDate(1);
           
        }
        if (datarange == 'lastweek') {
            var date = new Date();           
            this.timemin.setDate(date.getDate() - 7);           
            this.timemax.setHours(23, 59, 59);
            this.timemin.setHours(0, 0, 0);           
        }
        if (datarange == 'lastday') {
            var date = new Date();
            var lastday = date.getDate() - 1;            
            this.timemax.setDate(lastday);
            this.timemin.setDate(lastday);
            this.timemax.setHours(23, 59, 59);
            this.timemin.setHours(0, 0, 0);
            
        }
        if (datarange == 'today') {
            var date = new Date();
            var today = date.getDate();            
            this.timemax.setDate(today);
            this.timemin.setDate(today);
            this.timemax.setHours(23, 59, 59);
            this.timemin.setHours(0, 0, 0);
            
        }
        if (datarange == 'nextday') {
            var date = new Date();
            var nextday = date.getDate() + 1;                   
            this.timemax.setDate(nextday);
            this.timemin.setDate(nextday);
            this.timemax.setHours(23, 59, 59);
            this.timemin.setHours(0, 0, 0);            
        }
        if (datarange == 'nextweek') {
            var date = new Date();                      
            this.timemax.setDate(date.getDate() + 7);           
            this.timemax.setHours(23, 59, 59);
            this.timemin.setHours(0, 0, 0);           
        }
        if (datarange == 'nextmonth') {
            var date = new Date();
            var nextmonth = date.getMonth() + 1;
            if (date.getMonth() == 11){
                this.timemax.setMonth(0);
                this.timemax.setDate(31);
                this.timemax.setFullYear(date.getFullYear() + 1);
            } 
            else{
                this.timemax.setMonth(nextmonth + 1);
                this.timemax.setDate(0);
            }                       
            this.timemin.setMonth(nextmonth);            
            this.timemin.setDate(1);            
        }

        console.log(this.timemax);
         console.log(this.timemin);

        console.log(this.calendarid);
        this.viewevents();

    }

}
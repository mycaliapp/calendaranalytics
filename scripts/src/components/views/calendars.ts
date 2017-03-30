/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import {Component, View, NgFor, NgIf, ElementRef} from 'angular2/angular2';
import {Appointments} from '../views/appointments';
import {AuthenticationService} from '../../services/authenticationservice';
import {AppointmentsService} from '../../services/appointmentsservice';
import {CalendarService} from '../../services/calendarService';
import {_settings} from '../../settings';

@Component({selector: 'calendars'})
@View({
    templateUrl: _settings.buildPath + '/components/views/calendars.html',
    directives: [NgFor, NgIf, Appointments]
})

export class Calendars {
    calendarlist : Array < Object >;
    appointments : Array < Object >;
    calendarid : string;
    calendar : string;
    timemin : Date;
    timemax : Date;
    rangetime : string;
    authenticationService : AuthenticationService;
    calendarService : CalendarService;
    appointmentService : AppointmentsService;
    attendees : Array < Object >;
    most : string;
    mode : string;
    meeting : string;
    message : HTMLElement;
    daycount : number;
    weekcouunt : number;

    constructor(authenticationService : AuthenticationService, calendarService : CalendarService, appointmentService : AppointmentsService, private elementRef : ElementRef) {
        this.calendarlist = [
            {
                summary: 'Please refresh view',
                id: 'none'
            }
        ];
        this.attendees = [
            {
                email: '',
                invitenum: 0
            }
        ];
        this.most = '0';
        this.appointments = [
            {
                id: 0,
                meeting: '',
                title: 'No upcoming events found',
                duration: '',
                time: 0,
                invite: 0,
                attendees: [],
                str_attendees: ''
            }
        ];
        this.timemin = new Date();
        this.timemax = new Date();
        this
            .timemax
            .setHours(23, 59, 59);
        this
            .timemin
            .setHours(0, 0, 0);
        this.authenticationService = authenticationService;
        this.appointmentService = appointmentService;
        this.calendarService = calendarService;
        this.mode = 'Individual calendar mode';
        this.meeting = '';
        this.daycount = 0;
        // this.weekcount = 0;
        // this.refreshAppointments(); this.message = <h4> + 'Send message' + </h4>
        var d = new Date();       
        console.log(d.getHours());
        var my = setInterval(() => {
            var day = new Date();
            if (day.getHours() == 15) {
                this.authenticationService.login();                
                this.getmeetingdata('day');
                clearInterval(my);                
            }
            if (day.getDay() == 0 && day.getHours() == 7) {
                this.getmeetingdata('week');
            }

        }, 480000);
    }

    createevent(calid){
        gapi.client.calendar.events.insert(
            
        )
    }

    getmeetingdata(str) {
        var day = new Date();
        var min = new Date();
        var max = new Date();
        var t_max = new Date();
        var t_min = new Date();
        if (str == 'day') {
             min.setDate(day.getDate() - 1);             
        } else {
            min.setDate(day.getDate() - 7)
            t_max.setDate(day.getDate() + 6);
        }
        max.setDate(day.getDate() - 1);
        t_max.setHours(23, 59, 59);
        t_min.setHours(0, 0, 0);        
        min.setHours(0, 0, 0);       
        max.setHours(23, 59, 59);       
        var app_send = new Array();
        var app = this;
        this
            .calendarService
            .loadCalendarlists()
            .then((newcalendars) => {                
                this
                    .calendarlist
                    .splice(0, this.calendarlist.length);                
                this
                    .calendarlist
                    .push
                    .apply(this.calendarlist, newcalendars);
                var i = 0;               
                var appoint = this.appointmentService;
                var calendars = this.calendarlist;
                var app_now = new Array();
                var t_appointment = this.appointmentService;
                var t_cals = this.calendarlist;
                var time_delay = setInterval(function () {                   
                    appoint.loadAppointments(calendars[i]['id'], max, min).then((newAppointments) => {                        
                        app_send
                            .push
                            .apply(app_send, newAppointments);                        
                        i++;
                    });            
                    t_appointment.loadAppointments(calendars[i]['id'], t_max, t_min).then((newAppointments) => {                        
                        app_now
                            .push
                            .apply(app_now, newAppointments);                                 
                    });                   
                    if (i == calendars.length - 1) {
                        clearInterval(time_delay);
                        app.send(app_send, app_now, str);
                        i = 0;
                    }

                }, 800);                         
            });
    }

    send(last_obj, now_obj, str) {        
        var ev_last = '';
        var ev_now = '';
        console.log(last_obj.length + ", " + now_obj.length);
        for (var i = 0 ; i < last_obj.length; i++) {
            ev_last = ev_last + '<tr><td align="center">' + last_obj[i]['title'] + '</td>' +
                '<td align="center">' + last_obj[i]['meeting'] + '</td>' +
                '<td align="center">' + last_obj[i]['str_attendees'] + '</td>' +
                '<td align="center">' + last_obj[i]['duration'] + '</td>' +
                '<td align="center">' + last_obj[i]['time'] + '</td>' +
                '<td align="center">' + last_obj[i]['invite'] + '</td></tr>';
        }

        for (var i = 0 ; i < now_obj.length; i++) {
            ev_now = ev_now + '<tr><td align="center">' + now_obj[i]['title'] + '</td>' +
                '<td align="center">' + now_obj[i]['meeting'] + '</td>' +
                '<td align="center">' + now_obj[i]['str_attendees'] + '</td>' +
                '<td align="center">' + now_obj[i]['duration'] + '</td>' +
                '<td align="center">' + now_obj[i]['time'] + '</td>' +
                '<td align="center">' + now_obj[i]['invite'] + '</td></tr>';
        }
        var day_string;
        if (str == 'week') {
            day_string = 'next week'; 
        } else {
            day_string = 'today';
        }

        var message = '<html><body><h3 style="color: #337ab7">Your last ' + str + ' meetings</h3>' + 
               '<table padding="6px"><thead style="color: deeppink"><th align="center">Name</th><th align="center">Company</th><th align="center">Attendees</th><th align="center">Duration</th>' +
               '<th align="center">Total time</th><th align="center">Number of Attendees</th></thead>' +
               '<tbody>' + ev_last + '</tbody></table>' + '</br></br>' +         
               '<h3 style="color: #337ab7">Your ' + day_string + ' meetings</h3>' +
               '<table padding="6px"><thead style="color: deeppink"><th align="center">Name</th><th align="center">Company</th><th align="center">Attendees</th align="center"><th>Duration</th>' +
               '<th align="center">Total time</th><th align="center">Number of Attendees</th></thead>' +
               '<tbody>' + ev_now + '</tbody></table></body></html>';             
        this.sendmessage({
            'To': "dorin0127@hotmail.com" + ", " + "pkpavlo27@yahoo.com",
            'subject': "Calendaranalytics",
            'content-type': 'text/html; charset="UTF-8'
         }, message)
    }
    sendmessage(headers_obj, message,) {
        var email = '';

        for (var header in headers_obj) 
            email += header += ": " + headers_obj[header] + "\r\n";
        
        email += "\r\n" + message;

        var sendRequest = gapi
            .client
            .gmail
            .users
            .messages
            .send({
                'userId': 'me',
                'resource': {
                    'raw': window
                        .btoa(email)
                        .replace(/\+/g, '-')
                        .replace(/\//g, '_')
                }
            });

        return sendRequest.execute();
    }

    refreshAppointments() {
        /*
		 * loading the appointments is done asychronously. the service's loadAppointments() method
		 * returns a Promise that provides access to the newly loaded set of appointments. Updating
		 * the array of appointments triggers angular's one-way-binding between the field and the
		 * widget.
		 */
        this
            .calendarService
            .loadCalendarlists()
            .then((newcalendars) => {
                // clean the array of existing calendars
                this
                    .calendarlist
                    .splice(0, this.calendarlist.length);
                // copy all new items to the array of existing calendars
                this
                    .calendarlist
                    .push
                    .apply(this.calendarlist, newcalendars);
                console.log('displaying ' + this.calendarlist.length + ' calendars')
            });
    }

    changemode(value) {
        if (value == "Merge") {
            this.mode = 'Merge calendar mode';
        } else {
            this.mode = 'Individual calendar mode';
            this.appointmentService.totalEvent = 0;
            this.appointmentService.totalTime = 0;
            $('.btn-calendar').removeClass('checked');
        }
    }

    public viewevents(calendarid) {
        this
            .appointmentService
            .loadAppointments(calendarid, this.timemax, this.timemin)
            .then((newAppointments) => {
                // clean the array of existing appointments
                if (this.mode == 'Individual calendar mode') {
                    this
                        .appointments
                        .splice(0, this.appointments.length);
                    this
                        .attendees
                        .splice(0, this.attendees.length);
                    this.most = '';
                }

                // copy all new items to the array of existing appointments
                this
                    .appointments
                    .push
                    .apply(this.appointments, newAppointments);
                this
                    .attendees
                    .push
                    .apply(this.attendees, this.appointmentService.attendees);
                console.log('displaying ' + this.appointments.length + ' appointments')

                if (this.mode == 'Individual calendar mode' && this.appointments.length == 0) {
                    this
                        .appointments
                        .push({title: 'No upcoming events found.', time: 0, invite: 0});
                }
                var max;
                var temp;
                this.most = '';
                if (this.attendees.length != 0) {
                    max = this.attendees[0].invitenum;
                    for (var i = 1; i < this.attendees.length; i++) {
                        if (max < this.attendees[i].invitenum) {
                            max = this.attendees[i].invitenum;
                        }
                    }
                    console.log("max" + max);
                    for (var i = 0; i < this.attendees.length; i++) {
                        if (this.attendees[i].invitenum == max) {
                            this.most = this.most + "   " + this.attendees[i].email;
                        }
                    }
                }
            });
    }

    rangefilter(value : string) {
        var min;
        var max;
        var d = value.split(" ~ ");
        min = d[0];
        max = d[1];
        this.timemin = new Date(min);
        this.timemax = new Date(max);
        this.viewevents(this.calendarid);
        console.log(this.timemin);
        console.log(this.timemax);
    }

    selectcalendar(calendar, index) {
        this.calendarid = calendar.id;
        this.calendar = calendar.summary;
        var id = '#' + index;
        console.log(index);
        if (this.mode == 'Merge calendar mode') {

            $(id).addClass('checked');
        } else {
            $('.btn-calendar').removeClass('checked');
        }
        console.log(this.calendarid + " Important!");
        this.viewevents(this.calendarid);
    }
    setdate(datarange) {
        this.timemax = new Date();
        this.timemin = new Date();
        if (datarange == 'lastmonth') {
            var date = new Date();
            var lastmonth = date.getMonth() - 1;
            this
                .timemax
                .setMonth(lastmonth + 1);
            this
                .timemin
                .setMonth(lastmonth);
            this
                .timemax
                .setDate(0);
            this
                .timemin
                .setDate(1);

        }
        if (datarange == 'lastweek') {
            this.daycount = this.daycount - 7;
            var date = new Date();
            this
                .timemin
                .setDate(date.getDate() + this.daycount);
            this
                .timemax
                .setDate(date.getDate() + this.daycount + 7)  
            this
                .timemax                
                .setHours(23, 59, 59);                     
            this
                .timemin
                .setHours(0, 0, 0);
        }
        if (datarange == 'lastday') {
            this.daycount = this.daycount - 1;
            var date = new Date();
            var lastday = date.getDate() + this.daycount;
            this
                .timemax
                .setDate(lastday);
            this
                .timemin
                .setDate(lastday);
            this
                .timemax
                .setHours(23, 59, 59);
            this
                .timemin
                .setHours(0, 0, 0);

        }
        if (datarange == 'today') {
            this.daycount = 0;
            var date = new Date();
            var today = date.getDate();
            this
                .timemax
                .setDate(today);
            this
                .timemin
                .setDate(today);
            this
                .timemax
                .setHours(23, 59, 59);
            this
                .timemin
                .setHours(0, 0, 0);

        }
        if (datarange == 'nextday') {
            this.daycount = this.daycount + 1;
            var date = new Date();
            var nextday = date.getDate() + this.daycount;
            this
                .timemax
                .setDate(nextday);
            this
                .timemin
                .setDate(nextday);
            this
                .timemax
                .setHours(23, 59, 59);
            this
                .timemin
                .setHours(0, 0, 0);
        }
        if (datarange == 'nextweek') {
            this.daycount = this.daycount + 7;
            var date = new Date();
            this
                .timemax
                .setDate(date.getDate() + this.daycount);
            this
                .timemax
                .setHours(23, 59, 59);
            this
                .timemin
                .setDate(date.getDate() + this.daycount - 7);
            this
                .timemin
                .setHours(0, 0, 0);
        }
        if (datarange == 'nextmonth') {
            var date = new Date();
            var nextmonth = date.getMonth() + 1;
            if (date.getMonth() == 11) {
                this
                    .timemax
                    .setMonth(0);
                this
                    .timemax
                    .setDate(31);
                this
                    .timemax
                    .setFullYear(date.getFullYear() + 1);
            } else {
                this
                    .timemax
                    .setMonth(nextmonth + 1);
                this
                    .timemax
                    .setDate(0);
            }
            this
                .timemin
                .setMonth(nextmonth);
            this
                .timemin
                .setDate(1);
        }

        console.log(this.timemax);
        console.log(this.timemin);

        console.log(this.calendarid);
        this.viewevents(this.calendarid);

    }

}
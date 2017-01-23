export class AppointmentsService {

				public totalEvent : number;
				public totalTime : number;
				public attendees : Array < Object >;
				public mostinvite : string;
				public meeting : string;
				public id;

				constructor() {
								this.id = 0;
								this.totalTime = 0;
								this.totalEvent = 0;
				}

				public unique_char(str)
				{
								var n = {},
												r = [];
								for (var i = 0; i < str.length; i++) {
												if (!n[str[i]]) {
																n[str[i]] = true;
																r.push(str[i]);
												}
								}
								return r;
				}

				loadAppointments(calendarid, timeMax, timeMin) {
								return new Promise((resolve, reject) => {
												var request = gapi
																.client
																.calendar
																.events
																.list({
																				'calendarId': calendarid,
																				'timeMax': timeMax.toISOString(),
																				'timeMin': timeMin.toISOString(),
																				'showDeleted': false,
																				'singleEvents': true,
																				'orderBy': 'startTime',
																				'past': true
																});

												request.execute((resp) => {
																var appointments = [];
																var events = resp.items;
																var totaltime = 0;
																var attendees;																
																this.attendees = [
																				{
																								email: '',
																								invitenum: 0
																				}
																];
																this
																				.attendees
																				.splice(0, this.attendees.length);
																var i;
																var id;
																if (events.length > 0) {
																				this.totalEvent += events.length;
																				id = 0;
																				for (i = 0; i < events.length; i++) {
																								var event = events[i];
																								var when_s = event.start.dateTime;
																								var when_e = event.end.dateTime;
																								var str_attendees = '';
																								if (!when_s) {
																												when_s = event.start.date;
																								}
																								if (!when_e) {
																												when_e = event.end.date;
																								}
																								if (event.attendees) {
																												attendees = event.attendees;
																												var m = [];
																												var inn = 0;
																												var temp = [];
																												for (var j = 0; j < attendees.length; j++) {
																																temp = attendees[j]
																																				.email
																																				.split('@');
																																m[j] = temp[1];
																																temp = m[j].split('.');
																																m[j] = temp[0];
																																str_attendees =str_attendees + ' ' + attendees[j].email;																												
																																if (this.attendees.length == 0) {
																																				this
																																								.attendees
																																								.push({email: attendees[j].email, invitenum: 1});
																																				continue;
																																}
																																for (var k = 0; k < this.attendees.length; k++) {
																																				// console.log(this.attendees[k].email); console.log(attendees[j].email);
																																				if (this.attendees[k].email == attendees[j].email) {
																																								this.attendees[k].invitenum++;
																																								inn = 1;
																																				}
																																}
																																if (inn !== 1) {
																																				this
																																								.attendees
																																								.push({email: attendees[j].email, invitenum: 1});
																																} else {
																																				inn = 0;
																																}																																											
																												}
																								} else {
																												attendees = new Array();
																								}
																								var start = new Date(when_s);
																								var end = new Date(when_e);
																								totaltime = totaltime + (end - start) / (1000 * 60 * 60);
																								this.id++;
																								if (m) {
																												console.log(m);
																												m = this.unique_char(m);
																												this.meeting = m[0];
																												for (var k = 1; k < m.length; k++) {
																																this.meeting = this.meeting + ', ' + m[k];
																												}
																								} else {
																												this.meeting = '';
																								}
																								this.meeting = this
																												.meeting
																												.toUpperCase();
																								appointments.push({
																												id: this.id,
																												meeting: this.meeting,
																												title: event.summary,
																												duration: when_s + '     To     ' + when_e,
																												time: (end - start) / (1000 * 60 * 60),
																												invite: attendees.length,
																												attendees: event.attendees,
																												str_attendees: str_attendees
																								})
																				}
																				this.totalTime += totaltime;
																} else {
																				this.totalEvent = 0;
																				this.totalTime = 0;
																				//  appointments.push({title: 'No upcoming events found', time: 0, invite: 0});
																}
																resolve(appointments);
												});
								});
				}
}
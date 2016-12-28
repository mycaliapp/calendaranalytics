export class AppointmentsService {

	public totalEvent: number;
	public totalTime: number;

	loadCalendarlists() {
		return new Promise((resolve, reject) => {
			var request = gapi.client.calendar.calendarList.list();
			request.execute((resp) => {
				var calendars = [];
				var cals = resp.items;
				var i;
				if (cals.length > 0) {
					for (i = 0; i < cals.length; i++) {
						calendars.push(cals[i].summary);
					}
				}
				else {
					calendars.push('No calendars');
				}
				resolve(calendars);
			});
		});
	}

	loadAppointments() {
		return new Promise((resolve, reject) => {
			var request = gapi.client.calendar.events.list({
				'calendarId': 'primary',
				'timeMin': (new Date()).toISOString(),
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 10,
				'orderBy': 'startTime',				
				'past': true,
			});

			request.execute((resp) => {
				var appointments = [];
				var events = resp.items;
				var totaltime = 0;
				var i;
				this.totalEvent = events.length;
				console.log(this.totalEvent);
				if (events.length > 0) {
					for (i = 0; i < events.length; i++) {
						var event = events[i];
						var when_s = event.start.dateTime;
						var when_e = event.end.dateTime;
						if (!when_s) {
							when_s = event.start.date;
						}
						if (!when_e) {
							when_e = event.end.date;
						}

						var start = new Date(when_s);
						var end = new Date(when_e);
						totaltime = totaltime + (end - start) / (1000 * 60 * 60);
						appointments.push(event.summary + '  (From    ' + when_s + '    To    ' + when_e + ')')
					}
					this.totalTime = totaltime;
					console.log(this.totalTime);
				} else {
					appointments.push('No upcoming events found.');
				}
				resolve(appointments);
			});
		});
	}
}
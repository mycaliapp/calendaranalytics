export class CalendarService{
    loadCalendarlists() {
		return new Promise((resolve, reject) => {
			var request = gapi.client.calendar.calendarList.list();
			request.execute((resp) => {
				var calendars = [];
				var cals = resp.items;
				var i;
				if (cals.length > 0) {
					for (i = 0; i < cals.length; i++) {
                        calendars.push({summary: cals[i].summary, id: cals[i].id});
						console.log(cals[i].id);
					}
				}
				else {
					calendars.push('No calendars');
				}
				resolve(calendars);
			});
		});
	}
}
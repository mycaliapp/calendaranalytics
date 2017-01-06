export class AppointmentsService {

	public totalEvent: number;
	public totalTime: number;
	public attendees: Array<Object>;	
	public mostinvite: string;	

	loadAppointments(calendarid, timeMax, timeMin) {		
		return new Promise((resolve, reject) => {
			var request = gapi.client.calendar.events.list({
				'calendarId': calendarid,
				'timeMax': timeMax.toISOString(),
				'timeMin': timeMin.toISOString(),
				'showDeleted': false,
				'singleEvents': true,				
				'orderBy': 'startTime',				
				'past': true,
			});

			request.execute((resp) => {
				var appointments = [];
				var events = resp.items;				
				var totaltime = 0;
				var attendees;
				this.attendees = [{email: '', invitenum: 0}];
				this.attendees.splice(0, this.attendees.length);
				console.log(this.attendees);								
				var i;				
				if (events.length > 0) {
					this.totalEvent = events.length;
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
						if (event.attendees){
							attendees = event.attendees;
							var inn = 0;
							for(var j = 0; j < attendees.length; j++){
								if(this.attendees.length == 0){																		
									this.attendees.push({email: attendees[j].email, invitenum: 1});
									continue;										
								}	
								for(var k = 0; k < this.attendees.length; k++){
									console.log(this.attendees[k].email);
									console.log(attendees[j].email);																	
									if (this.attendees[k].email == attendees[j].email){
										this.attendees[k].invitenum++;										
										inn = 1;
									}
								}
								if(inn !== 1){									
									this.attendees.push({email: attendees[j].email, invitenum: 1});
								}
								else{
									inn = 0;
								}								
							}							 
						}else{
							attendees = new Array();
						}											
						var start = new Date(when_s);
						var end = new Date(when_e);
						totaltime = totaltime + (end - start) / (1000 * 60 * 60);
						appointments.push({title: (event.summary + '   (From    ' + when_s + '     To     ' + when_e + ')'), time: (end - start) / (1000 * 60 * 60), invite: attendees.length})
					}
					this.totalTime = totaltime;					
				} else {
					this.totalEvent = 0;
					this.totalTime = 0;					
					appointments.push({title: 'No upcoming events found.', time: 0, invite: 0});
				}				
				resolve(appointments);
			});
		});
	}
}
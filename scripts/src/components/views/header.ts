/// <reference path="../../../../typings/angular2/angular2.d.ts" />
import {Component, View, NgIf} from 'angular2/angular2';
import {AuthenticationService} from '../../services/authenticationservice';
import { _settings } from '../../settings';

@Component({
  selector: 'a2os-header'
})
@View({
  templateUrl: _settings.buildPath +'/components/views/header.html',
  directives: [NgIf]
})
export class Header {
	authenticationService: AuthenticationService;

	constructor(authenticationService: AuthenticationService){
		this.authenticationService = authenticationService;
	}
}
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'home-component',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

	totalCount: number = 58;
	manualCount: number = 16;
	calculatedCount: number = 42;

	constructor() { }

	ngOnInit(): void {
	}

}

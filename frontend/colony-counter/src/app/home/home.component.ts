import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
	selector: 'home-component',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

	totalCount: number = 58;
	manualCount: number = 16;
	calculatedCount: number = 42;

	domLoaded = false;

	constructor() { }
	ngAfterViewChecked(): void {
		if (this.domLoaded = false) {
			this.setDrawingComponentProperties();
		}
	}

	ngOnInit(): void {
		
	}

	ngAfterViewInit(): void {
		this.addDrawingEventListener();
		this.setDrawingComponentProperties();
	}

	setDrawingComponentProperties() {
		// var drawingComponent = document.getElementById("image-drawing");

		// if (drawingComponent?.children) {
		// 	var childrenArray = Array.from(drawingComponent.children);
		// 	var childDivs = childrenArray.filter(x => x.nodeName == "DIV");

		// 	for(var div of childDivs) {
		// 		var element = div as HTMLElement;
		// 		element.style.width = "100%";
		// 	}
			
		// }

		// // Canvas container div containing two child element canvases
		// var canvasContainer = (document.getElementsByClassName("canvas-container") as HTMLCollectionOf<HTMLElement>).item(0);
		// console.log(canvasContainer);

		// if (canvasContainer) {
		// 	canvasContainer.style.width = "100%";
		// 	canvasContainer.style.height = "";
		// 	canvasContainer.style.color = "red";
		// }

		
	}

	addDrawingEventListener() {
		var canvas = document.getElementsByClassName('upper-canvas');
		canvas.item(0)?.addEventListener('click', function() {
			console.log('click!');
		}, false);
	}
	
}

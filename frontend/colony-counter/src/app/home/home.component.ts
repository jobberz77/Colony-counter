import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { reduce } from 'rxjs';
import { CountModel } from 'src/shared/models/CountModel';

@Component({
	selector: 'home-component',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

	// Image and drawing variables
	canvasElement: HTMLCanvasElement;
	canvasContext: CanvasRenderingContext2D;
	image: HTMLImageElement;
	imageWidth: 1532;
	imageHeight: 1152;
	drawSize = 10;
	drawColor = 'red';

	// Counting variables
	countList: Array<CountModel> = new Array<CountModel>();
	// totalCount: number = 58;
	// manualCount: number = 16;
	calculatedCount: number = 0;

	constructor() { }

	ngOnInit(): void {
		this.initializeCanvas();
	}

	initializeCanvas() {
		this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
		this.canvasContext = this.canvasElement.getContext("2d");
		
		this.drawOnImage();
	}


	drawOnImage() {
		// if an image is present,
		// the image passed as a parameter is drawn in the canvas
		this.canvasElement.onmousedown = (e) => {
			this.canvasContext.beginPath();
			this.canvasContext.lineWidth = this.drawSize;
			this.canvasContext.strokeStyle = this.drawColor;
			this.canvasContext.lineJoin = "round";
			this.canvasContext.lineCap = "round";
			this.canvasContext.moveTo(e.clientX - 384, e.clientY - 64);
			this.canvasContext.lineTo(e.clientX - 384, e.clientY - 64);
			this.canvasContext.stroke();

			this.saveCount(e.clientX  - 384, e.clientY - 64);
		};

		var self = this;
		this.canvasElement.onmouseup = function () {
			self.canvasContext.closePath();
		};

		var self = this;

		this.image = new Image();
		this.image.src = './../../assets/images/colony_image_sm.jpg';
		this.image.width = 1153;
		this.image.height = 865;
		this.image.onload = function () {
			self.canvasContext.drawImage(self.image, 0, 0, 1153, 865);
		}
	}

	saveCount(x: number, y: number) {
		this.countList.push(new CountModel(x, y));
	}

	undoLastCount() {
		if (this.countList.length > 0) {
			this.countList.pop();
			console.log('current stack:', this.countList);

			this.resetCount();
		}
	}

	resetCount() {
		this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.canvasContext.drawImage(this.image, 0, 0, 1153, 865);

		this.countList.forEach(count =>{
			this.canvasContext.beginPath();
			this.canvasContext.moveTo(count.x, count.y);  
			this.canvasContext.lineTo(count.x, count.y);
			this.canvasContext.stroke();
			})
	}

}

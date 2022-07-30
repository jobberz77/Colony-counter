import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CountModel } from 'src/shared/models/CountModel';
import { CountResultModel } from '../entities/count-result.model';
import { BackendService } from '../services/backend-service.component';
import { SettingsComponent } from './settings/settings.component';

@Component({
	selector: 'home-component',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

	@ViewChild('modal') private settingsModal: SettingsComponent

	// Image and drawing variables
	canvasElement: HTMLCanvasElement;
	canvasContext: CanvasRenderingContext2D;
	image: HTMLImageElement;
	imageWidth: 1532;
	imageHeight: 1152;
	drawSize = 10;
	drawColor = 'red';

	// Counting variables
	imageCountModel: CountResultModel;

	countList: Array<CountModel> = new Array<CountModel>();
	totalCount: number = 58;
	manualCount: number = 0;
	calculatedCount: number = 0;

	constructor(private backendService: BackendService) { }

	ngOnInit(): void {
		// TODO: Move this one to a method where the call for inserting the image is done.
		this.backendService.getImage().subscribe(countResult => {
			this.calculatedCount = countResult.count;
			this.imageCountModel = countResult;

			this.initializeCanvas();
		});
	}

	initializeCanvas() {
		this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
		this.canvasContext = this.canvasElement.getContext("2d");

		this.drawOnImage();
	}

	openSettingsModal() {
		return this.settingsModal.open();
	}

	addCount(x: number, y: number) {
		this.countList.push(new CountModel(x, y));
		this.incrementCount();
	}

	undoLastCount() {
		if (this.countList.length > 0) {
			this.countList.pop();
			this.decrementCount();

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
			});
	}

	drawOnImage() {
		var self = this;

		this.canvasElement.onmousedown = (e) => {
			this.canvasContext.beginPath();
			this.canvasContext.lineWidth = this.drawSize;
			this.canvasContext.strokeStyle = this.drawColor;
			this.canvasContext.lineJoin = "round";
			this.canvasContext.lineCap = "round";
			this.canvasContext.moveTo(e.clientX - 384, e.clientY - 64);
			this.canvasContext.lineTo(e.clientX - 384, e.clientY - 64);
			this.canvasContext.stroke();

			this.addCount(e.clientX  - 384, e.clientY - 64);
		};

		this.canvasElement.onmouseup = function () {
			self.canvasContext.closePath();
		};

		this.image = new Image();
		this.image.src = 'data:image/png;base64,' + this.imageCountModel.base64_image;
		this.image.width = 1153;
		this.image.height = 865;
		this.image.onload = function () {
			self.canvasContext.drawImage(self.image, 0, 0, 1153, 865);
		}
	}

	incrementCount() {
		this.manualCount++;
		this.imageCountModel.count++;
	}

	decrementCount() {
		this.manualCount--;
		this.imageCountModel.count--;
	}

	saveImageCount() {
		this.backendService.saveImage(this.imageCountModel);
	}

}

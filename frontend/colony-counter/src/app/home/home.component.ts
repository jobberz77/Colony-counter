import { Component, OnInit, ViewChild } from '@angular/core';
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
	imageWidth: 1450;
	imageHeight: 865;
	drawSize = 8;
	drawColor = 'red';

	// Counting variables
	countResultModel: CountResultModel;
	countList: Array<CountModel> = new Array<CountModel>();
	manualCount: number = 0;
	calculatedCount: number = 0;

	// UI state variables
	disableCountButtons: boolean = true;
	drawingIsDisabled: boolean = true;

	constructor(private backendService: BackendService) { }

	ngOnInit(): void {
		this.initializeCanvas();
	}

	startCycle() {
		this.setLoadingImage();

		this.backendService.swallowContainerAndGetResultingImage().subscribe(result => {
			console.log(result)

			this.calculatedCount = result.count;
			this.countResultModel = result;

			this.disableCountButtons = false;
			this.drawingIsDisabled = false;

			this.drawOnImage();
		},
		err => {
			if (err.error[0] === 'QR_CODE') {
				alert('QR code kon niet gescand worden. Plaats het bakje opnieuw op het plateau en zorg dat de QR code aan de goede kant staat.');
			}

			this.backendService.endCyclePrematurely();
		});
	}

	endCycle() {
		this.backendService.saveImage(this.countResultModel);
	}

	// Set up canvas and insert the placeholder image
	initializeCanvas() {
		this.imageWidth = 1450;
		this.imageHeight = 865;

		this.setPlaceholderImage();
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

			this.redrawCount();
		}
	}

	redrawCount() {
		this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
		this.canvasContext.drawImage(this.image, 0, 0, this.imageWidth, this.imageHeight);

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
			if (!this.drawingIsDisabled) {
				this.canvasContext.beginPath();
				this.canvasContext.lineWidth = this.drawSize;
				this.canvasContext.strokeStyle = this.drawColor;
				this.canvasContext.lineJoin = "round";
				this.canvasContext.lineCap = "round";
				this.canvasContext.moveTo(e.clientX - 480, e.clientY - 64);
				this.canvasContext.lineTo(e.clientX - 480, e.clientY - 64);
				this.canvasContext.stroke();
	
				this.addCount(e.clientX  - 480, e.clientY - 64);
			}
		};

		this.canvasElement.onmouseup = function () {
			self.canvasContext.closePath();
		};

		this.image = new Image();
		this.image.src = this.addBase64PrefixIfNeeded(this.countResultModel.base64_image);
		this.image.width = this.imageWidth;
		this.image.height = this.imageHeight;
		this.image.onload = function () {
			self.canvasContext.drawImage(self.image, 0, 0, self.imageWidth, self.imageHeight);
		}
	}

	incrementCount() {
		this.manualCount++;
		this.countResultModel.count++;
	}

	decrementCount() {
		this.manualCount--;
		this.countResultModel.count--;
	}

	resetCount() {
		this.manualCount = 0;
		this.calculatedCount = 0;
		this.countResultModel = new CountResultModel();
		this.countList = [];
	}

	saveImageCount() {
		var countResult = this.canvasElement.toDataURL("image/jpg").split(';base64,')[1];

		this.countResultModel.base64_image = countResult;
		this.backendService.saveImage(this.countResultModel);

		this.setPlaceholderImage();
		this.resetCount();
	}

	setPlaceholderImage() {
		this.drawingIsDisabled = true;
		this.disableCountButtons = true;

		this.backendService.getPlaceholderImage().subscribe(placeholder => {
			this.countResultModel = new CountResultModel();
			this.countResultModel.base64_image = placeholder;

			this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
			this.canvasContext = this.canvasElement.getContext("2d");
	
			this.drawOnImage();
		});
	}

	setLoadingImage() {
		this.backendService.getLoadingImage().subscribe(loadingImage => {
			this.countResultModel.base64_image = loadingImage;

			this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
			this.canvasContext = this.canvasElement.getContext("2d");
	
			this.drawOnImage();
		});
	}

	addBase64PrefixIfNeeded(base64Value: string) {
		if (!base64Value.startsWith('data:image/jpg;base64,')) {
			
			return 'data:image/jpg;base64,' + base64Value;
		}
		return base64Value;
	}

}

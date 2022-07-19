import { Component, Injectable, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'settings-modal',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.less']
  })

  @Injectable()
  export class SettingsComponent {

    @ViewChild('modal') private modalContent: TemplateRef<SettingsComponent>;
    private modalRef: NgbModalRef;

    constructor(private modalService: NgbModal) {}

    open() {
        return new Promise<boolean>(resolve => {
            this.modalRef = this.modalService.open(this.modalContent)
            this.modalRef.result.then(resolve, resolve)
          })
    }

    close() {
        this.modalRef.close();
    }

    dismiss() {
        this.modalRef.dismiss();
    }

  }
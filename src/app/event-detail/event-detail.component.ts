import { Component, OnInit, Input, Inject } from '@angular/core';
import { ModalService } from '../modal.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

export interface DialogData {
  url: String;
}

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() detailObj: object = {};
  // detail = this.detailObj['detail'];
  // keys = Object.keys(this.detailObj);
  hiddenModal = true;

  constructor(
    public modalService: ModalService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
      width: '500px',
      height: 'auto',
      // top: "10px",
      data: {
        url: this.detailObj['Seat Map'],
      }
    });
    dialogRef.updatePosition({top: '10px'});
  }


  openSeatMapModal(id) {
    this.modalService.open(id);
    this.hiddenModal = false;
    // show.bs.seatMapModal();
    this.modalService.open(id);
  }
  closeSeatMapModal(id) {
    // this.hiddenModal = true;
    // this.modalService.close(id);
  }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialogComponent {
  url;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.url = data.url;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

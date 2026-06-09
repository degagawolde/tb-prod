import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EaiiLoadingService } from '@eaii/services/loading';
import { environment } from 'environments/environment';
import moment from 'moment';
import { PatientService } from '../../../core/patient/patient.service';
import { ImageViewerComponent } from '../registration/image-viewer/image-viewer.component';
import { Patient } from '../registration/patient';

@Component({
    selector: 'app-patient-chart',
    templateUrl: './patient-chart.component.html',
    styleUrls: ['./patient-chart.component.scss'],
})
export class PatientChartComponent implements OnInit {
    private vbaseUrl = environment.vbaseUrl;
    current_msk_url: string = '';
    current_img_url: string = '';
    patientId: string;
    patient: Patient;
    public dialogRef: any;
    xrayResult: any;
    patientDataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = [
        'created',

        // 'msk_url',
        'class_prediction',
        'image_url',
    ];

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private laodingService: EaiiLoadingService,
        private _matDialog: MatDialog,
        private patientService: PatientService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.patientId = params.id;
        });
        this.fetchPatient();
        this.fetchChestXrayPrediction();
    }

    showImage(img_url): void {
        this.current_img_url = `${this.vbaseUrl}${img_url}`;

        // Open the dialog
        this.dialogRef = this._matDialog.open(ImageViewerComponent, {
            autoFocus: false,
            disableClose: false,
            panelClass: 'custom-dialog-panel',
            width: '90%',
            height: '90%',
        });
        let instance = this.dialogRef.componentInstance;
        instance.imageUrl = this.current_img_url;
    }

    private fetchPatient() {
        this.patientService.getPatient(this.patientId).subscribe({
            next: (resp) => {
                this.patient = resp;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    getDateFormatted(date: string) {
        const jsDate = new Date(date);
        return moment(jsDate).format('DD-MMM-YYYY HH:mm:ss');
    }

    back() {
        this.router.navigateByUrl('/list');
    }

    private fetchChestXrayPrediction() {
        this.laodingService.show();
        this.patientService.getChestXrayResult(this.patientId).subscribe({
            next: (resp) => {
                this.xrayResult = resp;
                this.patientDataSource.data = resp;
                console.log(this.patientDataSource.data);

                this.laodingService.hide();
            },
        });
    }
}

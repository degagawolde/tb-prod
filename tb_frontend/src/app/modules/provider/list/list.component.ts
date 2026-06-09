import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EaiiConfirmationService } from '../../../../@eaii/services/confirmation';
import { EventQueueService } from '../../../../@eaii/services/event/event.service';
import { AppEventType } from '../../../../@eaii/services/event/event.type';
import { PatientService } from '../../../core/patient/patient.service';
import { Patient } from '../registration/patient';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
    displayedColumns: string[] = [
        'patientId',
        'firstName',
        'lastName',
        'gender',
        'age',
        'actions',
    ];

    destroy$: Subject<boolean> = new Subject<boolean>();
    dataSource = new MatTableDataSource<Patient>([]);
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    constructor(
        private patientService: PatientService,
        private eventService: EventQueueService,
        private confirmation_service: EaiiConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.patientService
            .fetchPatients(1, 50)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp: any[]) => {
                    const patients: Patient[] = [];

                    resp.forEach((item) => {
                        const patient = item.fields as Patient;
                        patient.patientId = item.pk;
                        patients.push(patient);
                    });
                    this.dataSource.data = patients;
                },
                error: (err) => {
                    console.log(err);
                },
            });
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    ngAfterViewInit() {
        //subscribe to events
        this.eventService
            .on(AppEventType.diabetesTestEvent)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                this.confirmation_service.closeDiabetesTestDialog();
                this.confirmation_service.showAfterSaveDialog(
                    event.payload.result,
                    true
                );
            });
    }

    onViewDetail(id: number) {
        this.router.navigateByUrl(`/patients/chart?id=${id}`);
    }

    onNewVisit(patient: Patient) {
        this.patientService.setCurrentPatient(patient);
        this.router.navigateByUrl(`/registration/revisit`);
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable, of, switchMap} from 'rxjs';
import {Feedback, Patient, PredictionResult} from '../../modules/provider/registration/patient';
import {DiabetesResult} from 'app/modules/provider/registration/result.type';
import {Lab} from '../../modules/provider/type-and-complication-prediction/lab';
import {Moment} from 'moment/moment';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    currentPatient: Patient;
    currenntFeedback:Feedback;
    currentResult: PredictionResult;
    constructor(
        private _httpClient: HttpClient
    ) {
    }

    createFeedback(feedback: Feedback): Observable<any>  {
        return this._httpClient.post(environment.baseUrl + 'feedback/', feedback).pipe(
            switchMap((response: any) => {
                this.currenntFeedback = response.approval;
                return of(response);
            }));
    }

    addPatient(patient: Patient): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'patient-register/', patient).pipe(
            switchMap((response: any) => {
                this.currentPatient = response.result;
                return of(response);
            }));

    }

    setCurrentPatient(patient: Patient) {
        this.currentPatient = patient;
    }
    setCurrentFeedback(feedback:Feedback){
        this.currenntFeedback = feedback; 
    }
    checkDiabetes(fbs: number, hb1: number): DiabetesResult {

        if (fbs) {

            if (fbs <= 100) {

                return DiabetesResult.NOT_DETECTED;

            } else if (fbs > 100 && fbs < 125) {
                return DiabetesResult.PRE;

            } else if (fbs >= 125) {
                return DiabetesResult.DETECTED;

            }

        } else if (hb1) {
            if (hb1 <= 5.7) {

                return DiabetesResult.NOT_DETECTED;

            } else if (hb1 > 5.7 && fbs < 6.4) {
                return DiabetesResult.PRE;
            } else if (fbs >= 6.4) {
                return DiabetesResult.DETECTED;
            }
        }


    }

    calculateBMI(weight: number, height: number): number {
        return ((weight / Math.pow((height / 100), 2)));
    }

    submitLab(lab: Lab): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'lab/create/', lab);
    }

    approvePrediction(data: any): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'result/update/', data);
    }

    calculateRisk(data: any): Observable<any> {
        return this._httpClient.post(environment.baseUrl + 'risk/create/', data);
    }

    fullName(): string {
        return this.currentPatient.firstName + ' ' + this.currentPatient.lastName;
    }

    fetchPatients(page: number, size: number): Observable<any> {
        return this._httpClient.get(environment.baseUrl + `patients/page/?page=${page}&size=${size}`);
    }

    fetchStat(): Observable<any> {
        return this._httpClient.get(environment.baseUrl + 'patients/statistics/');
    }

    fetchAgeGenderStat(type: string, date: Moment): Observable<any> {
        return this._httpClient.get(environment.baseUrl + `patients/agegender/?year=${date.year()}&type=${type}`);
    }

    fetchComplicationStat(): Observable<any> {
        return this._httpClient.get(environment.baseUrl + 'patients/complication/');
    }

    getPatient(patientId: string): Observable<any> {
        return this._httpClient.get(environment.baseUrl + `patient/${patientId}`);
    }

    getChestXrayResult(patientId: string): Observable<any> {
        return this._httpClient.get(environment.baseUrl + `cxr-result/${patientId}`);
    }
   


}

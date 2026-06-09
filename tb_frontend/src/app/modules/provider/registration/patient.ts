export class Patient {
    patientId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    woreda: string;
    region?: string;
    zone: string;
    job: string;
}

export class Feedback{
    result: number;
    approval:boolean;
    feedback:string
}
export class PredictionResult{
    class_prediction:string;
    loc_prediction:string;
    chestxray:number;
}
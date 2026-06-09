import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexFill,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexResponsive,
    ApexStroke,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
} from 'ng-apexcharts';
import {PatientService} from '../../../core/patient/patient.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import moment, {Moment} from 'moment';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    colors: string[];
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};
export type DonutChartOptions = {
    series: ApexNonAxisChartSeries;
    colors: string[];
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
};
export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    colors: string[];
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    legend: ApexLegend;
};

@Component({
    selector: 'example',
    templateUrl: './landing.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements OnInit, OnDestroy {
    /**
     * Constructor
     */

    @ViewChild('bar-chart') chart: ChartComponent;
    @ViewChild('donut-chart') donutChart: ChartComponent;

    public chartOptions: Partial<ChartOptions>;
    public donutChartOptions: Partial<DonutChartOptions>;
    public pieChartOptions: Partial<PieChartOptions>;
    public stat: any;
    destroy$: Subject<boolean> = new Subject<boolean>();
    typeSelect: string = 'tuberculosis';
    currentYear: Moment = moment();

    constructor(private patientService: PatientService) {

    }

    ngOnInit(): void {
        this.patientService.fetchStat()
            .pipe(takeUntil(this.destroy$))
            .subscribe({

                next: (response) => {
                    this.stat = response;
                },

                error: (err) => {
                    console.log(err);
                }

            });

        //fetch gender stat
        this.fetchAgeGenderStat();

        //fetch complication stat
        this.fetchComplicationStat();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.stat = null;
    }

    fetchAgeGenderStat(): void {
        console.log(this.currentYear)
        this.patientService.fetchAgeGenderStat(this.typeSelect, moment(this.currentYear))
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    const female_values = Object.keys(response.female_month).map(key => response.female_month[key])
                    const male_values = Object.keys(response.male_month).map(key => response.male_month[key])
                    const gender = response.gender_df

                    this.chartOptions = {
                        colors: ['#FE9B27', '#1677AA'],
                        series: [
                            {
                                name: 'Male',
                                data: male_values
                            },
                            {
                                name: 'Female',
                                data: female_values
                            },

                        ],
                        chart: {
                            type: 'bar',
                            height: 200,
                            toolbar: {
                                show: false
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '75%'
                            }
                        },
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent']
                        },
                        xaxis: {
                            categories: [
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Dec'
                            ]
                        },
                        yaxis: {
                            title: {
                                text: 'Count'
                            }
                        },
                        fill: {
                            opacity: 1
                        },
                        tooltip: {
                            y: {
                                formatter: (val): any => val
                            }
                        }
                    };
                    this.donutChartOptions = {
                        colors: ['#FE9B27', '#1677AA'],
                        series: [gender.Male, gender.Female],
                        chart: {
                            type: 'donut'
                        },
                        labels: ['Male', 'Female'],
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 400
                                    }
                                }
                            }
                        ],
                        legend: {
                            position: 'bottom',
                            offsetY: 15,
                            height: 40
                        }
                    };
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    fetchComplicationStat(): void {

        this.patientService.fetchComplicationStat()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.pieChartOptions = {

                        series: [response.tb_count, response.sick_count, response.health_count],
                        chart: {
                            type: 'pie'
                        },
                        labels: ['tuberculosis', 'non-tb-sick', 'healthy'],
                        responsive: [
                            {
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 600
                                    }
                                }
                            }
                        ],
                        legend: {
                            position: 'bottom',
                            offsetY: 15,
                            height: 40
                        }
                    };
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }
}

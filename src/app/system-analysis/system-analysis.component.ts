import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip} from 'ng2-charts';
import {CsService} from '../services/cs.service';

@Component({
    selector: 'app-system-analysis',
    templateUrl: './system-analysis.component.html',
    styleUrls: [],
})
export class SystemAnalysisComponent implements OnInit {
    isDataLoaded = false;

    pieChartValues = [];
    pieChartLabels: Label[] = [];

    chartDataSets: ChartDataSets[] = [];
    monthsNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    constructor(private csService: CsService,
                private changeDetector: ChangeDetectorRef
    ) {
        monkeyPatchChartJsTooltip();
        monkeyPatchChartJsLegend();
    }

    ngOnInit(): void {
        setTimeout(() =>
            this.csService.search({query: 'matchall', queryParser: 'structured'}, (error, data) => {
                const pieChartData = data.reduce(
                    (prev, {file_type}) => ({...prev, [file_type]: (prev[file_type] ?? 0) + 1}),
                    {}
                );

                this.pieChartValues = Object.values(pieChartData);
                this.pieChartLabels = Object.keys(pieChartData);

                const userFilesObject = data.map((d) => ({
                    ...d,
                    createdAt: new Date(d.created_at_iso_string)
                })).filter(({createdAt}) => createdAt.getFullYear() === 2020).reduce(
                    (prev, {author_email, createdAt}) => {
                        const filesCounterData = (prev[author_email] ?? new Array(this.monthsNames.length).fill(0));

                        filesCounterData[createdAt.getMonth()] += 1;

                        return ({
                            ...prev,
                            [author_email]: filesCounterData
                        });
                    },
                    {}
                );

                this.chartDataSets = Object.keys(userFilesObject).map(label => ({
                    data: userFilesObject[label], label
                }));

                this.isDataLoaded = true;
                this.changeDetector.detectChanges();
            }), 1000);
    }
}

// highchart
import * as Highcharts from 'highcharts';

import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import venn from 'highcharts/modules/venn';

venn(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chart-practice';

  constructor(private authService: AuthService) {}
  users: any;
  selectedPoints: any;

  ngOnInit(): void {
    this.plotChart();
    this.columnChart();
    this.pieChart();
    this.plotVennDiagramChart();
  }

  vennDiagramSetsFun(data: any) {
    console.log(data.point.name); //data of click event, One can found point's value or index
  }

  plotVennDiagramChart() {
    const chart = Highcharts.chart('container1', {
      plotOptions: {
        series: {
          cursor: 'pointer',
          showInLegend: true,
          point: {
            events: {
              click: this.vennDiagramSetsFun.bind(this),
              legendItemClick: function () {
                var visibility = this.visible ? 'visible' : 'hidden';
                return false;
              },
            },
          },
        },
        venn: {
          dataLabels: {
            enabled: true, // Set to true to show data labels
          },
        },
      },
      series: [
        {
          type: 'venn',
          name: 'The Unattainable Triangle',
          data: [
            {
              name: 'Good',
              sets: ['Good'],
              value: 2,
              
            },
            {
              sets: ['Fast'],
              value: 2,
              name: 'Fast',
            },
            {
              sets: ['Cheap'],
              value: 2,
              name: 'Cheap',
            },
            {
              sets: ['Good', 'Fast'],
              value: 1,
              name: 'More expensive',
            },
            {
              sets: ['Good', 'Cheap'],
              value: 1,
              name: 'Will take time to deliver',
            },
            {
              sets: ['Fast', 'Cheap'],
              value: 1,
              name: 'Not the best quality',
            },
            {
              sets: ['Fast', 'Cheap', 'Good'],
              value: 1,
              name: "They're dreaming",
            },
          ],
        },
      ],
      title: {
        text: 'The Unattainable Triangle',
      },
    });
  }

  plotChart() {
    const chartOptions: any = {
      title: {
        text: 'U.S Solar Employment Growth',
        align: 'left',
      },

      subtitle: {
        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        align: 'left',
      },

      yAxis: {
        title: {
          text: 'Number of Employees',
        },
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Range: 2010 to 2020',
        },
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 2010,
        },
      },

      series: [
        {
          name: 'Installation & Developers',
          data: [
            43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157,
            161454, 154610,
          ],
        },
        {
          name: 'Manufacturing',
          data: [
            24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726,
            34243, 31050,
          ],
        },
        {
          name: 'Sales & Distribution',
          data: [
            11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243,
            29213, 25663,
          ],
        },
        {
          name: 'Operations & Maintenance',
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            11164,
            11218,
            10077,
          ],
        },
        {
          name: 'Other',
          data: [
            21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906,
            10073,
          ],
        },
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };

    // Get the container element
    const container = document.getElementById('container2');

    // Create the chart with the defined options
    if (container) {
      Highcharts.chart(container as any, chartOptions);
    } else {
      console.error('Container element not found.');
    }
  }

  columnChart() {
    const chartOptions: any = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Corn vs wheat estimated production for 2020',
        align: 'left',
      },
      subtitle: {
        text:
          'Source: <a target="_blank" ' +
          'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
        align: 'left',
      },
      xAxis: {
        categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
        crosshair: true,
        accessibility: {
          description: 'Countries',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '1000 metric tons (MT)',
        },
      },
      tooltip: {
        valueSuffix: ' (1000 MT)',
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Corn',
          data: [40629],
        },
        {
          name: 'Wheat',
          data: [51086],
        },
        {
          name: 'Corn',
          data: [40629],
        },
        {
          name: 'Wheat',
          data: [51086],
        },
        {
          name: 'Corn',
          data: [40629],
        },
        {
          name: 'Wheat',
          data: [51086],
        },
      ],
    };

    // Get the container element
    const container = document.getElementById('container3');

    // Create the chart with the defined options
    if (container) {
      Highcharts.chart(container as any, chartOptions);
    } else {
      console.error('Container element not found.');
    }
  }

  pieChart() {
    const colors: any = Highcharts.getOptions().colors,
      categories = ['Chrome', 'Safari', 'Edge', 'Firefox', 'Other'],
      data = [
        {
          y: 61.04,
          color: colors[2],
          drilldown: {
            name: 'Chrome',
            categories: [
              'Chrome v97.0',
              'Chrome v96.0',
              'Chrome v95.0',
              'Chrome v94.0',
              'Chrome v93.0',
              'Chrome v92.0',
              'Chrome v91.0',
              'Chrome v90.0',
              'Chrome v89.0',
              'Chrome v88.0',
              'Chrome v87.0',
              'Chrome v86.0',
              'Chrome v85.0',
              'Chrome v84.0',
              'Chrome v83.0',
              'Chrome v81.0',
              'Chrome v89.0',
              'Chrome v79.0',
              'Chrome v78.0',
              'Chrome v76.0',
              'Chrome v75.0',
              'Chrome v72.0',
              'Chrome v70.0',
              'Chrome v69.0',
              'Chrome v56.0',
              'Chrome v49.0',
            ],
            data: [
              36.89, 18.16, 0.54, 0.7, 0.8, 0.41, 0.31, 0.13, 0.14, 0.1, 0.35,
              0.17, 0.18, 0.17, 0.21, 0.1, 0.16, 0.43, 0.11, 0.16, 0.15, 0.14,
              0.11, 0.13, 0.12,
            ],
          },
        },
        {
          y: 9.47,
          color: colors[3],
          drilldown: {
            name: 'Safari',
            categories: [
              'Safari v15.3',
              'Safari v15.2',
              'Safari v15.1',
              'Safari v15.0',
              'Safari v14.1',
              'Safari v14.0',
              'Safari v13.1',
              'Safari v13.0',
              'Safari v12.1',
            ],
            data: [0.1, 2.01, 2.29, 0.49, 2.48, 0.64, 1.17, 0.13, 0.16],
          },
        },
        {
          y: 9.32,
          color: colors[5],
          drilldown: {
            name: 'Edge',
            categories: ['Edge v97', 'Edge v96', 'Edge v95'],
            data: [6.62, 2.55, 0.15],
          },
        },
        {
          y: 8.15,
          color: colors[1],
          drilldown: {
            name: 'Firefox',
            categories: [
              'Firefox v96.0',
              'Firefox v95.0',
              'Firefox v94.0',
              'Firefox v91.0',
              'Firefox v78.0',
              'Firefox v52.0',
            ],
            data: [4.17, 3.33, 0.11, 0.23, 0.16, 0.15],
          },
        },
        {
          y: 11.02,
          color: colors[6],
          drilldown: {
            name: 'Other',
            categories: ['Other'],
            data: [11.02],
          },
        },
      ],
      browserData = [],
      versionsData = [],
      dataLen = data.length;

    let i, j, drillDataLen, brightness;

    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {
      // add browser data
      browserData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color,
      });

      // add version data
      drillDataLen = data[i].drilldown.data.length;
      for (j = 0; j < drillDataLen; j += 1) {
        brightness = 0.2 - j / drillDataLen / 5;
        versionsData.push({
          name: data[i].drilldown.categories[j],
          y: data[i].drilldown.data[j],
          color: Highcharts.color(data[i].color).brighten(brightness).get(),
        });
      }
    }

    // Create the chart
    const chartOptions: any = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Browser market share, January, 2022',
        align: 'left',
      },
      subtitle: {
        text: 'Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>',
        align: 'left',
      },
      plotOptions: {
        pie: {
          shadow: false,
          center: ['50%', '50%'],
        },
      },
      tooltip: {
        valueSuffix: '%',
      },
      series: [
        {
          name: 'Browsers',
          data: browserData,
          size: '60%',
          dataLabels: {
            color: '#ffffff',
            distance: -30,
          },
        },
        {
          name: 'Versions',
          data: versionsData,
          size: '80%',
          innerSize: '60%',
          dataLabels: {
            format:
              '<b>{point.name}:</b> <span style="opacity: 0.5">{y}%</span>',
            filter: {
              property: 'y',
              operator: '>',
              value: 1,
            },
            style: {
              fontWeight: 'normal',
            },
          },
          id: 'versions',
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 400,
            },
            chartOptions: {
              series: [
                {},
                {
                  id: 'versions',
                  dataLabels: {
                    enabled: false,
                  },
                },
              ],
            },
          },
        ],
      },
    };
    // Get the container element
    const container = document.getElementById('container4');

    // Create the chart with the defined options
    if (container) {
      Highcharts.chart(container as any, chartOptions);
    } else {
      console.error('Container element not found.');
    }
  }
}

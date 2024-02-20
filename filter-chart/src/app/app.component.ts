import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { reduce } from 'rxjs';
import zoomPlugin from 'chartjs-plugin-zoom';

//import  Hammer  from 'hammerjs';

Chart.register(zoomPlugin);
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'filter-chart';
  dates = [
    '2022-06-20',
    '2022-06-21',
    '2022-06-22',
    '2022-06-23',
    '2022-06-24',
    '2022-06-25',
    '2022-06-26',
    '2022-07-02',
    '2022-07-20',
    '2022-07-15',
  ];
  //dates2 = [...(this.dates)];

  myChart: any;
  // filter application
  //const dates = ['2022-06-20', '2022-06-21', '2022-06-22', '2022-06-23', '2022-06-24', '2022-06-25', '2022-06-26'];
  datapoints = [8, 18, 3, 14, 5, 16, 27, -4, -10, -15];

  //dates2 = [...this.dates]
  //console.log(dates2)

  ngOnInit(): void {
    //chart data
    this.myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: this.dates,

        datasets: [
          {
            label: 'A',
            yAxisID: 'y',
            data: this.datapoints,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            pointRadius:1,
          },
          {
            label: 'B',
            yAxisID: 'y1',
            data: [3, 9, 20, 14, 4, -5, 9,1 , 6, 10],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
            pointRadius:1,
          },
        ],
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
            },
          },
        },
        responsive: true,

        scales: {
          y: {
            
            max:60,
            min:-60,
            position:"left",
            beginAtZero:true,
            title: {
              display: true,
              text: ' value',

              font: {
                weight: 'bold',
                size: 50,
              },
              color: 'red',
            },
            ticks:{}
          }, 
          y1: {
            max:20,
            min:-20,
            position:"right",
            beginAtZero:true,
            title: {
              display: true,
              text: ' value',

              font: {
                weight: 'bold',
                size: 50,
              },
              color: 'red',
              
            },
          },
          x: {
            //type:'time',
            time:{
              unit:'day'
            },
            title: {
              display: true,
              text: 'Time ',
              font: {
                weight: 'bold',
                size: 50,
              },
              color: 'red',
            },
          },
        },
      },
    });

    //zoom and reset function
  }
  resetZoomChart() {
    this.myChart.resetZoom();
  }
  zoombutton(value: any) {
    this.myChart.zoom(value);
  }
}

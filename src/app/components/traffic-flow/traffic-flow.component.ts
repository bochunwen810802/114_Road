import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HeatmapModule from 'highcharts/modules/heatmap';

// 初始化熱力圖模組
HeatmapModule(Highcharts);

interface Point {
  x: number;
  y: number;
  value: number;
  series: {
    xAxis: { categories: string[] };
    yAxis: { categories: string[] };
  };
}

interface RoadData {
  [key: string]: number[];
}

@Component({
  selector: 'app-traffic-flow',
  template: '<div id="trafficFlowChart"></div>'
})
export class TrafficFlowComponent implements OnInit {
  @Input() data: RoadData = {};

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    // 使用輸入的數據
    const timeLabels = [
      '165分鐘前', '150分鐘前', '135分鐘前', '120分鐘前',
      '105分鐘前', '90分鐘前', '75分鐘前', '60分鐘前',
      '45分鐘前', '30分鐘前', '15分鐘前', '0'
    ].reverse();

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'heatmap',
        marginTop: 0,
        marginBottom: 35,
        marginRight: 100,
        height: 200
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: timeLabels,
        labels: {
          style: {
            fontSize: '11px'
          },
          y: 25,
          rotation: 0
        }
      },
      yAxis: {
        categories: Object.keys(this.data),
        title: {
          text: null
        },
        labels: {
          style: {
            fontSize: '13px',
            fontWeight: 'bold'
          }
        }
      },
      colorAxis: {
        stops: [
          [0, '#dc3545'],    // 紅色 - 壅塞 (0-36 km/h)
          [0.5, '#ffc107'],  // 黃色 - 中等 (37-62 km/h)
          [1, '#28a745']     // 綠色 - 暢通 (63+ km/h)
        ],
        min: 0,
        max: 90,
        reversed: true
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'middle',
        symbolHeight: 150,
        symbolWidth: 10
      },
      tooltip: {
        formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
          const point = this.point as unknown as Point;
          return `<b>${point.series.yAxis.categories[point.y]}</b><br>
                  時間: ${point.series.xAxis.categories[point.x]}<br>
                  車速: ${point.value} km/h`;
        }
      },
      series: [{
        name: '車速',
        borderWidth: 1,
        data: Object.entries(this.data).flatMap(([_, values]: [string, number[]]) => 
          values.map((value: number, x: number) => [x, Object.keys(this.data).indexOf(_), value])
        ),
        dataLabels: {
          enabled: true,
          color: '#000000',
          style: {
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }
      }] as any
    };

    Highcharts.chart('trafficFlowChart', chartOptions);
  }
} 
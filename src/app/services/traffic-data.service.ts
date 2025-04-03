import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrafficDataService {
  // 时间点数据
  private timePoints = ['即時車速', '10分鐘前', '20分鐘前', '30分鐘前'];
  
  // 道路数据
  private roadData = {
    "三民路三段": {
      path: [
        [24.1543979, 120.6860335],
        [24.1463311, 120.682729]
      ],
      speed: [19, 45, 50, 60] // 即時, 10分鐘前, 20分鐘前, 30分鐘前
    },
    "錦平街": {
      path: [
        [24.1524163, 120.6822957],
        [24.1515548, 120.6848492]
      ],
      speed: [5, 20, 35, 44]
    },
    "育才街": {
      path: [
        [24.1498809, 120.6842304],
        [24.1490781, 120.6864834]
      ],
      speed: [25, 24, 26, 44]
    }
  };

  // 事故地点坐标
  private accidentLocation = [24.151748, 120.684753];

  // 影响范围坐标
  private affectedAreaCoordinates = [
    [120.6794515, 24.152132],
    [120.6796875, 24.151153],
    [120.6795373, 24.1506831],
    [120.6791082, 24.1500957],
    [120.6785074, 24.1493517],
    [120.6780782, 24.1490188],
    [120.6782499, 24.1484706],
    [120.6787219, 24.1490776],
    [120.6807819, 24.1471783],
    [120.6818548, 24.1463755],
    [120.6825629, 24.1462581],
    [120.6824341, 24.1459448],
    [120.6829491, 24.1458077],
    [120.6839362, 24.1462972],
    [120.6860605, 24.1462581],
    [120.6891718, 24.1536592],
    [120.6861892, 24.1546773],
    [120.6794515, 24.152132]
  ];

  constructor() { }

  // 获取时间点数据
  getTimePoints(): Observable<string[]> {
    return of(this.timePoints);
  }

  // 获取道路数据
  getRoadData(): Observable<any> {
    return of(this.roadData);
  }

  // 获取事故地点坐标
  getAccidentLocation(): Observable<number[]> {
    return of(this.accidentLocation);
  }

  // 获取影响范围坐标
  getAffectedAreaCoordinates(): Observable<number[][]> {
    return of(this.affectedAreaCoordinates);
  }

  // 获取影响范围GeoJSON
  getAffectedAreaGeoJSON(): Observable<any> {
    return of({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [this.affectedAreaCoordinates]
      }
    });
  }
} 
import { Component, OnInit } from '@angular/core';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentIncident: any = {
    id: '',
    timestamp: new Date(),
    location: '',
    coordinates: [0, 0],
    severityLevel: 2,
    description: ''
  };
  currentTime: Date = new Date('2024-03-11T10:30:00');
  lastUpdateTime: Date = new Date('2025-03-17T12:45:00');
  predictionTime: number = 0;
  affectedArea: any = {
    coordinates: [
      [120.6741451, 24.1497109],
      [120.6719457, 24.1475278],
      [120.6738661, 24.1460005],
      [120.6746171, 24.1467544],
      [120.6750892, 24.1462747],
      [120.6765483, 24.1477138],
      [120.6741451, 24.1497109]
    ]
  };
  trafficFlow: any = {
    "五權路": {
      coordinates: [
        [24.1490225, 120.6749382],
        [24.1468687, 120.6727173]
      ],
      speed: {
        Now: 30,
        "10_minutes_ago": 35,
        "20_minutes_ago": 42,
        "30_minutes_ago": 51
      }
    },
    "台灣大道二段往台中港方向": {
      coordinates: [
        [24.1467544, 120.6746171],
        [24.1483763, 120.672787]
      ],
      speed: {
        Now: 22,
        "10_minutes_ago": 32,
        "20_minutes_ago": 42,
        "30_minutes_ago": 50
      }
    },
    "台灣大道二段往台中火車站方向": {
      coordinates: [
        [24.1482833, 120.6726824],
        [24.1466925, 120.6745493]
      ],
      speed: {
        Now: 30,
        "10_minutes_ago": 37,
        "20_minutes_ago": 46,
        "30_minutes_ago": 55
      }
    }
  };
  cctvStreams: string[] = [];
  responseSuggestions: string[] = [];
  public injuredCount: number = 10;
  public deathCount: number = 2;

  trafficHistory = {
    "五權路": [43, 37, 39, 31, 36, 44, 52, 46, 45, 50, 45, 53],
    "台灣大道二段往台中港方向": [56, 57, 58, 66, 73, 70, 74, 73, 69, 69, 71, 71],
    "台灣大道二段往台中火車站方向": [60, 70, 74, 72, 63, 72, 69, 75, 77, 67, 73, 75]
  };

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadData();
    this.updateCasualtyData();
  }

  private loadData(): void {
    this.incidentService.getCurrentIncident().subscribe(incident => {
      this.currentIncident = incident;
      this.lastUpdateTime = new Date(incident.timestamp);
      this.loadPredictionTime();
      this.loadAffectedArea();
      this.loadTrafficFlow();
      this.loadCctvStreams();
      this.loadResponseSuggestions();
    });
  }

  private loadPredictionTime(): void {
    this.incidentService.getPredictionTime(this.currentIncident.id)
      .subscribe(time => this.predictionTime = time);
  }

  private loadAffectedArea(): void {
    this.incidentService.getAffectedArea(this.currentIncident.id)
      .subscribe(area => this.affectedArea = area);
  }

  private loadTrafficFlow(): void {
    this.incidentService.getTrafficFlow(this.currentIncident.id)
      .subscribe(flow => this.trafficFlow = flow);
  }

  private loadCctvStreams(): void {
    this.incidentService.getCctvStreams(this.currentIncident.id)
      .subscribe(streams => this.cctvStreams = streams);
  }

  private loadResponseSuggestions(): void {
    this.incidentService.getResponseSuggestions(this.currentIncident.id)
      .subscribe(suggestions => this.responseSuggestions = suggestions);
  }

  private updateCasualtyData(): void {
    // 这里可以添加从后端API获取伤亡数据的逻辑
    // 暂时使用静态数据
    this.injuredCount = 10;
    this.deathCount = 2;
  }
} 
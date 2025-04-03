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
  lastUpdateTime: Date = new Date('2024-03-11T10:25:00');
  predictionTime: number = 0;
  affectedArea: any = null;
  trafficFlow: any = null;
  cctvStreams: string[] = [];
  responseSuggestions: string[] = [];
  public injuredCount: number = 10;
  public deathCount: number = 2;

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
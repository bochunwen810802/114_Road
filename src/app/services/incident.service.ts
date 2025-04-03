import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = environment.apiUrl;

  // 模擬數據
  private mockIncident = {
    id: 'INC-001',
    timestamp: new Date('2024-03-08T10:30:00'),
    location: '台74線 松竹路段',
    coordinates: [24.1818, 120.722],
    severityLevel: 2,
    description: '多車追撞事故'
  };

  private mockTrafficFlow = Array.from({length: 24}, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000),
    value: Math.floor(Math.random() * 200) + 100
  }));

  private mockAffectedArea = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [120.7243484215214, 24.181003921958435],  // 東南
        [120.72218119666982, 24.183176716158716], // 東北
        [120.72151600884409, 24.183411610612758], // 北
        [120.72016417552084, 24.181933725807266], // 西北
        [120.72112977075174, 24.18029922400173],  // 西南
        [120.72266399428527, 24.179848998269755], // 南
        [120.7243484215214, 24.181003921958435]   // 回到起點
      ]]
    }
  };

  private mockCctvStreams = [
    'https://cctv1.example.com/stream1',
    'https://cctv2.example.com/stream2',
    'https://cctv3.example.com/stream3',
    'https://cctv4.example.com/stream4'
  ];

  private mockResponseSuggestions = [
    '建議改道：松仁路 → 松智路 → 松高路',
    '啟動緊急疏散計畫',
    '派遣額外警力協助交通指揮',
    '通知附近醫院待命',
    '開啟車流分流機制'
  ];

  constructor(private http: HttpClient) { }

  getCurrentIncident(): Observable<any> {
    return of(this.mockIncident);
  }

  getPredictionTime(incidentId: string): Observable<number> {
    // 模擬1-3小時後解除
    return of(Date.now() + Math.floor(Math.random() * 2 + 1) * 3600000);
  }

  getAffectedArea(incidentId: string): Observable<any> {
    return of(this.mockAffectedArea);
  }

  getTrafficFlow(incidentId: string): Observable<any> {
    return of(this.mockTrafficFlow);
  }

  getCctvStreams(incidentId: string): Observable<string[]> {
    return of(this.mockCctvStreams);
  }

  getResponseSuggestions(incidentId: string): Observable<string[]> {
    return of(this.mockResponseSuggestions);
  }
} 
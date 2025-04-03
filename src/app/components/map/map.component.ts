import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() incidentLocation: [number, number] = [0, 0];
  @Input() affectedArea: [number, number][] = [];
  @Input() roadInfo: any = {};
  
  private map!: L.Map;
  private affectedAreaLayer!: L.Polygon;
  private roadLines: { [key: string]: L.Polyline } = {};
  
  // 时间轴相关
  public timePoints: string[] = ['即時車速', '10分鐘前', '20分鐘前', '30分鐘前'];
  public currentTimeIndex: number = 0;
  public currentTimeLabel: string = '即時車速';
  public isPlaying: boolean = false;
  private playInterval: any;
  
  private accidentIcon = L.divIcon({
    className: 'custom-accident-icon',
    html: `<div style="
      width: 40px;
      height: 40px;
      background-color: rgba(0, 123, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 30px;
        height: 30px;
        background-color: #007bff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L14.2 6.6L19.2 7.5L15.6 11L16.5 16L12 13.6L7.5 16L8.4 11L4.8 7.5L9.8 6.6L12 2Z"/>
          <path d="M4 16L8 20M20 16L16 20M8 8L16 16M16 8L8 16"/>
        </svg>
      </div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });

  constructor() { }

  ngOnInit(): void {
    // 自動開始播放
    this.isPlaying = true;
    this.playInterval = setInterval(() => {
      this.currentTimeIndex = (this.currentTimeIndex + 1) % this.timePoints.length;
      this.drawRoads(this.currentTimeIndex);
      this.updateTimeLabel();
    }, 1500); // 每1.5秒切換一次
  }

  ngAfterViewInit(): void {
    // 确保 DOM 元素已经准备好
    setTimeout(() => {
      this.initMap();
    }, 0);
  }
  
  ngOnDestroy(): void {
    // 清除播放定时器
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
  }

  private initMap(): void {
    // 初始化地图
    this.map = L.map('map').setView([this.incidentLocation[0], this.incidentLocation[1]] as L.LatLngTuple, 15);
    
    // 使用浅色地图样式
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
    
    // 添加事故地点标记
    L.marker([this.incidentLocation[0], this.incidentLocation[1]] as L.LatLngTuple, { icon: this.accidentIcon })
      .bindPopup('事故地點')
      .addTo(this.map);
    
    // 添加影响范围图层
    if (this.affectedArea && this.affectedArea.length > 0) {
      this.affectedAreaLayer = L.polygon(this.affectedArea, {
        color: '#ffd700',      // 黄色边框
        weight: 2,             // 边框宽度
        opacity: 0.8,          // 边框透明度
        fillColor: '#ffd700',  // 黄色填充
        fillOpacity: 0.3,      // 填充透明度
        dashArray: '5, 10'     // 虚线边框
      }).addTo(this.map);
    }
    
    // 创建图例
    this.createLegend();
    
    // 绘制道路
    this.drawRoads(this.currentTimeIndex);
  }
  
  // 根据车速返回颜色
  private getColor(speed: number): string {
    if (speed >= 63) return '#33cc33'; // 清楚的绿色 - 順暢
    if (speed >= 37) return '#ff9900'; // 清楚的橙色 - 車多
    return '#ff3333'; // 清楚的红色 - 壅塞
  }
  
  // 绘制道路
  private drawRoads(timeIndex: number): void {
    // 先清除现有的线条
    for (let road in this.roadLines) {
      if (this.roadLines[road]) {
        this.map.removeLayer(this.roadLines[road]);
      }
    }
    
    // 绘制新的线条
    for (let road in this.roadInfo) {
      const roadInfo = this.roadInfo[road];
      const speed = roadInfo.speed[this.timePoints[timeIndex]];
      const color = this.getColor(speed);
      
      const line = L.polyline(roadInfo.coordinates, {
        color: color,
        weight: 8,
        opacity: 0.9
      }).addTo(this.map);
      
      line.bindTooltip(`${road}: ${speed} km/h`);
      this.roadLines[road] = line;
    }
  }
  
  // 创建图例
  private createLegend(): void {
    const legend = new L.Control({position: 'bottomright'});
    
    legend.onAdd = (map: L.Map) => {
      const div = L.DomUtil.create('div', 'legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      div.innerHTML = `
        <h4 style="margin: 0 0 8px 0; color: #333;">車速</h4>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 20px; height: 4px; background: #4CAF50; margin-right: 8px; border-radius: 2px;"></div>
          順暢 (63 km/h以上)
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 20px; height: 4px; background: #FFC107; margin-right: 8px; border-radius: 2px;"></div>
          車多 (37-62 km/h)
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 20px; height: 4px; background: #F44336; margin-right: 8px; border-radius: 2px;"></div>
          壅塞 (0-36 km/h)
        </div>
      `;
      return div;
    };
    
    legend.addTo(this.map);
  }
  
  // 时间滑块变化事件
  public onTimeSliderChange(): void {
    this.drawRoads(this.currentTimeIndex);
    this.updateTimeLabel();
  }
  
  // 更新时间标签
  private updateTimeLabel(): void {
    this.currentTimeLabel = this.timePoints[this.currentTimeIndex];
  }
  
  // 播放/暂停按钮事件
  public togglePlay(): void {
    if (!this.isPlaying) {
      // 继续播放
      this.isPlaying = true;
      
      this.playInterval = setInterval(() => {
        this.currentTimeIndex = (this.currentTimeIndex + 1) % this.timePoints.length;
        this.drawRoads(this.currentTimeIndex);
        this.updateTimeLabel();
      }, 1500); // 每1.5秒切换一次
    } else {
      // 暂停播放
      this.stopPlaying();
    }
  }
  
  // 停止播放
  private stopPlaying(): void {
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }
    this.isPlaying = false;
  }
} 
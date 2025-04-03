import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cctv-stream',
  templateUrl: './cctv-stream.component.html',
  styleUrls: ['./cctv-stream.component.scss']
})
export class CctvStreamComponent implements OnInit, OnDestroy {
  @Input() set streamUrl(value: string) {
    if (value) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
  }
  
  safeUrl!: SafeResourceUrl;
  currentTime: Date = new Date();
  private timeSubscription: Subscription;

  constructor(private sanitizer: DomSanitizer) {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }
} 
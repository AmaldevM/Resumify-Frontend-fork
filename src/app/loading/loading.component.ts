import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/LoadingService';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  private autoStopSub!: Subscription;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    // ⏳ Optional fallback: auto-disable loader after 5 seconds
    this.autoStopSub = timer(5000).subscribe(() => {
      this.loadingService.setLoading(false);
    });
  }

  ngOnDestroy(): void {
    if (this.autoStopSub) {
      this.autoStopSub.unsubscribe();
    }
  }
}

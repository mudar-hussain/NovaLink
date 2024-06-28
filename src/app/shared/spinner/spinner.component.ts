import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  isVisible: boolean = false;
  private spinnerSubscription!: Subscription;

  constructor(private utils: UtilsService) {}

  ngOnInit() {
    this.spinnerSubscription = this.utils.spinnerVisibility$.subscribe(
      (isVisible: boolean) => {
        this.isVisible = isVisible;
      }
    );
  }

  ngOnDestroy() {
    if (this.spinnerSubscription) {
      this.spinnerSubscription.unsubscribe();
    }
  }
}

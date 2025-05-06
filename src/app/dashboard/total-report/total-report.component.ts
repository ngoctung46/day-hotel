import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-total-report',
  imports: [CommonModule],
  templateUrl: './total-report.component.html',
  styleUrl: './total-report.component.css',
})
export class TotalReportComponent {
  @Input() totalPrepaids = 0;
  @Input() totalPayments = 0;
  @Input() totalOrders = 0;
}

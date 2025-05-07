import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuItems = [
    { displayName: 'Quản lý', path: '/dashboard', order: 0 },
    { displayName: 'Danh sách Phòng', path: '/home', order: 1 },
    { displayName: 'Thu/Chi', path: '/payments', order: 3 },
    // { displayName: 'Báo cáo', path: '/reports', order: 2 },
    { displayName: 'Dịch vụ', path: '/products', order: 4 },
    { displayName: 'Đặt phòng', path: '/bookings', order: 5 },
  ].sort((a, b) => a.order - b.order);
}

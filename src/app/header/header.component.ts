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
    { displayName: 'Danh sách Phòng', path: '/home', order: 1 },
    { displayName: 'Báo cáo', path: '/reports', order: 3 },
    { displayName: 'Sản phẩm', path: '/products', order: 2 },
    { displayName: 'Đặt phòng', path: '/bookings', order: 4 },
  ];
}

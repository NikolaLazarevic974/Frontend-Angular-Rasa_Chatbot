import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent  implements OnInit {
  displayedColumns: string[] = ['status', 'items', 'totalPrice', 'actions'];
  dataSource: Order[] = [

    
  ];
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.dataSource = this.orderService.getOrders();
    console.log(this.dataSource);
  }

  cancelOrder(order: any) {
    if (order.status === 'accepted') {
      order.status = 'canceled'; // Change the status to "canceled"
    }
  }

  changeOrderStatus(order: any, newStatus: string) {
    order.status = newStatus; // Update the status to "accepted"
  }
}

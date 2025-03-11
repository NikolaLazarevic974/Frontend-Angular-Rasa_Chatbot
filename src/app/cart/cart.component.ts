import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CartService } from '../services/cart.service';
import { CartAnimal } from '../models/cart.animal.model'; // Adjust import for CartAnimal model
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, AfterViewInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cartService: CartService,
    public orderService: OrderService,
    public userService: UserService
  ) { }

  cartItems: CartAnimal[] = []; // Use CartAnimal model

  ngOnInit(): void {
    this.loadCart();
    this.cartSource.data = this.cartService.getCart();  
  }

  displayedColumns = ["image", "name", "price", "quantity", "remove?"];

  cartSource = new MatTableDataSource<CartAnimal>(); // Use CartAnimal in MatTableDataSource

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.cartSource.sort = this.sort;
    this.cartSource.paginator = this.paginator;
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
  }

  getTotalPrice(): string {
    const total = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return (Math.round(total * 100) / 100).toFixed(2);
  }

  removeItem(id: number): void {
    this.cartService.removeFromCartById(id);
    this.loadCart();
    this.cartSource.data = this.cartService.getCart();  
    this.cartService.showMessage("Item removed from cart");
  }

  doFilter(filterValue: string) {
    this.cartSource.filter = filterValue.trim().toLowerCase();
  }

  checkout() {
    if (this.userService.getCurrentUserId() == 0) {
      this.cartService.showMessage("You have to be logged in to checkout");
      return;
    }

    if (this.cartItems.length > 0) {
      // Add order to order service
      this.orderService.addOrder(this.cartItems);

      // Show success message
      this.cartService.showMessage("Order placed successfully");

      // Clear cart
      this.cartService.removeAllFromCart();
      this.loadCart();
      this.cartSource.data = this.cartService.getCart();
    } else {
      this.cartService.showMessage("Your cart is empty");
    }
  }

  decreaseQuantity(item: CartAnimal) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeItem(item.id);
    }
  }

  increaseQuantity(item: CartAnimal) {
    item.quantity += 1;
  }
}

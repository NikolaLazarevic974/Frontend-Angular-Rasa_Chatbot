import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Animal } from '../../models/animal.model';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})
export class AnimalComponent {
  animalForInput!: Animal;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public cartService: CartService,
    public userService: UserService,
    public orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.animalForInput = {
      id: this.data.animal.id,
      name: this.data.animal.name,
      type: this.data.animal.type,
      species: this.data.animal.species,
      description: this.data.animal.description,
      age: this.data.animal.age,
      sizes: this.data.animal.sizes,
      price: this.data.animal.price,
      image: this.data.animal.image,
      reviews: this.data.animal.reviews
    };
  }

  onSubmit(form: NgForm): void {
    if (this.userService.getCurrentUserId() === 0) {
      this.cartService.showMessage('You have to log in to leave a review');
      return;
    }

    if (
      !this.orderService.order_items.some(
        (order: Order) =>
          order.status === 'delivered' &&
          order.cartAnimals.some(
            (cartAnimals) => cartAnimals.id === this.animalForInput.id
          )
      )
    ) {
      this.cartService.showMessage('You can only leave a review for delivered items.');
      return;
    }

    if (!form.value.review || form.value.review.trim().length === 0) {
      console.log('You cannot leave an empty review');
      return;
    }

    const review = form.value.review;
    this.animalForInput.reviews = this.animalForInput.reviews || [];
    this.animalForInput.reviews.push(review);
    this.cartService.showMessage('Thank you for leaving a review!', 'Enjoy');
    form.resetForm();
  }

  addToCart(animal: Animal): void {
    this.cartService.addToCart(animal);
    this.cartService.showMessage(animal.name + ' added to cart', 'Great!');
  }

  getFullSize(size: string): string {
    switch(size) {
      case "XS":
        return "Very small";
      case 'S':
        return 'Small';
      case 'M':
        return 'Medium';
      case 'L':
        return 'Large';
      case 'XL':
        return 'Extra Large';
      default:
        return size; // Return the original if no match
    }
  }
  
}

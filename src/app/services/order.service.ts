import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Order } from "../models/order.model";
import { v4 as uuidv4 } from 'uuid';
import { CartAnimal } from "../models/cart.animal.model";
import { nanoid } from 'nanoid';

@Injectable()
export class OrderService {

    constructor(public snackBar: MatSnackBar) {};

    order_items: Order[] = [
        {
            "id": " px32tE1-EiroYbJEfBGls",
            "cartAnimals": [
                {
                    "id": 2,
                    "name": "Betta",
                    "species": "Betta splendens",
                    "description": "An aggressive, colorful freshwater fish commonly kept in aquariums.",
                    "age": 1,
                    "sizes": "XS",
                    "price": 12.49,
                    "reviews": [
                        "Stunning colors!",
                        "Easy to care for."
                    ],
                    "image": "fish_images/betta.jpg",
                    "quantity": 2
                },
                {
                    "id": 5,
                    "name": "Angelfish",
                    "species": "Pterophyllum scalare",
                    "description": "A graceful freshwater fish with an iconic triangular shape.",
                    "age": 2,
                    "sizes": "L",
                    "price": 15.99,
                    "image": "fish_images/angelfish.jpg",
                    "reviews": [
                        "Majestic and elegant.",
                        "Perfect for community tanks."
                    ],
                    "quantity": 1
                }
            ],
            "totalPrice": 40.97,
            "status": "in transit"
        },
        {
            "id": " px23tE1-EiroYbJEfBGls",
            "cartAnimals": [
                {
                    "id": 5,
                    "name": "Angelfish",
                    "species": "Pterophyllum scalare",
                    "description": "A graceful freshwater fish with an iconic triangular shape.",
                    "age": 2,
                    "sizes": "L",
                    "price": 15.99,
                    "reviews": [
                        "Majestic and elegant.",
                        "Perfect for community tanks."
                    ],
                    "image": "fish_images/angelfish.jpg",
                    "quantity": 1
                }
            ],
            "totalPrice": 15.99,
            "status": "delivered"
        }
    ];
      
    addOrder(cartAnimals: CartAnimal[]) {
        const totalPrice = cartAnimals.reduce((total, item) => total + (item.price * item.quantity), 0);
  
        const order: Order = {
            id: nanoid(),
            cartAnimals,
            totalPrice: totalPrice,
            status: "accepted"
        };
        this.order_items.push(order);
        console.log(order);
    }

    getOrders() {
        return this.order_items;
    }

    removeOrderById(id: string) {
        const index = this.order_items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.order_items.splice(index, 1);
        }
    }

    cancelOrder(id: string) {
        const order = this.order_items.find(item => item.id === id);
        if (order && order.status === "accepted") {
            order.status = "canceled";
        }
     }

    showMessage(message: string, button: string = "Close") {
        this.snackBar.open(message, button, {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
}
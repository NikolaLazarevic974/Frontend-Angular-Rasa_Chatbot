import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CartAnimal } from "../models/cart.animal.model"; // Use the CartAnimal model
import { Animal } from "../models/animal.model"; // Import Animal model

@Injectable()
export class CartService {

    constructor(public snackBar: MatSnackBar) {};

    cart_items: CartAnimal[] = []; // Use CartAnimal type

    addToCart(animal: Animal) { // Change parameter to Animal
        const existingItem = this.cart_items.find(item => item.id === animal.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const cartAnimal: CartAnimal = {
                ...animal,
                quantity: 1
            };
            this.cart_items.push(cartAnimal);
            this.showMessage(animal.name + " added to the cart")
            console.log(this.cart_items)
        }
    }

    getCart() {
        return this.cart_items;
    }

    removeFromCartById(id: number) {
        const index = this.cart_items.findIndex(item => item.id === id);
        if (index !== -1) {
            this.cart_items.splice(index, 1);
        }
    }

    removeAllFromCart() {
        this.cart_items = [];
    }

    showMessage(message: string, button: string = "Close") {
        this.snackBar.open(message, button, {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}

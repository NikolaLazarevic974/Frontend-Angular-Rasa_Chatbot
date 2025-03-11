import { CartAnimal} from "./cart.animal.model";

export interface Order {
    id: string;
    cartAnimals: CartAnimal[];
    totalPrice: number;
    status: "accepted" | "delivered" | "in transit" | "canceled";
}
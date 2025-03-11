export interface CartAnimal {
    id: number;
    name: string;
    species: string;
    description: string;
    age: number;
    sizes: "XS" | "S" | "M" | "L" | "XL";
    price: number;
    reviews?: string[];
    image?: string | null;
    quantity: number;
}
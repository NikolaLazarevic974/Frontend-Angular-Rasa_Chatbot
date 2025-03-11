export interface Animal {
    id: number;
    name: string;
    type: "fish" | "dog" | "cat" | "parrot" | "hamster" | "chinchilla";
    species: string;
    description: string;
    age: number;
    sizes: "XS" | "S" | "M" | "L" | "XL";
    price: number;
    reviews?: string[];
    image?: string | null;
}
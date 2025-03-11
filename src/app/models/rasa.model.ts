import { Animal } from "./animal.model"

interface Custom {
   action: string | null;
   ids?: string[] | null; // Array of pet IDs
 }

export interface RasaModel {
   recipient_id: string
   image: string | null
   attachment: null | string
   custom: Custom
   text: string | null
}
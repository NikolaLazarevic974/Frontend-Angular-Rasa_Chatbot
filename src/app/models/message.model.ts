import { SafeKeyedRead } from "@angular/compiler"
import { SafeHtml } from "@angular/platform-browser"

export interface MessageModel {
    type: 'user' | 'bot'
    text: string | SafeHtml
}
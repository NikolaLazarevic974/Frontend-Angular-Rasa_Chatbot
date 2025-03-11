import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RasaModel } from '../models/rasa.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private static instance: WebService
  private client: HttpClient

  private constructor() {
    this.client = inject(HttpClient)
  }

  public static getInstance() {
    if (this.instance == undefined)
      this.instance = new WebService()
    return this.instance
  }

  public formatDate(iso: string | null) {
    if (iso == null) return 'On Time'
    return new Date(iso).toLocaleString('sr-RS')
  }

  public formatValue(str: any | null) {
    if (str == null) return 'N/A'
    return str
  }

  private retrieveRasaSession() {
    if (!localStorage.getItem('session'))
      localStorage.setItem('session', uuidv4())

    return localStorage.getItem('session')
  }

  public sendRasaMessage(value: string) {
    const url = '/webhooks/rest/webhook'
    return this.client.post<RasaModel[]>(url,
      {
        sender: this.retrieveRasaSession(),
        email: localStorage.getItem('active') ? localStorage.getItem('active') : null,
        message: value
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
  }
}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowAuthCardService {
  private showCard: boolean;

  constructor() {
    this.showCard = false;
  }

  toggleCard() {
    this.showCard = !this.showCard;
  }

  getCard() {
    return this.showCard;
  }
}

import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CartComponent } from './cart/cart.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { ProfileComponent } from './auth/profile/profile.component';
import { WebService } from './services/web.service';
import { MessageModel } from './models/message.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RasaModel } from './models/rasa.model';
import { OrderComponent } from './order/order.component';
import { AnimalService } from './services/animal.service';
import { LowerCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AnimalComponent } from './shopping/animal/animal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  webService = WebService.getInstance();
  title = 'Pet Shop';

  waitingForResponse = false;
  botThinkingPlaceholder = 'Thinking...';
  isChatVisible = false;
  userMessage: string = '';
  messages: MessageModel[] = [];
  profileOpened: boolean = false;

  constructor(public userService: UserService, public dialog: MatDialog, public animalService: AnimalService, private sanitizer: DomSanitizer,
    private renderer: Renderer2, public cartService: CartService ) {}

  @ViewChild('chatBody', { static: false }) chatBody: ElementRef | undefined;
  
  openOrders() {
    const articleDialog = this.dialog.open(OrderComponent, {
      width:'800px',
      height: '60vh',
      data: {}
    });
  }

  openCart() {
    const articleDialog = this.dialog.open(CartComponent, {
      width:'900px',
      height: '60vh',
      data: {}
    });
  }

  ngOnInit(): void {
    // Check if there are any messages saved
    if (!localStorage.getItem('messages')) {
      localStorage.setItem('messages', JSON.stringify([
        { type: 'bot', text: 'Hey I am Scooby! How can I assist you today?' }
      ]));
    }

    this.messages = JSON.parse(localStorage.getItem('messages')!);
  }

  ngAfterViewChecked(): void {
    // Scroll to bottom after view has been updated
    if (this.chatBody) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  pushMessage(message: MessageModel) {
    if (message.type == 'bot' && message.text == this.botThinkingPlaceholder)
      this.waitingForResponse = true

    if (message.type == 'bot' && message.text != this.botThinkingPlaceholder) {
      // Try to find the thinking placeholder message
      for (let m of this.messages) {
        if (m.type == 'bot' && m.text == this.botThinkingPlaceholder) {
          m.text = message.text
          this.waitingForResponse = false
          return
        }
      }
    }

    this.messages.push(message);
    // Save messages in local storage
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  sendMessage() {
    // If already waiting for a response, do not send a new message
    if (this.waitingForResponse) return;
  
    if (this.userMessage.trim()) {
      const trimmedInput = this.userMessage;
      // Reset user input
      this.userMessage = '';
  
      // Push user message to the chat
      this.pushMessage({ type: 'user', text: trimmedInput });
  
      this.waitingForResponse = true; // Indicate we are waiting for a response
  
      // Send the message to the bot
      this.webService.sendRasaMessage(trimmedInput)
        .subscribe(
          (rsp: RasaModel[]) => {
            this.waitingForResponse = false; // Reset after response is received
  
            if (rsp.length == 0) {
              this.pushMessage({
                type: 'bot',
                text: 'Sorry, I did not understand your question.'
              });
              return;
            }
  
            rsp.forEach(msg => {
              // Handle bot message (including images, flight cards, etc.)
              let responseText: SafeHtml | string = msg.text || '';
              console.log(msg)
              let html = '';
              // if (msg.image) {
              //   responseText = `<img src="${msg.image}" width="200">`;
              // } else
              if (msg.custom) {
                if (msg.custom.action === "ActionRecommendPet" && Array.isArray(msg.custom.ids)) {
                  for (const id of msg.custom.ids) {
                    const item = this.animalService.getAnimalById(Number(id));
                    html += `
                      <br>
                      <div class="card">
                        <img src="assets/images/${item.image}" width="200" height="150" style="object-fit: cover;">
                          <div class="card-body">
                            <p>${item.name} is a ${this.getFullSize(item.sizes)} sized ${item.type}</p>
                            <p>${item.description}</p>
                            <button class="learn-more-button" data-id="${item.id}" style="padding:5px 3px; font-size:16px; ">Learn More</button>
                            <button class="add-to-cart-button" data-id="${item.id}" style="padding:5px 3px; font-size:16px; ">Add To Cart</button>
                          </div>
                      </div>
                    `;
                    responseText = this.sanitizer.bypassSecurityTrustHtml(html);
                  }
                }
                if (msg.custom.action === "ActionGetCartInfo") {
                  html += `
                  <p>If you want a more detailed overview</p>
                  <div style="display:flex; justify-content:center;"
                    <button class="go-to-cart-button" style="padding:5px 3px; font-size:12px; ">Go To Cart</button>
                  </div>
                  `;
                  responseText = this.sanitizer.bypassSecurityTrustHtml(html);
                }
                if (msg.custom.action === "ActionGetOrderStatus") {
                  html += `
                  <p>If you want a more detailed overview</p>
                  <div style="display:flex; justify-content:center;"
                    <button class="go-to-orders-button"  style="padding:5px 3px; font-size:12px; ">Go To Orders</button>
                  </div>
                  `;
                  responseText = this.sanitizer.bypassSecurityTrustHtml(html);
                }
              }
  
              this.pushMessage({
                type: 'bot',
                text: responseText
              });
              
            });
            setTimeout(() => {
              const buttons = document.querySelectorAll('.learn-more-button');
              buttons.forEach(button => {
                this.renderer.listen(button, 'click', (event) => {
                  const itemId = (event.target as HTMLElement).getAttribute('data-id');
                  this.openAnimal(Number(itemId));
                });
              });

              const buttons2 = document.querySelectorAll('.add-to-cart-button');
              buttons2.forEach(button => {
                this.renderer.listen(button, 'click', (event) => {
                  const itemId = (event.target as HTMLElement).getAttribute('data-id');
                  const animal = this.animalService.getAnimalById(Number(itemId));
                  this.cartService.addToCart(animal);
                });
              });

              const buttons3 = document.querySelectorAll('.go-to-cart-button');
              buttons3.forEach(button => {
                this.renderer.listen(button, 'click', (event) => {
                  this.openCart();
                });
              });

              const buttons4 = document.querySelectorAll('.go-to-orders-button');
              buttons4.forEach(button => {
                this.renderer.listen(button, 'click', (event) => {
                  this.openOrders();
                });
              });
            }, 0);
          },
          (err: HttpErrorResponse) => {
            this.waitingForResponse = false; // Reset after error
            this.pushMessage({
              type: 'bot',
              text: 'Sorry, I am not available at the moment.'
            });
          }
        );
    }
  }

  openProfile(userId: number) {
    this.profileOpened = true;
    const profileDialog = this.dialog.open(ProfileComponent, {
      disableClose: true,
      width:'50vw',
      height:'30vw',
      data: {user: this.userService.getUserById(userId)}
    });

    profileDialog.afterClosed().subscribe((r) => {
      this.profileOpened = false;
    })
  } 

  getFullSize(size: string): string {
    switch(size) {
      case "XS":
        return "very small";
      case 'S':
        return 'small';
      case 'M':
        return 'medium';
      case 'L':
        return 'large';
      case 'XL':
        return 'extra Large';
      default:
        return size; // Return the original if no match
    }
  }

  openAnimal(id: number) {
    const dialogRef = this.dialog.open(AnimalComponent, {
      width: '800px',
      height: '50vh',
      data: { animal: this.animalService.getAnimalById(id) }
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
  
}

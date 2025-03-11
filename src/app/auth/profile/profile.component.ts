import { Component, Inject, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  isEditing: boolean = false;
  profileForInput!: User;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public userService: UserService) {}
  
  ngOnInit(): void {
    
    this.profileForInput = {
      id: this.data.user.id,
      email: this.data.user.email,
      date: this.data.user.date,
      password: this.data.user.password,
      address: this.data.user.address,
      phone_number: this.data.user.phone_number
    }
  }

  enableEdit() {

    this.isEditing = !this.isEditing;
    console.log('click')

  }

  finishEditing() {
    this.data.user.email = this.profileForInput.email,
    this.data.user.password = this.profileForInput.password,
    this.data.user.address = this.profileForInput.address,
    console.log(this.data.user);
    console.log(UserService.dummyUserList);
    this.isEditing = false;
     
  }

  logout() {
    this.userService.logout();
  }

}

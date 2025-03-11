import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  errorExists = false;
  errorText = '';

  constructor (private userService: UserService, private router: Router, private _snackBar: MatSnackBar) {}

  onSubmit(form: NgForm) {
    if (!this.userService.getUser(form.value.email)) {
      this.errorExists = false;
      var newUser = this.userService.registerUser(form.value.email, form.value.password, form.value.birthday, form.value.adress, form.value.phone_number);
      this.router.navigate(['']);
      
    } else {
      this.errorExists = true;
      this.errorText = "User with this email address already exists.";
      console.log(this.errorText);
    }
  
  }

    

  

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }




}

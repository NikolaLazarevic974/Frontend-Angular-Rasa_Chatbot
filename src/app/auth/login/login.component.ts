import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  errorExists = false;
  errorText = '';

  constructor (private userService: UserService, private router: Router, private _snackBar: MatSnackBar) {}

  onSubmit(form: NgForm){
    var email = form.value.email;
    var password = form.value.password;

    var user = this.userService.getUser(email);

    if (!user) {
      this.errorExists = true;
      this.errorText = "There is no user with those credentials";
      return
    }

    var isPasswordValid = this.userService.isPasswordCorrect(email, password);

    if (!isPasswordValid) {
      this.errorExists = true;
      this.errorText = "There is no user with those credentials";
      return
    }
    

    this.userService.getCurrentUserId();

    this.openSnackBar("Welcome", "done")

    this.router.navigate(['']);




  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }


}
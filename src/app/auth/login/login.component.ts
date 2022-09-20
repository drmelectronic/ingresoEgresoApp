import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    'correo': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const {correo, password} = this.loginForm.value;
    this.authService.login(correo, password)
      .then(credentials => {
        console.log(credentials);
        this.router.navigate(['/']);
      })
      .catch(err => console.error(err));
  }

}

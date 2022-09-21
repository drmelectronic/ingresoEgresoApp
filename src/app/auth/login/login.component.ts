import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

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
    Swal.fire('Espere por favor...');
    Swal.showLoading();
    this.authService.login(correo, password)
      .then(() => {
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err => Swal.fire('Oops...', err.message, 'error'));
  }

}

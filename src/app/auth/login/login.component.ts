import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import * as ui from "../../shared/ui.actions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnDestroy {

  loginForm: FormGroup = this.fb.group({
    'correo': ['', [Validators.required, Validators.email]],
    'password': ['', Validators.required],
  })
  loading = false;
  private uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) {
    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.loading = ui.isLoading
      console.log('loading', this.loading);
    });}


  onSubmit() {
    const {correo, password} = this.loginForm.value;
    this.store.dispatch(ui.isLoading());
    // Swal.fire('Espere por favor...');
    // Swal.showLoading();
    this.authService.login(correo, password)
      .then(() => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Oops...', err.message, 'error')
      });
  }

  ngOnDestroy() {
    this.uiSubscription.unsubscribe();
  }
}

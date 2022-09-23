import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import * as ui from "../../shared/ui.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnDestroy {

  registroForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', Validators.required],
    password: ['', Validators.required],
  });
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

  crearUsuario() {
    if (this.registroForm.invalid) {return;}
    const {nombre, correo, password} = this.registroForm.value;
    this.store.dispatch(ui.isLoading());
    // Swal.fire('Espere por favor...');
    this.authService.crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);
        this.store.dispatch(ui.stopLoading());
        // Swal.close();
        this.router.navigate(['/'])
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

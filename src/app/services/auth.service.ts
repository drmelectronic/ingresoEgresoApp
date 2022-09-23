import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Subscription} from "rxjs";
import {UserFirebaseInterface, Usuario} from "../models/usuario.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AppState} from "../app.reducer";
import {Store} from "@ngrx/store";
import * as authActions from "../auth/auth.actions";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription?: Subscription = undefined;

  constructor(private auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe(fuser => {
      if (fuser) {
         this.userSubscription = this.firestore.doc<UserFirebaseInterface>(`${fuser.uid}/usuario`).valueChanges().subscribe(
           firestoreUser => {
             if (firestoreUser) {
               console.log(firestoreUser);
               const user = Usuario.fromFirebase(firestoreUser);
               this.store.dispatch(authActions.setUser({user}));
             }
           }
         );
      } else {
        this.userSubscription?.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {

    return this.auth.createUserWithEmailAndPassword(email, password).then(
      ({user}) => {
        if (user) {
          const newUser = new Usuario(user.uid, nombre, user.email);
          return this.firestore.doc(`${user.uid}/usuario`)
            .set({...newUser});
        } else {
          return new Promise(() => null);
        }
      }
    );
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map(fuser => fuser !== null));
  }
}

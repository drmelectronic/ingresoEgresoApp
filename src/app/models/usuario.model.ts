export interface UserFirebaseInterface {
  email: string;
  nombre: string;
  uid: string;
}

export class Usuario {

  constructor(
    public uid: string,
    public nombre: string,
    public email: string | null
  ) {}

  static fromFirebase({email, nombre, uid}: UserFirebaseInterface) {
    return new Usuario(uid, nombre, email);
  }
}

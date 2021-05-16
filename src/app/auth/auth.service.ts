import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import auth from 'firebase';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from '../store/users/users.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: CustomToastrService,
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }),
      catchError((err) => {
        this.toastr.error(err);
        return of(err);
      })
    );
  }

  async googleSignin() {
    const provider = new auth.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider).then((credential) =>
      this.updateUserData(credential.user));
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      auth: {
        basic: true
      }
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    window.localStorage.clear();
    if (this.router.url !== '/home' && this.router.url !== '/') {
      this.router.navigate(['/home']);
    }
  }
}

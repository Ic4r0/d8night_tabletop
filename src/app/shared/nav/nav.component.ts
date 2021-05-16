import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Quote } from 'src/app/store/quotes/quotes.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/store.model';
import { getQuotesList } from 'src/app/store/store.reducer';
import { User } from 'src/app/store/users/users.model';
import { ShowAuthCardService } from 'src/app/services/show-auth-card.service';
import { setCurrentUser } from 'src/app/store/users/users.actions';
import { ModalComponent } from '../modal/modal.component';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { UsersApiService } from 'src/app/services/users-api.service';
declare var UIkit: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('navbar', {static: true}) navbar: ElementRef;
  @ViewChild('offcanvasNav', {static: true}) offcanvasNav: ElementRef;
  @ViewChild('signOutModal', {static: true}) signOutModal: ModalComponent;

  chosenQuote = '';
  quotes: Array<Quote> = [];
  subscriptions: Subscription[] = [];

  loading = false;

  isHome = true;

  user: User;
  isPlayer = false;
  isAdmin = false;
  cookieConsent = false;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>,
              private authCardService: ShowAuthCardService,
              private ccService: NgcCookieConsentService,
              private usersService: UsersApiService) {
    this.subscribeRouterEvents();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.ccService.statusChange$.subscribe(() => {
        if (!!this.user) {
          this.usersService.privacyConsent(this.user.uid);
        }
      }),
      this.store.select(getQuotesList).subscribe((list) => {
        this.quotes = [...list];
      }),
      this.authService.user$.subscribe((authUser: User) => {
        if (!!authUser) {
          this.user = User.objectFromREST(authUser);
          this.store.dispatch(setCurrentUser({ user: this.user }));
          this.isPlayer = this.user.auth.player;
          this.isAdmin = this.user.auth.admin;
          this.cookieConsent = this.user.privacyConsent;

          if (this.cookieConsent) {
            this.ccService.close(false);
          } else {
            this.ccService.open();
          }
        } else {
          this.ccService.close(false);
          this.user = null;
          this.store.dispatch(setCurrentUser(null));
          this.isPlayer = false;
          this.isAdmin = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  subscribeRouterEvents = () => {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
       this.isHome = this.router.url === '/home';
       if (!!this.user && !this.cookieConsent && this.isHome) {
         this.ccService.open();
      } else if (!!this.user && !this.cookieConsent && !this.isHome) {
        this.ccService.close(false);
       }
    });
  }

  async login() {
    await this.authService.googleSignin();
    if (this.router.url !== '/home' && this.router.url !== '/') {
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    this.loading = true;
    await this.authService.signOut();
    this.signOutModal.hide();
    this.loading = false;
  }

  showSignOutModal() {
    this.signOutModal.show();
  }

  toggleNavbar(): void {
    this.changeQuote();
    UIkit.offcanvas(this.offcanvasNav.nativeElement).toggle();
  }

  toggleAuthCard() {
    if (!!this.user && (!this.isPlayer && !this.isAdmin)) {
      this.authCardService.toggleCard();
    }
  }

  changeQuote(): void {
    if (this.quotes.length > 0) {
      this.chosenQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)].quote;
    }
  }

}

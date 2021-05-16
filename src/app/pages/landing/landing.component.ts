import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowAuthCardService } from 'src/app/services/show-auth-card.service';
import { User } from 'src/app/store/users/users.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isPlayer = false;
  isAdmin = false;
  isLogged = false;

  constructor(private titleService: Title,
              private authService: AuthService,
              public showAuthCard: ShowAuthCardService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('d8 Night');
    this.subscription = this.authService.user$.subscribe((authUser: User) => {
      if (!!authUser) {
        const user = User.objectFromREST(authUser);
        this.isLogged = true;
        this.isPlayer = user.auth.player;
        this.isAdmin = user.auth.admin;
      } else {
        this.isLogged = false;
        this.isPlayer = false;
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

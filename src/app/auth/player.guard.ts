import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService} from './auth.service';
import { Observable } from 'rxjs';
import { tap, map, first } from 'rxjs/operators';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable()
export class PlayerGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router,
              private toastr: CustomToastrService) {}

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      first(),
      map((user) => !!user?.auth.player),
      tap(isPlayer => {
        if (!isPlayer) {
          this.toastr.warning(
            'Non sei autorizzato a visualizzare questa pagina',
            'Attenzione'
          );
          this.router.navigate(['/home']);
        }
      })
    );

  }
}

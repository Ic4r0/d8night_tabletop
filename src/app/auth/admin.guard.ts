import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService} from './auth.service';
import { Observable } from 'rxjs';
import { tap, map, first } from 'rxjs/operators';
import { CustomToastrService } from '../shared/custom-toastr/custom-toastr.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService,
              private router: Router,
              private toastr: CustomToastrService) {}

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      first(),
      map((user) => !!user?.auth.admin),
      tap(isAdmin => {
        if (!isAdmin) {
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

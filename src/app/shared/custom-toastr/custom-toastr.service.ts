import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {

  constructor(private toastr: ToastrService) { }

  success(message: string = 'Operation performed correctly.',
          title: string = 'Success') {
    this.toastr.success(message, title);
  }

  error(err: any) {
    if (Array.isArray(err)) {
      this.toastr.error('Multiple unexpected errors have occurred.', 'Error');
    } else {
      this.toastr.error('An unexpected error has occurred.', 'Error');
    }
  }

  debugError(err: any) {
    if (Array.isArray(err)) {
      err.forEach((x) => {
        this.toastr.error(x.message, x.name);
      });
    } else {
      this.toastr.error(err.message, err.name);
    }
  }

  warning(message: string,
          title: string) {
    this.toastr.warning(message, title);
  }

  info(message: string,
       title: string) {
    this.toastr.info(message, title);
  }
}

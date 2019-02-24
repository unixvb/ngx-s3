import { Component } from '@angular/core';

import { AuthService } from '../service';

@Component({
  template: ``
})
export class SignoutComponent {

  constructor(private authService: AuthService) {
    this.authService.signout();
  }
}

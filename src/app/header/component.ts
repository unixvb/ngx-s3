import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth';

@Component({
  selector: 'app-header',
  templateUrl: 'component.html',
  styleUrls: ['component.scss']
})
export class HeaderComponent implements OnInit {
  signedInUserName: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getCurrentUser((err, signedInUser) => {
      this.signedInUserName = signedInUser.username;
    });
  }
}

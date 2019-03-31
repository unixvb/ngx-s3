import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  signedInUserName: string;

  constructor(private authService: AuthService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authService.currentStatus$.subscribe(() => this.updateUserData());
  }

  public onSignOut() {
    this.authService.signout();
  }

  private updateUserData() {
    this.authService.getCurrentUser((err, signedInUser) => {
      this.signedInUserName = signedInUser.username;
      this.changeDetector.detectChanges();
    });
  }
}

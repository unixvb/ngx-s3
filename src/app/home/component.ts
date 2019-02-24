import { Component, OnInit } from '@angular/core';
import { URLUtil } from '../../utils';

/**
 * Container for security scans.
 */
@Component({
  selector: 'app-home',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class HomeComponent implements OnInit {
  baseUrl: string;

  constructor() { }

  ngOnInit() {
    this.baseUrl = URLUtil.getBaseUrl();
  }
}

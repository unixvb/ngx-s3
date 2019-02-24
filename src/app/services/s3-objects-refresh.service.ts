import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class S3ObjectsRefreshService {
  changes$ = new Subject<any>();
}

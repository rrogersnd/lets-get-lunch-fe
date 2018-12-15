import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { LocalStorageService } from 'ngx-webstorage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap'


@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
    private localStorage: LocalStorageService) { }

  signup(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/users', credentials)
      .mergeMap(res => this.login(credentials));
  }

  login(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/sessions', credentials)
      .map((res: any) => {
        this.localStorage.store('Authorization', res.token);
        return res;
      });
  }

}

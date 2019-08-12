import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AppGlobals } from './app.globals';

export class Item {
    menu_src: string;
    user_id: string;
}

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private http: HttpClient,
        private globals: AppGlobals,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
        if (sessionStorage.getItem('currentUser') && this.globals.userPermission !== null) {
            let user = JSON.parse(sessionStorage.getItem('currentUser'));
            this.globals.userId = user.user_id;
            this.globals.userName = user.user_name;
            this.globals.userPosition = user.position_name;

            // 접근권한 체크
            if (route.routeConfig.path && ("id" in route.routeConfig.data) ) {
                if (route.routeConfig.data.id in this.globals.userPermission) {
                    if (this.globals.userPermission[route.routeConfig.data.id]['access_auth'] == false
                        && this.globals.userPermission[route.routeConfig.data.id]['executive_auth'] == false) {
                        alert('접근권한이 없습니다.');
                        return false;
                    } else {
                        return true;
                    }
                }
                return true;
            } else {
                return true;
            }
            // logged in so return true
            // return true;
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/auth/session']);
            return false;
        }
    }

    CheckAuth (userId, menuSrc) {
        let data = {
            'user_id': userId,
            'menu_src': menuSrc
        };
        return this.http.post(this.globals.serverUrl + '/permissions/check', data);
    }
}

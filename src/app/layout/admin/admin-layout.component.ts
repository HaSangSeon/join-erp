import { Component, NgModule, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../environments/environment';
import { AppGlobals } from '../../app.globals';
import { UserService } from '../../user.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'app-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.css'],
    providers: [UserService]
})

export class AdminLayoutComponent implements OnInit {
    title = 'JOIN ERP';
    version = AppConfig.VERSION;
    page_title: string = '메인';
    navitems = this.globals.configs['menu'];
    currentMenu: string;
    currentSubmenu: string;
    isAsideFolded: boolean = false;
    isAsideShow: boolean = false;
    isNavebarshow: boolean = false;
    userId: string = this.globals.userId;
    userName: string = this.globals.userName;
    userPosition: string = this.globals.userPosition;

    constructor(
        private electronService: ElectronService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private globals: AppGlobals,
        private dataService: UserService,
        private titleService: Title
    ) {}

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if ( event instanceof NavigationEnd ) {
                this.currentMenu = this.getActiveGroupMenu();
                this.currentSubmenu = this.router.url;
            }
        });

        this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .map(() => this.activatedRoute)
        .map((route) => {
            while (route.firstChild) route = route.firstChild;
            return route;
        })
        .filter((route) => route.outlet === 'primary')
        .mergeMap((route) => route.data)
        .subscribe((event) => {
            this.titleService.setTitle(event['title']);
            this.page_title = event['title'];
        });
    }

    getActiveGroupMenu() {
        let toArray = this.router.url.split('/');
        let ret = toArray[0] + '/' + toArray[1];
        if (ret == '/settings') {
            ret = ret + '/' + toArray[2];
        }
        return ret;
    }

    toggleButtonClick(target:string) {
        switch (target) {
            case 'app-aside-folded':
                this.isAsideFolded = this.isAsideFolded === true ? false : true;
            break;
            case 'app-aside':
                this.isAsideShow = this.isAsideShow === true ? false : true;
            break;
            case 'navbar-collapse':
                this.isNavebarshow = this.isNavebarshow === true ? false : true;
            break;
        }
    }

    Logout() {
        this.dataService.logout();
        this.router.navigate(['/auth/session']);
    }

    closeWindow() {
        this.dataService.logout();
        this.electronService.remote.getCurrentWindow().close();
    }
}

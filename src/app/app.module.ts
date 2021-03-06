import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxBarcodeModule } from 'ngx-barcode';

import { HttpClientModule, HttpClient } from '@angular/common/http';

// Global Variables
import { AppGlobals } from './app.globals';

// Routing Module - Structure Moudules Lazy Loading
import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

// Directives
import { WebviewDirective } from './directives/webview.directive';

// Auth
import { AuthGuard } from './app.auth';

// Layout Components
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layout/admin/admin-layout.component';
import { AuthLayoutComponent } from './layout/auth/auth-layout.component';
import { PrintLayoutComponent } from './layout/print/print-layout.component';

// Shared Services
import { SharedModule } from './structure/shared/shared.module';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';
import { MessageService } from './message.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        PrintLayoutComponent,
        WebviewDirective,
        PageNotFoundComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgxBarcodeModule,
        NgxDatatableModule,
        SharedModule,
        HttpClientModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (HttpLoaderFactory),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        ElectronService,
        AppGlobals,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: (configService:ConfigService) => () => { return configService.load(); },
            deps: [ConfigService],
            multi: true
        },
        UtilsService,
        AuthGuard,
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

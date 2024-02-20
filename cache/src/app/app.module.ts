import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { NgHttpCachingModule ,NgHttpCachingConfig ,NgHttpCachingStrategy } from 'ng-http-caching';

import { NgxPaginationModule } from 'ngx-pagination';
// your config...
const ngHttpCachingConfig: NgHttpCachingConfig = {
  lifetime: 1000 * 10 ,// cache expire after 10 seconds
  allowedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  cacheStrategy: NgHttpCachingStrategy.DISALLOW_ALL
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    NgxPaginationModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

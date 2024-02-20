import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgHttpCachingModule, NgHttpCachingConfig } from 'ng-http-caching';
import { HttpClientModule } from '@angular/common/http';
//import { ImgCacheModule } from 'ng-imgcache';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';

// your config...
// const ngHttpCachingConfig: NgHttpCachingConfig = {
//   lifetime: 1000 * 10 // cache expire after 10 seconds
// };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //NgHttpCachingModule.forRoot(ngHttpCachingConfig),
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

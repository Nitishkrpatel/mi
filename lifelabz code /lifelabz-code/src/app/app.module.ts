import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




import { NavbarComponent } from './navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomepageComponent } from './homepage/homepage.component';
import { FooterComponent } from './footer/footer.component';
import { OverviewComponent } from './know-avi/overview/overview.component';
import { FeaturesComponent } from './know-avi/features/features.component';
import { SpecificationComponent } from './know-avi/specification/specification.component';
import { PricingComponent } from './pricing/pricing.component';
import { SupportComponent } from './support/support.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { KnowAviComponent } from './know-avi/know-avi.component';
import { AppsComponent } from './know-avi/apps/apps.component';
import { AddOnSectionComponent } from './add-on-section/add-on-section.component';
import { BuyAviComponent } from './buy-avi/buy-avi.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { StepperPositionDirective } from './homepage/stepper-position.directive';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    FooterComponent,
    OverviewComponent,
    FeaturesComponent,
    SpecificationComponent,
    PricingComponent,
    SupportComponent,
    AboutusComponent,
    ContactusComponent,
    KnowAviComponent,
    AppsComponent,
    AddOnSectionComponent,
    BuyAviComponent,
    TermsAndConditionsComponent,
    StepperPositionDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatStepperModule,
    MatTooltipModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxIntlTelInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

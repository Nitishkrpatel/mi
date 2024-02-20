import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AddOnSectionComponent } from './add-on-section/add-on-section.component';
import { BuyAviComponent } from './buy-avi/buy-avi.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AppsComponent } from './know-avi/apps/apps.component';
import { FeaturesComponent } from './know-avi/features/features.component';
import { OverviewComponent } from './know-avi/overview/overview.component';
import { SpecificationComponent } from './know-avi/specification/specification.component';
import { SupportComponent } from './support/support.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },

  {
    path: 'product',
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'apps', component: AppsComponent },
      { path: 'specification', component: SpecificationComponent }
    ]
  },
  { path: 'faqs', component: SupportComponent },
  { path: 'about-us', component: AboutusComponent },
  { path: 'contact-us', component: ContactusComponent },
  { path: 'add', component: AddOnSectionComponent },
  { path: 'pricing', component: BuyAviComponent },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

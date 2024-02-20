import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from "@angular/platform-browser";
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css', './custom.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class HomepageComponent implements OnInit {

  entrance = 'entrance';
  shop = 'shop';
  securitycheck = 'securitycheck';
  cafeteria = 'cafeteria'
  waiting_area = 'waiting_area';
  toilets = 'toilets';
  washroom = 'washroom';
  baggage_pick_up = 'baggage_pick_up';
  baggage_check_in = 'baggage_check_in';
  check_in_counter = 'check_in_counter';
  payment_counter = 'payment_counter';

  // Malls/Hotels/Commercial Spaces
  mallentrance = '';
  shopping_carts = '';
  malltoilets = '';
  restaurant = '';
  mallshop = '';
  food_court = '';
  common_area = '';
  mallshop1 = '';
  movie_theatre = '';
  ticket_counter = '';
  escalators = '';
  elevators = '';

  // Healthcare/Educational Facilities
  healthWaitingRoom = '';
  healthConsultation_Room = '';
  healthLabs = '';
  healthtoilets = '';
  healthX_Ray = '';
  healthDiagnostics = '';
  healthGeneral_Ward = '';
  healthCabin = '';
  healthReception = '';
  healthEntrance = '';
  healthElevators = '';
  healthPrivateRooms = '';


  // Offices/Work Spaces
  training_room = '';
  officeWashroom = '';
  conference_room = '';
  officereception = '';
  officeworkspace = '';
  entertainmentArea = '';
  officeCabin = '';
  officeCafeteria = '';



  constructor(private titleService: Title) {
    this.titleService.setTitle("LifeLabz − Smart Sanitizer and Soap Dispenser Solution");
  }

  ngOnInit(): void {
  }

  selectionChange(event) {
    console.log(event)
    const index = event.selectedIndex
    if (index == 0) {
      setTimeout(()=>{  
     

      this.entrance = 'entrance'
      this.shop = 'shop';
      this.securitycheck = 'securitycheck'
      this.cafeteria = 'cafeteria';
      this.waiting_area = 'waiting_area';
      this.toilets = 'toilets';
      this.washroom = 'washroom';
      this.baggage_pick_up = 'baggage_pick_up';
      this.baggage_check_in = 'baggage_check_in';
      this.check_in_counter = 'check_in_counter';
      this.payment_counter = 'payment_counter';
    }, 500);
      // Mall
      this.mallentrance = '';
      this.shopping_carts = '';
      this.malltoilets = '';
      this.restaurant = '';
      this.mallshop = '';
      this.food_court = '';
      this.common_area = '';
      this.mallshop1 = '';
      this.movie_theatre = '';
      this.ticket_counter = '';
      this.escalators = '';
      this.elevators = '';

      // Healthcare/Educational Facilities
      this.healthWaitingRoom = '';
      this.healthConsultation_Room = '';
      this.healthLabs = '';
      this.healthtoilets = '';
      this.healthX_Ray = '';
      this.healthDiagnostics = '';
      this.healthGeneral_Ward = '';
      this.healthCabin = '';
      this.healthReception = '';
      this.healthEntrance = '';
      this.healthElevators = '';
      this.healthPrivateRooms = '';

      // Offices/Work Spaces
      this.training_room = '';
      this.officeWashroom = '';
      this.conference_room = '';
      this.officereception = '';
      this.officeworkspace = '';
      this.entertainmentArea = '';
      this.officeCabin = '';
      this.officeCafeteria = '';
    }

    if (index == 1) {
      setTimeout(()=>{                          
      // Mall
      this.mallentrance = 'mallentrance';
      this.shopping_carts = 'shopping_carts';
      this.malltoilets = 'malltoilets';
      this.restaurant = 'restaurant';
      this.mallshop = 'mallshop';
      this.food_court = 'food_court';
      this.common_area = 'common_area';
      this.mallshop1 = 'mallshop1'
      this.movie_theatre = 'movie_theatre';
      this.ticket_counter = 'ticket_counter';
      this.escalators = 'escalators';
      this.elevators = 'elevators';
   }, 500);
      this.entrance = '';
      this.shop = '';
      this.securitycheck = '';
      this.cafeteria = '';
      this.waiting_area = '';
      this.toilets = '';
      this.washroom = '';
      this.baggage_pick_up = '';
      this.baggage_check_in = '';
      this.check_in_counter = '';
      this.payment_counter = '';

     

      // Healthcare/Educational Facilities
      this.healthWaitingRoom = '';
      this.healthConsultation_Room = '';
      this.healthLabs = '';
      this.healthtoilets = '';
      this.healthX_Ray = '';
      this.healthDiagnostics = '';
      this.healthGeneral_Ward = '';
      this.healthCabin = '';
      this.healthReception = '';
      this.healthEntrance = '';
      this.healthElevators = '';
      this.healthPrivateRooms = '';

      // Offices/Work Spaces
      this.training_room = '';
      this.officeWashroom = '';
      this.conference_room = '';
      this.officereception = '';
      this.officeworkspace = '';
      this.entertainmentArea = '';
      this.officeCabin = '';
      this.officeCafeteria = '';



    }
    if (index == 2) {
      this.entrance = '';
      this.shop = '';
      this.securitycheck = '';
      this.cafeteria = '';
      this.waiting_area = '';
      this.toilets = '';
      this.washroom = '';
      this.baggage_pick_up = '';
      this.baggage_check_in = '';
      this.check_in_counter = '';
      this.payment_counter = '';

      // Mall
      this.mallentrance = '';
      this.shopping_carts = '';
      this.malltoilets = '';
      this.restaurant = '';
      this.mallshop = '';
      this.food_court = '';
      this.common_area = '';
      this.mallshop1 = '';
      this.movie_theatre = '';
      this.ticket_counter = ''
      this.escalators = '';
      this.elevators = '';

      // Healthcare/Educational Facilities
      setTimeout(()=>{  
      this.healthWaitingRoom = 'healthWaitingRoom';
      this.healthConsultation_Room = 'healthConsultation_Room';
      this.healthLabs = 'healthLabs';
      this.healthtoilets = 'healthtoilets';
      this.healthX_Ray = 'healthX_Ray';
      this.healthDiagnostics = 'healthDiagnostics';
      this.healthGeneral_Ward = 'healthGeneral_Ward';
      this.healthCabin = 'healthCabin';
      this.healthReception = 'healthReception';
      this.healthEntrance = 'healthEntrance';
      this.healthElevators = 'healthElevators';
      this.healthPrivateRooms = 'healthPrivateRooms';

   }, 500);

      // Offices/Work Spaces
      this.training_room = '';
      this.officeWashroom = '';
      this.conference_room = '';
      this.officereception = '';
      this.officeworkspace = '';
      this.entertainmentArea = '';
      this.officeCabin = '';
      this.officeCafeteria = '';


    }
    if (index == 3) {
      this.entrance = '';
      this.shop = '';
      this.securitycheck = ''
      this.cafeteria = '';
      this.waiting_area = '';
      this.toilets = '';
      this.washroom = '';
      this.baggage_pick_up = '';
      this.baggage_check_in = '';
      this.check_in_counter = '';
      this.payment_counter = '';

      // Mall
      this.mallentrance = '';
      this.shopping_carts = '';
      this.malltoilets = '';
      this.restaurant = '';
      this.mallshop = '';
      this.food_court = '';
      this.common_area = '';
      this.mallshop1 = '';
      this.movie_theatre = '';
      this.ticket_counter = '';
      this.escalators = '';
      this.elevators = '';

      // Healthcare/Educational Facilities
      this.healthWaitingRoom = '';
      this.healthConsultation_Room = '';
      this.healthLabs = '';
      this.healthtoilets = '';
      this.healthX_Ray = '';
      this.healthDiagnostics = '';
      this.healthGeneral_Ward = '';
      this.healthCabin = '';
      this.healthReception = '';
      this.healthEntrance = '';
      this.healthElevators = '';
      this.healthPrivateRooms = '';

      // Office work
      setTimeout(()=>{  

      this.training_room = 'training_room';
      this.officeWashroom = 'officeWashroom';
      this.conference_room = 'conference_room';
      this.officereception = 'officereception';
      this.officeworkspace = 'officeworkspace';
      this.entertainmentArea = 'entertainmentArea';
      this.officeCabin = 'officeCabin';
      this.officeCafeteria = 'officeCafeteria';
   }, 500);

    }

  }

}

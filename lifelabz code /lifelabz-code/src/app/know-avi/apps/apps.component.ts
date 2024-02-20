import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {
  
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images1 = [944, 1011, 984].map((slider) => `assets\apps\${slider}.png`);


  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: false,
    scrollbar: false,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: "bullets",

  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
}
 
  };
  
  
  public slideArray = [
    'Apps_04',
    'Apps_03',
    'Apps_05',
    'Apps_06',
    'Apps_02',
    'Apps_01',
  ];
  constructor( private service:ServiceService) {
    this.service.setTitle('Apps')
   }

  ngOnInit(): void {
  }

}

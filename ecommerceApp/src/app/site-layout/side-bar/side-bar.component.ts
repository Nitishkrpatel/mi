import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/products/product.service';
import { Category } from './category';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  categoryList:any;
  constructor(private productsService:ProductService) { }

  ngOnInit(): void {
    this.productsService.getCategory().subscribe(data=>{
    this.categoryList = data
    })
  }

}

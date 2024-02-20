import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-veiw-all-product',
  templateUrl: './veiw-all-product.component.html',
  styleUrls: ['./veiw-all-product.component.css']
})
export class VeiwAllProductComponent implements OnInit {
productList:Product|any;
  constructor(private productService:ProductService) { }

  ngOnInit(): void {
    this.productService.veiwProduct().subscribe((data)=>{
      this.productList = data;

    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  productData: any;
  productId = 0;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.productId = data['id'];
    });

    this.productService.veiwIndividualProduct(this.productId).subscribe((viewData)=>{
      this.productData = viewData;
      console.log(viewData)
    })
    
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/site-layout/side-bar/category';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-veiw-product-by-category',
  templateUrl: './veiw-product-by-category.component.html',
  styleUrls: ['./veiw-product-by-category.component.css'],
})
export class VeiwProductByCategoryComponent implements OnInit {
  searchCategory: Category | any;
  productList: Product | any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data=>{
      this.searchCategory = data['id']
      this.productService.searchCategoryProduct(this.searchCategory).subscribe(categoryData=>{
        this.productList = categoryData;
      })
    })
  }
}

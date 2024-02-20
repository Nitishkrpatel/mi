import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { VeiwAllProductComponent } from './veiw-all-product/veiw-all-product.component';
import { VeiwProductByDateComponent } from './veiw-product-by-date/veiw-product-by-date.component';
import { VeiwProductByCategoryComponent } from './veiw-product-by-category/veiw-product-by-category.component';


@NgModule({
  declarations: [
    ProductsComponent,
    AddProductComponent,
    ViewProductComponent,
    UpdateProductComponent,
    DeleteProductComponent,
    VeiwAllProductComponent,
    VeiwProductByDateComponent,
    VeiwProductByCategoryComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule { }

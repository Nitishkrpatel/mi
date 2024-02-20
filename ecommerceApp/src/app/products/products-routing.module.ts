import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductsComponent } from './products.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { VeiwAllProductComponent } from './veiw-all-product/veiw-all-product.component';
import { VeiwProductByCategoryComponent } from './veiw-product-by-category/veiw-product-by-category.component';
import { VeiwProductByDateComponent } from './veiw-product-by-date/veiw-product-by-date.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
  { path: '', component:  VeiwAllProductComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'delete-product', component: ProductsComponent },
  { path: 'view-product/:id', component: ViewProductComponent},
  //{ path: 'list-product', component: VeiwAllProductComponent},
  { path: 'update-product/:id', component: UpdateProductComponent},
  { path: 'category/:id', component: VeiwProductByCategoryComponent},
  { path: 'search-date', component: VeiwProductByDateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../site-layout/side-bar/category';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }

  createProduct(productBody:Product):Observable<Product>{
  const baseUrl = "http://localhost:3000/product";
  return this.httpClient.post<Product>(baseUrl,productBody)
  }

  veiwProduct():Observable<Product>{
    const baseUrl = "http://localhost:3000/product";
    return this.httpClient.get<Product>(baseUrl)
  }

  updateProduct(productId:Product,productBody:Product):Observable<Product>{
    const baseUrl = "http://localhost:3000/product"+productId;
    return this.httpClient.put<Product>(baseUrl,productBody)
  }

  deleteProduct(productId:Product):Observable<Product>{
    const baseUrl = "http://localhost:3000/product"+productId;
    return this.httpClient.delete<Product>(baseUrl)
  }

  searchCategoryProduct(categoryId:Product):Observable<Product>{
    const baseUrl = "http://localhost:3000/product?categoryId="+ categoryId;
    return this.httpClient.get<Product>(baseUrl)
  }
  searchDateProduct(dateParam:Product):Observable<Product>{
    const baseUrl = "http://localhost:3000/product"+ dateParam;
    return this.httpClient.get<Product>(baseUrl)
  }

  getCategory():Observable<Category>{
    const categoryUrl = "http://localhost:3000/categories";
    return this.httpClient.get<Category>(categoryUrl)
  }
  veiwIndividualProduct(id:number):Observable<Product>{
    const baseUrl = "http://localhost:3000/product/" + id;
    return this.httpClient.get<Product>(baseUrl)
  }
}

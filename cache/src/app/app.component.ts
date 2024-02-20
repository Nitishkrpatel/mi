import { Component,OnInit } from '@angular/core';
import { ServicesService } from './services.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'cache';
  data:any;
  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];
  constructor(private service :ServicesService) { }

  ngOnInit() {
    this.fetchPosts();
  }
  
  getDetail(){
    this.service.getData().subscribe(data=>{
      this.data = data;
    })
  }
  fetchPosts(): void {
    this.service.getAllPosts().subscribe(
      (response) => {
        this.POSTS = response;
        this.count = response.length
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchPosts();
  }
  onTableSizeChange(event: any): void {
    console.log(event.target.value)
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchPosts();
  }
  
}

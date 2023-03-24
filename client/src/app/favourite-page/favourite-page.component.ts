import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favourite-page',
  templateUrl: './favourite-page.component.html',
  styleUrls: ['./favourite-page.component.css']
})
export class FavouritePageComponent implements OnInit{

  constructor() {}

  public dataFromLocalStorage : any = [];

  ngOnInit() : void {

    Object.keys(localStorage).map((item:any)=>{
      console.log("ITEM index : "+item);
      console.log("ITEM : "+ localStorage.getItem(item));

      if(item.toString().startsWith("CSCI_571_"))
      {
        const obj = JSON.parse(localStorage.getItem(item) || '{}');
        this?.dataFromLocalStorage.push(obj);
      }
    });
  }
  public deleteFromFavorites(eventName : any, eventDate : any)
  {
    console.log("Event details to be removed from Favorites list : Name : " + eventName + " , Time : " + eventDate);

    localStorage.removeItem(('CSCI_571_' + eventName+eventDate));

    this.dataFromLocalStorage.splice(0, localStorage.length);
    Object.keys(localStorage).map((item:any)=>{
      if(item.toString().startsWith("CSCI_571_"))
      {
        const obj = JSON.parse(localStorage.getItem(item) || '{}');
        this?.dataFromLocalStorage.push(obj);
      }
    });

    alert("Removed from Favorites!");
  }

}

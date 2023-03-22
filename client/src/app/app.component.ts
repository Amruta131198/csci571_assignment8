import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Event Search';
  searchStyle: string ='searchActiveButton';
  favouriteStyle: string = 'favouriteInactiveButton';

  constructor() {}

  ngOnInit() {

    let path = window.location.pathname;

    if(path == '/search'){
      this.searchStyle = 'searchActiveButton';
      this.favouriteStyle = 'favouriteInactiveButton';
    }
    if(path=='/favourite'){
      this.searchStyle = 'searchInactiveButton';
      this.favouriteStyle = 'favouriteActiveButton';
    }
  }

  // isSelected = true

  // public backendBusinessList =[]
  // public backendBusinessInfo ={}
  // public backendBusinessReview ={}


  changeSearchBorder(){
    console.log('Search Tab clicked');
    this.searchStyle = 'searchActiveButton';
    this.favouriteStyle = 'favouriteInactiveButton';
  }
  changeFavouriteBorder(){
    console.log('Favorite Tab clicked');
    this.searchStyle = 'searchInactiveButton';
    this.favouriteStyle = 'favouriteActiveButton';
  }
}

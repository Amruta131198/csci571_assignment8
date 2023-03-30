import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, tap  } from 'rxjs/operators';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventPageComponent implements OnInit {

  constructor(private http : HttpClient) { 
    // library.addIconPacks(far);
  }

  defaultDistance : number = 10;
  // public PARENT_SERVER_URL : String = 'http://localhost:3000';
  public PARENT_SERVER_URL : String = 'https://assignment8-events-website.wl.r.appspot.com';
  public IP_INFO_URL = 'https://ipinfo.io/?token=18175a85885dbc';
  public TWITTER_API_CALL : any = '';
  public FACEBOOK_API_CALL : any = '';

  // Stores auto-complete content
  public choices : string[] = [];
  filteredOptions: Observable<string[]> | undefined;
  public isLoading : boolean = true;

  public eventForm  = new FormGroup({
      keyword: new FormControl(),
      distance: new FormControl(),
      category: new FormControl(),
      location: new FormControl(),
      locationCheckbox : new FormControl()
    });

  public autoDetect = false;
  public eventsList : any;
  public specificEvent : any;
  public showEventsTable = false;
  public showEventsDetail = false;
  public noRecords = false;
  public seatMapURL:string = 'seatMapURL' ; //seat map url
  public spotifyArtistList:any = [];
  public spotifyArtist:any = {};
  public categoryForArtistDisplay : string = '';

  public formInputValue : any = {
    keyword : '',
    distance : '',
    category : 'Default',
    location : '',
    latitude : '',
    longitude : ''
  }

  //Tab 1
  public eventDetailContent = {
    ArtistTeam: '',
    ArtistTeamList: [''],
    Venue: '',
    VenueId: '',
    Time: '',
    Category: '',
    PriceRange: '',
    TicketStatus: '',
    BuyTicketAt: '',
    SeatMap: '',
    Name: '',
  }

  // Tab 2
  public artistContentList : any = [];

  public artistAlbum1 : string = '';
  public artistAlbum2 : string = '';
  public artistAlbum3 : string = '';

  //Tab 3
  public venueDetailContent = {
    Address: '',
    City: '',
    PhoneNumber: '',
    OpenHours: '',
    GeneralRule: '',
    ChildRule: '',
    Latitude : '',
    Longitude : ''
  }

  showOpenHours = false;
  openHoursText : String = this.venueDetailContent.OpenHours;
  showGeneralRule = false;
  generalRulesText : String = this.venueDetailContent.GeneralRule;
  showChildRule = false;
  childRuleText : String = this.venueDetailContent.ChildRule
  
  mapOptions : google.maps.MapOptions = {};
  marker : any = {};

  public favoriteLocalStorage : any = [];
  public favoriteEvents : any = [];

  ngOnInit() {

    this.isLoading = true;
    
    this.filteredOptions = this.eventForm.get('keyword')?.valueChanges.pipe(
      startWith(''),
      map(value => this.serverCallForAutoComplete(value))
    );

    Object.keys(localStorage).forEach((a) => {
      JSON.parse(localStorage.getItem(a)!).map((a: any) => {
        this?.favoriteLocalStorage.push(a);
        this?.favoriteEvents.push(a?.name);
      });
    });

  }

  load(value : string) {
    this.isLoading = true;
    setTimeout(() => { this.isLoading = false; }, 800);
  }

  serverCallForAutoComplete(key : string): string[]
  {
    var SERVER_URL = this.PARENT_SERVER_URL + '/autocomplete?keyword=' + key;
    console.log("Auto-complete backendUrl:", SERVER_URL);

    const filterValue = key;//.toLowerCase();
    fetch(SERVER_URL)
      .then(result => result.json())
      .then(result => {
        var autoCompleteResponseList = [];
        for(var i = 0 ; i < result.attractions.length ; i++)
        {
          autoCompleteResponseList.push(result.attractions[i].name);
        }
        this.choices = autoCompleteResponseList;
      });

      console.log("Choices: "+this.choices);
      return this.choices;
  }

  displayFn(subject : string) {
    return subject;
  }

  public showOpenHoursFunction()
  {
    this.showOpenHours = !this.showOpenHours;
    if(this.showOpenHours)
    {
      this.openHoursText = this.venueDetailContent.OpenHours;
    }
    else{
      this.openHoursText = this.venueDetailContent.OpenHours.slice(0, 100);
    }
    console.log("openHoursText : " + this.openHoursText);
  }

  public showGeneralRuleFunction()
  {
    this.showGeneralRule = !this.showGeneralRule;
    if(this.showGeneralRule)
    {
      this.generalRulesText = this.venueDetailContent.GeneralRule;
    }
    else{
      this.generalRulesText = this.venueDetailContent.GeneralRule.slice(0, 100);
    }
    console.log("generalRulesText : " + this.generalRulesText);
  }

  public showChildRuleFunction()
  {
    this.showChildRule = !this.showChildRule;
    if(this.showChildRule)
    {
      this.childRuleText = this.venueDetailContent.ChildRule;
    }
    else{
      this.childRuleText = this.venueDetailContent.ChildRule.slice(0, 100);
    }
    console.log("childRuleText : " + this.childRuleText);
  }

  public addFavoriteFunction()
  {
    let eventDetailForFav ={
      date : this.eventDetailContent.Time,
      event : this.eventDetailContent.Name,
      category : this.eventDetailContent.Category,
      venue: this.eventDetailContent.Venue
    }

    localStorage.setItem(("CSCI_571_" + eventDetailForFav.event + eventDetailForFav.date), JSON.stringify(eventDetailForFav));
    alert("Event Added to Favorites!");
    console.log("Local Storage after Addition : " + localStorage.length);

  }

  public removeFavoriteFunction(eventName : any, eventDate : any)
  {
    console.log("Event details to be removed from Favorites list : Name : " + eventName + " , Time : " + eventDate);

    let details = localStorage.getItem(('CSCI_571_' + eventName+eventDate));
    console.log("Details to be deleted : " + details);

    localStorage.removeItem(('CSCI_571_' + eventName+eventDate));
    alert("Event Removed from Favorites!");
    console.log("Local Storage after Deletion : " + localStorage.length);

  }

  getLocalStorageItem ( item : any ) 
  { 
    return (localStorage.getItem(("CSCI_571_" + item).toString()) === null);
  }

  public fetchLocation(key : any)
  {
    this.autoDetect = !this.autoDetect;
    console.log("AutoDetect : " + this.autoDetect);

    this.eventForm.get('location')?.disable;

    if(this.autoDetect == true)
    {
      this.eventForm.get('location')?.disable();
      fetch(this.IP_INFO_URL)
      .then((response) => response.json())
      .then((data) => {
        this.formInputValue.location = data?.city;

        var coordinates : String = data?.loc;

        this.formInputValue.latitude = coordinates.substring(0,7);
        this.formInputValue.longitude = coordinates.substring(8,coordinates.length);
        this.formInputValue.location = "";

        console.log("Latitude : " + this.formInputValue.latitude + " Longitude : " + this.formInputValue.longitude);
        });
    }
    else
    {
      this.eventForm.get('location')?.enable();
      this.formInputValue.location = '';
      this.formInputValue.latitude = '';
      this.formInputValue.longitude = '';
    }
  }

  public clearForm()
  {
    this.eventForm.reset({ category : "Default", distance : 10 });
    this.eventForm.get('location')?.enable();
    this.showEventsTable = false;
    this.noRecords = false;
    this.showEventsDetail = false;
  }

  public onSubmit(form : any)
  {
    console.log("Submitted!!!!");
    this.showEventsDetail = false;
    console.log("Keyword : " + this.formInputValue.keyword + " , distance : " 
    + this.defaultDistance + ", category : " + this.formInputValue.category + ' , location : ' + this.formInputValue.location);

    var SERVER_URL = this.PARENT_SERVER_URL + '/events?' ;

    SERVER_URL += "keyword=" + this.formInputValue.keyword;
    SERVER_URL += "&category=" + this.formInputValue.category;
    SERVER_URL += "&distance=" + this.defaultDistance ;

    if(this.autoDetect)
    {
      SERVER_URL += "&location=" + "Current";
      SERVER_URL += "&latitude=" + this.formInputValue.latitude;
      SERVER_URL += "&longitude=" + this.formInputValue.longitude;
    }
    else{
      SERVER_URL += "&location=" + this.formInputValue.location;
    }

    console.log("Final URL : "+SERVER_URL);

    fetch(SERVER_URL)
    .then(response => response.json())
    .then(response => {
      if(response.page.totalElements == 0)
      {
        this.noRecords = true;
        this.showEventsTable = false;
        console.log("No Records Found!");
      }
      else
      {
        this.eventsList = response._embedded.events;
        console.log("events: ", this.eventsList);
        this.showEventsTable = true;
        this.noRecords = false;
      }
    }
    ).catch((err) =>{
      console.error('error occurs',err);// server error
      this.noRecords = true;
      this.showEventsTable = false;
      console.log("No Records Found!");
     });

  }

  public getEventsInfo(id : any, categoryForEvent : string)
  {
    console.log("FETCHING EVENT DETAILS FOR EVENT ID  ::: " + id);

    this.categoryForArtistDisplay = categoryForEvent;

    var SERVER_URL = this.PARENT_SERVER_URL + '/eventDetails?id=' + id;

    console.log("Event details server url : " + SERVER_URL);

    this.eventDetailContent = {
      ArtistTeam: '',
      ArtistTeamList: [''],
      Venue: '',
      VenueId: '',
      Time: '',
      Category: '',
      PriceRange: '',
      TicketStatus: '',
      BuyTicketAt: '',
      SeatMap: '',
      Name: '',
    }

    fetch(SERVER_URL)
    .then(response => response.json())
    .then(response => {
      if(response.page.totalElements == 0)
      {
        console.log("Event details do not exist!");
        //:: TO DO
      }
      else
      {
        this.specificEvent = response._embedded.events[0];
        console.log("SPECIFIC EVENT :::  " + this.specificEvent);

        var Venue = ''
        var VenueId = ''
        if(this.specificEvent.hasOwnProperty('_embedded') && this.specificEvent._embedded.hasOwnProperty('venues') && this.specificEvent._embedded.venues.length != 0)
        {
            Venue = this.specificEvent._embedded.venues[0].name;
            VenueId = this.specificEvent._embedded.venues[0].id;

            console.log("Venue : " + Venue + " , Venue ID : " + VenueId);
        }

        if(Venue != ''){
          this.eventDetailContent.Venue = Venue;
        }

        if(VenueId != ''){
          this.eventDetailContent.VenueId = VenueId;

          var SERVER_URL_FOR_VENUE = this.PARENT_SERVER_URL + '/venueDetail?keyword=' + this.eventDetailContent.Venue;

          console.log("SERVER_URL_FOR_VENUE ::: ", SERVER_URL_FOR_VENUE);

          fetch(SERVER_URL_FOR_VENUE)
          .then(response => response.json())
          .then(response => {
            console.log("VENUE DEATILS FOR THE EVENT : ", response);

            this.venueDetailContent = {
              Address : '',
              City : '',
              PhoneNumber : '',
              OpenHours : '',
              GeneralRule : '',
              ChildRule : '',
              Latitude : '',
              Longitude : ''
            };
            this.artistContentList = [];

            if(response.hasOwnProperty('venues') && response.venues.length > 0){
              for(var k = 0; k < response.venues.length; ++k){

                if(response.venues[k].name.toUpperCase() != this.eventDetailContent.Venue.toUpperCase()){
                  continue
                }

                this.mapOptions ={
                  center: { lat: parseFloat(response.venues[k].location.latitude), lng: parseFloat(response.venues[k].location.longitude) },
                  zoom : 14
                }
                this.marker = {
                    position: { lat: parseFloat(response.venues[k].location.latitude), lng: parseFloat(response.venues[k].location.longitude) },
                }

                this.venueDetailContent.Latitude = response.venues[k].location.latitude;
                this.venueDetailContent.Longitude = response.venues[k].location.longitude;

                if(response.venues[k].hasOwnProperty('address')){
                  if(response.venues[k].address.hasOwnProperty('line1')){
                    this.venueDetailContent.Address = response.venues[k].address.line1
                  }
                }

                if(response.venues[k].hasOwnProperty('city')){
                  if(response.venues[k].city.hasOwnProperty('name')){
                    this.venueDetailContent.City = response.venues[k].city.name;

                  }
                }
  
                if(response.venues[k].hasOwnProperty('state')){
                  if(response.venues[k].city.hasOwnProperty('name')){
                    this.venueDetailContent.City += ', ' + response.venues[k].state.name;
                    this.venueDetailContent.Address += ', ' + this.venueDetailContent.City;
                  }
                }
  
                if(response.venues[k].hasOwnProperty('boxOfficeInfo')){
                  if(response.venues[k].boxOfficeInfo.hasOwnProperty('phoneNumberDetail')){
                    this.venueDetailContent.PhoneNumber = response.venues[k].boxOfficeInfo.phoneNumberDetail
                  }

                  if(response.venues[k].boxOfficeInfo.hasOwnProperty('openHoursDetail')){
                    this.venueDetailContent.OpenHours = response.venues[k].boxOfficeInfo.openHoursDetail;
                    if(this.showOpenHours)
                    {
                      this.openHoursText = this.venueDetailContent.OpenHours;
                    }
                    else{
                      this.openHoursText = this.venueDetailContent.OpenHours.slice(0, 100);
                    }
                  }
                }
  
                if(response.venues[k].hasOwnProperty('generalInfo')){
                  if(response.venues[k].generalInfo.hasOwnProperty('generalRule')){
                    this.venueDetailContent.GeneralRule = response.venues[k].generalInfo.generalRule;
                    if(this.showGeneralRule)
                    {
                      this.generalRulesText = this.venueDetailContent.GeneralRule;
                    }
                    else{
                      this.generalRulesText = this.venueDetailContent.GeneralRule.slice(0, 100);
                    }
                  }

                  if(response.venues[k].generalInfo.hasOwnProperty('childRule')){
                    this.venueDetailContent.ChildRule = response.venues[k].generalInfo.childRule;
                    if(this.showChildRule)
                    {
                      this.childRuleText = this.venueDetailContent.ChildRule;
                    }
                    else{
                      this.childRuleText = this.venueDetailContent.ChildRule.slice(0, 100);
                    }
                  }
                }
                
                console.log("this.venueDetailContent", this.venueDetailContent)
              }
          }
          }).catch((err)=>{
            console.error('error occurs: ',err);// server error
          });

          this.eventDetailContent['Name'] = this.specificEvent.name;

          var ArtistTeam = '';

          this.eventDetailContent.ArtistTeamList = [];

          if(this.specificEvent.hasOwnProperty('_embedded') && this.specificEvent._embedded.hasOwnProperty('attractions'))
          {
            for(var i = 0 ; i < this.specificEvent._embedded.attractions.length ; i++)
            {
              ArtistTeam += this.specificEvent._embedded.attractions[i].name;
              this.eventDetailContent.ArtistTeamList.push(this.specificEvent._embedded.attractions[i].name);

              if(i != (this.specificEvent._embedded.attractions.length - 1))
              {
                ArtistTeam += ' | ';
              }

              if( i > 1 && i%2 == 0)
            {
              ArtistTeam +=  "\n";
            }
            }
          }

          console.log("this.eventDetailContent.ArtistTeamList ::: " + this.eventDetailContent.ArtistTeamList);

          if(ArtistTeam != '')
          {
            this.eventDetailContent['ArtistTeam'] = ArtistTeam;
          }
        
          // Time
          var Time = ''
          if(this.specificEvent.hasOwnProperty('dates') && this.specificEvent.dates.hasOwnProperty('start') && this.specificEvent.dates.start.hasOwnProperty('localDate')){
                Time = this.specificEvent.dates.start.localDate;
              }
          if(Time != ''){
            this.eventDetailContent.Time = Time;
          }

          var Category = '';
          var categoryContent = [];
          if(this.specificEvent.hasOwnProperty('classifications')){
            if(this.specificEvent.classifications[0].hasOwnProperty('subGenre') && this.specificEvent.classifications[0].subGenre.name != 'Undefined'){
              categoryContent.push(this.specificEvent.classifications[0].subGenre.name);
            }
            if(this.specificEvent.classifications[0].hasOwnProperty('genre') && this.specificEvent.classifications[0].genre.name != 'Undefined'){
              categoryContent.push(this.specificEvent.classifications[0].genre.name);
            }
            if(this.specificEvent.classifications[0].hasOwnProperty('segment') && this.specificEvent.classifications[0].segment.name != 'Undefined'){
              categoryContent.push(this.specificEvent.classifications[0].segment.name);
            }
            if(this.specificEvent.classifications[0].hasOwnProperty('subType') && this.specificEvent.classifications[0].subType.name != 'Undefined'){
              categoryContent.push(this.specificEvent.classifications[0].subType.name);
            }
            if(this.specificEvent.classifications[0].hasOwnProperty('type') && this.specificEvent.classifications[0].type.name != 'Undefined'){
              categoryContent.push(this.specificEvent.classifications[0].type.name);
            }
            for(var i = 0; i < categoryContent.length; ++i){
              Category += categoryContent[i]
              if(i != categoryContent.length - 1){
                Category += ' | ';
              }
            }
        }

        if(Category != ''){
          this.eventDetailContent.Category = Category;
        }

        var PriceRange = '';
        if(this.specificEvent.hasOwnProperty('priceRanges')){
          PriceRange += this.specificEvent.priceRanges[0].min + '-' + this.specificEvent.priceRanges[0].max ;//+ ' USD'
        }
        if(PriceRange != ''){
          this.eventDetailContent.PriceRange = PriceRange;
        }

        var TicketStatus = '';
        if(this.specificEvent.hasOwnProperty('dates') && this.specificEvent.dates.hasOwnProperty('status') && this.specificEvent.dates.status.hasOwnProperty('code')){
          TicketStatus += this.specificEvent.dates.status.code;
        }
        if(TicketStatus != ''){
          this.eventDetailContent.TicketStatus = TicketStatus;
        }

        var BuyTicketAt = '';
        if(this.specificEvent.hasOwnProperty('url')){
            BuyTicketAt += this.specificEvent.url;
        }
        if(BuyTicketAt != ''){
          this.eventDetailContent.BuyTicketAt = BuyTicketAt;
        }

        var seatMap = '';
        if(this.specificEvent.hasOwnProperty('seatmap') && this.specificEvent.seatmap.hasOwnProperty('staticUrl')){
            seatMap += this.specificEvent.seatmap.staticUrl;
            this.seatMapURL = seatMap;
        }
        if(seatMap != ''){
          this.eventDetailContent.SeatMap = seatMap;
        }

        console.log("this.eventDetailContent ::: ", this.eventDetailContent);
        console.log("this.eventDetailContent.VenueId ::: ", this.eventDetailContent.VenueId);

        // Twitter
        var textValue = this.eventDetailContent.Name;
        if(textValue.includes('|'))
        {
          textValue = textValue.replace('|', ' ');
          console.log("Text Value : " + textValue);
        }
        this.TWITTER_API_CALL = "https://twitter.com/intent/tweet?text=Check " + textValue + " on Ticketmaster&url=" +  this.specificEvent.url;
        console.log("TWITTER URL : " + this.TWITTER_API_CALL);
        // Facebook
        this.FACEBOOK_API_CALL = "https://www.facebook.com/sharer/sharer.php?u=" + this.specificEvent.url;
        console.log("FACEBOOK URL : " + this.FACEBOOK_API_CALL);

        var SERVER_URL_SPOTIFY = this.PARENT_SERVER_URL;
        this.spotifyArtistList = [];

         if(this.eventDetailContent.ArtistTeamList.length == 0){
              //:: TO DO
          }
          else{
            for(var i = 0; i < this.eventDetailContent.ArtistTeamList.length; ++i){
            var FINAL_SPOTIFY_SERVER_API_CALL = SERVER_URL_SPOTIFY + "/spotify?artist=" + this.eventDetailContent.ArtistTeamList[i];
            fetch(FINAL_SPOTIFY_SERVER_API_CALL)
            .then(response => response.json())
            .then(response => {

              console.log("spotify: ", response);

              this.spotifyArtistList.push(response);
              console.log("this.spotifyArtistList: ", this.spotifyArtistList);

              if(this.spotifyArtistList.length == this.eventDetailContent.ArtistTeamList.length){
                this.getArtistTeamData(Category);
              }
            });
          }
        }
        this.showEventsDetail = true;
        this.showEventsTable = false;
      }
    }
    }).catch((err) =>{
          console.error('error occurs: ',err);// server error
          
        });
  }

  
  public async getArtistTeamData(category : String)
  {
      console.log("::: Inside getArtistTeamData :::");
      this.artistContentList = [];
      var eachArtistContent : any = [];

      for(var i = 0; i < this.spotifyArtistList.length; ++i){
        if(this.spotifyArtistList[i].hasOwnProperty('artists') && this.spotifyArtistList[i].artists.hasOwnProperty('items')){
          for(var j = 0; j < this.spotifyArtistList[i].artists.items.length; ++j){
            var artistName = this.spotifyArtistList[i].artists.items[j].name;
            for(var k = 0; k < this.eventDetailContent.ArtistTeamList.length; ++k){
              // console.log("Iteration : " + j + " , spotifyArtistList item NAme : " + artistName.toUpperCase() + " , this.eventDetailContent.ArtistTeamList[k] : " + this.eventDetailContent.ArtistTeamList[k].toUpperCase());
              if(artistName.toUpperCase() == this.eventDetailContent.ArtistTeamList[k].toUpperCase()){  
                console.log("Artist MAtch found!!! artistName : " + artistName + " ,  this.eventDetailContent.ArtistTeamList[k] : " + this.eventDetailContent.ArtistTeamList[k]);
                
                var artistId = this.spotifyArtistList[i].artists.items[j].id;

                console.log("Artist NAme : " + artistName + " , ARTIST ID : " + artistId);

                // this.artistAlbumFetch(artistId);

                try{

                var FINAL_SPOTIFY_SERVER_API_CALL = this.PARENT_SERVER_URL + "/spotifyAlbum?artistId=" + artistId;
                const response = await fetch(FINAL_SPOTIFY_SERVER_API_CALL);
                const json = await response.json();
                
                this.artistAlbum1 = json.items[0].images[0].url;
                this.artistAlbum2 = json.items[1].images[0].url;
                this.artistAlbum3 = json.items[2].images[0].url;

                eachArtistContent.push({
                                        Name:artistName,
                                        Followers: this.spotifyArtistList[i].artists.items[j].followers.total,
                                        Popularity: this.spotifyArtistList[i].artists.items[j].popularity,
                                        SpotifyLink: this.spotifyArtistList[i].artists.items[j].external_urls.spotify,
                                        ArtistImage: this.spotifyArtistList[i].artists.items[j].images[0].url,
                                        AlbumImage1 : this.artistAlbum1,
                                        AlbumImage2 : this.artistAlbum2,
                                        AlbumImage3 : this.artistAlbum3,
                                        NoDetails:false
                                  });
                this.eventDetailContent.ArtistTeamList.splice(k, 1);
                break;
                }
                catch(err)
                {
                  console.log("Error : " + err);
                  break;
                }
              }
            }
          }
        } 
      }

      console.log("::: this.eventDetailContent.ArtistTeamList ::: " , this.eventDetailContent.ArtistTeamList + "this.eventDetailContent.ArtistTeamList.length : " + this.eventDetailContent.ArtistTeamList.length + " , Category : " + category.indexOf('Music') + category.indexOf('Arts & Theatre'));
      //Console should print length 0 for ArtistTeamList since we deleted all the artists from Music and 'Arts & Theatre' category.
      //If the ArtistTeamList is non sero that means all the artists that do not belong to the above category have been left and their details are not available
      if(this.eventDetailContent.ArtistTeamList.length != 0){ //&& (category.indexOf('Music') != -1 || category.indexOf('Arts & Theatre') != -1)){
        for(var m = 0; m < this.eventDetailContent.ArtistTeamList.length; m++){
          eachArtistContent.push({Name: this.eventDetailContent.ArtistTeamList[m],
                                  NoDetails: true});
        }
      }
      this.artistContentList = eachArtistContent;
      console.log("deal artist data: artistContentList : ", this.artistContentList);
  }

  public getDetailsStatusForArtist(name : string) : boolean
  {
    for(var i = 0 ; i < this.artistContentList.length ; i++)
    {
      if(name === this.artistContentList[i].Name)
      {
        return this.artistContentList[i].NoDetails;
      }
    }
    return true;
  }

}
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  constructor(private http : HttpClient, private fb : FormBuilder) { }

  defaultDistance : number = 10;
  public PARENT_SERVER_URL : String = 'http://localhost:3000';
  public IP_INFO_URL = 'https://ipinfo.io/?token=18175a85885dbc';

  // Stores auto-complete content
  public choices : string[] = []; 
  filteredOptions: Observable<string[]> | undefined;

  public myControl = new FormControl();

  public eventForm  = new FormGroup({
      keyword: new FormControl(),
      distance: new FormControl(),
      category: new FormControl(),
      location: new FormControl(),
      locationCheckbox : new FormControl()
    });

  public autoDetect = false;

  public formInputValue : any = {
    keyword : '',
    distance : '',
    category : 'Default',
    location : '',
    latitude : '',
    longitude : ''
  }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.serverCallForAutoComplete(value))
    );
  }

  serverCallForAutoComplete(key : string): string[]
  {
    var SERVER_URL = this.PARENT_SERVER_URL + '/autocomplete?keyword=' + key;
    console.log("Auto-complete backendUrl:", SERVER_URL);
    if(key != '' || key != null)
    {
      const filterValue = key.toLowerCase();
      fetch(SERVER_URL)
        .then(result => result.json())
        .then(result => {
          var autoCompleteResponseList = [];
          for(var i = 0 ; i < result.attractions.length ; i++)
          {
            autoCompleteResponseList.push(result.attractions[i].name);
          }
          this.choices = autoCompleteResponseList;
        })
  
        console.log("Choices: "+this.choices);
    }
      return this.choices;
  }

  displayFn(subject : string) {
    // console.log(subject)
    return subject;
  }

  public fetchLocation(key : any)
  {
    this.autoDetect = !this.autoDetect;
    console.log("AutoDetect : " + this.autoDetect);

    this.myControl.get('location')?.disable;

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
      console.log("User Input Location : " + this.formInputValue.location);      
    }
  }

  public onSubmit(form : any)
  {
    console.log("Submitted!!!!");
    console.log("Keyword : " + this.formInputValue.keyword + " , distance : " 
    + this.defaultDistance + ", category : " + this.formInputValue.category + ' , location : ' + this.formInputValue.location);
  }

}
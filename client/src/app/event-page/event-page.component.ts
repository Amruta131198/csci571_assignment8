import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.serverCallForAutoComplete(value))
    );

    console.log("Filtered Options : " + this.filteredOptions)
  }

  defaultDistance : number = 10;
  public PARENT_SERVER_URL : String = 'http://localhost:3000';

  // Stores auto-complete content
  public choices : string[] = []; 
  filteredOptions: Observable<string[]> | undefined;

  public myControl = new FormControl();

  public formInputValue : any = {
    keyword : '',
    distance : '',
    category : '',
    location : ''
  }

  serverCallForAutoComplete(key : string): string[]
  {
    var SERVER_URL = this.PARENT_SERVER_URL + '/autocomplete?keyword=' + key;
    console.log("Auto-complete backendUrl:", SERVER_URL);
    const filterValue = key.toLowerCase()
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
      return this.choices;
      // .filter(option =>
      //   option.toLowerCase().includes(filterValue)
      // );
  }

  displayFn(subject : string) {
    console.log(subject)
    return subject;
  }

}
import {Component} from 'angular2/core';


@Component({
  selector: 'gsecure-app',
  providers: [],
  templateUrl: 'app/gsecure.html',
  directives: [],
  pipes: []
})
export class GsecureApp {
  defaultMeaning: number = 42;
  
  meaningOfLife(meaning) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}

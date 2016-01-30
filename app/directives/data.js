import {Directive} from 'angular2/core';

// Simple example directive that fixes autofocus problem with multiple views
@Directive({
  selector: 'Data',
  template:'<h2>Dag</h2>'
})

export class Data {
  constructor() {
      console.log('hierr');
      // TODO: Zie github in readerslist Iphone
      let here = "here";
  }
}
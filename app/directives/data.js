import {Directive} from 'angular2/core';

// Simple example directive that fixes autofocus problem with multiple views
@Directive({
  selector: '[Data]',
  properties: ['text:Data'],
  host:{
      '(mouseover)' : 'show()'
  }
})

export class Data {
    text:string;
  constructor() {
      console.log('hierr');
  }
  show(){
      console.log(this.text);
  }
}
// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { Trip } from '../trip/trip';

@Page({
  templateUrl: 'build/pages/search/search.html'
})

export class Search {
  static get parameters() {
        return [[NavController]];
  }
  constructor(nav) {
      this.nav = nav;
      this.firebaseUrl = Firebase_const.API_URL;
      this.show = true;
      this.name = localStorage.getItem('user');
      this.cities = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('cities').limitToLast(5));
  } 
  searchButton(){
     new Firebase(this.firebaseUrl).child('trips')
            .orderByChild("location")
            .startAt(this.textMessage)
            .endAt(this.textMessage)
            .once('value', snap => {
          snap.forEach(data => {
              this.value = data.val()
              this.value.$$fbKey = data.key();
              this.querySearch.push(this.value);
              if(this.querySearch.length === 0){
                  this.message = "I'm sorry ,we found 0 items.";
              }
          });
    });
  }
  searchQeury($event){
    var e = $event.target.value;
    this.querySearch = [];
    if($event.which === 13) {
        new Firebase(this.firebaseUrl).child('trips')
            .orderByChild("location")
            .startAt(e)
            .endAt(e)
            .once('value', snap => {
          snap.forEach(data => {
              this.value = data.val()
              this.value.$$fbKey = data.key();
              this.querySearch.push(this.value);
              if(this.querySearch.length === 0){
                  this.message = "I'm sorry ,we found 0 items.";
              }
          });
        });
    }
  }
  activeClass(e){
       this.firstClass = "";
       this.secondClass = "";
       this.tirthClass = "";
       switch (e) {
           case 1:
                  this.firstClass = "active";
           break;
           case 2:
                  this.secondClass = "active";
                  this.firstClass += "middle";
           break;
           case 3:
                  this.tirthClass = "active";
                  this.secondClass = "middle";
               break;
       }
  }
  goTrip(e){
    this.nav.push(Trip,{data:e});
  }
}



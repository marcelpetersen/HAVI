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
      this.secondClass = "active";
      this.cities = observableFirebaseArray(
           new Firebase(this.firebaseUrl).child('cities').limitToLast(5));
  } 
  searchQeury($event){
    if($event.which === 13) {
        this.searchButton();
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
 
  searchButton(){ 
      // TODO: do also for users 
      if(this.textMessage){
          this.querySearch = [];    
          var first = this.textMessage.toLowerCase();
          var ab = new Firebase(this.firebaseUrl).child('trips')
                .orderByChild("location")
                .startAt(first)
                .endAt(first);

          var ref = new Firebase(this.firebaseUrl).child('trips');
          this.num = ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(data => {
                         if(data.val().text.indexOf(first) > -1){
                                this.value = data.val();
                                this.value.$$fbKey = data.key();
                                this.querySearch.push(this.value);
                         }
                    });
                    ab.once('value', snapshot =>{
                                if(snapshot.val()){
                                    snapshot.forEach(snapshotData =>{
                                        for(var key in this.querySearch){
                                            if(this.querySearch[key].datetime != snapshotData.val().datetime){
                                                console.log('yes');
                                                this.value = snapshotData.val();
                                                this.value.$$fbKey = snapshotData.key();
                                                this.querySearch.push(this.value);
                                            }
                                            break; 
                                        }
                                    });
                             }
                    });
                }else{
                    this.message = "I'm sorry ,we found 0 items.";
                }
            });
      }
   }
}



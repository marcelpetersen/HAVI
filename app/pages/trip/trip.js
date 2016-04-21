// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Platform, Page, NavParams, NavController, ActionSheet, Alert } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const, StandardPicture } from '../../const';
import { Part } from '../trip.part/trip.part';
import { Add } from '../add/add';
import { Profile } from '../profile/profile';


@Page({
  templateUrl: 'build/pages/trip/trip.html'
})

export class Trip {
    static get parameters() {
        return [[NavController], [NavParams], [Platform]];
    }
    constructor(nav,params,platform){
        this.platform = platform;
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        this.standardPicture = StandardPicture.URL;
        this.user = localStorage.getItem('user');
        this.data = params.get('data');
        this.showPiece = true;
        this.selectedKind = false;

        //Dagen toevoegen
        this.pictures = [];
        for (var index = 0; index < Object.keys(this.data.pictures).length; index++) {
            var key = Object.keys(this.data.pictures);
            key = key[index];
            this.pictures.push(this.data.pictures[key]);
        }
        //Sorteren op datum
        this.pictures.sort(function(a,b){
            return new Date(b.datetime) + new Date(a.datetime);
        });
                
        this.checkStartFavourite();

        
                // Favourite trip
       
        if(this.user === this.data.name){
            this.buttonDisabled = false;
        }else{
            this.buttonDisabled = true;
        }
        
        this.tabBarElement = document.querySelector('tabbar');
    }
    goPerson(){
        this.nav.push(Profile,{data:this.data.name})
    }
    goBackHome(){
        this.nav.pop();
    }
    goPart(e){
        this.nav.push(Part,{data:e});
    }
    cancelIt(){
        this.showPiece = true;
        this.tripName = "";
    }
    tryAdd(trip){
        this.showPiece = false;
        this.tripPart = trip;
       this.all = [];
       var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips');
       ref.once('value', data =>{
           if(data.val()){
               data.forEach(piece => {
                   this.all.push(piece.val());
               });
           }
       });
    }
    addPart(e){
        if(!this.tripPart.src){
            this.tripPart.src = "";
        }
        if(e){
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').orderByChild("datetime").startAt(e.datetime).endAt(e.datetime);
            e = this.tripPart;
            ref.once("value",(val) =>{
               var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(Object.keys(val.val()).toString()).child('pictures');        
                ref.push({
                    name: e.name,
                    datetime: e.datetime,
                    location: e.location,
                    src: e.src,
                    text: e.text
                });
            });            
        }else{
            if(this.tripName){
                var ref = new Firebase(this.firebaseUrl)
                            .child('users').child(this.user).child('created_trips');
                this.addPicture = ref.push({
                    name: this.user,
                    datetime: this.tripPart.datetime,
                    location: this.tripName,
                    src: this.tripPart.src,
                    text: this.tripPart.text,
                    sort: "roadtrip",
                    self_made:true
                });
                this.addPicture.child('pictures').push({
                    name: this.tripPart.name,
                    datetime: this.tripPart.datetime,
                    location: this.tripPart.location,
                    src: this.tripPart.src,
                    text: this.tripPart.text
                });
            }else{
                this.focusLocate =! this.focusLocate;
            }
        }    
        this.tripPart = "";
        this.showPiece = true;
    }
    checkStartFavourite(){
         var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('favourites');
        ref.once("value",snapshot => {
            // Check if favourite
              snapshot.forEach(childSnapshot => {
                    if(childSnapshot.val().key === this.data.$$fbKey){
                        this.heart = true;
                    };
            });
        });
    }
    addThree(){
       this.nav.push(Add,{data:this.data});
    }
    onPageWillEnter(){
        this.tabBarElement.style.display = 'none';
        this.showPiece = true;
        this.selectedKind = false;
        this.checkKind();
    }
    onPageWillLeave(){
        this.updateKind();
        this.tabBarElement.style.display = 'flex';
        if(this.heart === true){
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    var entry = 0;
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val().key === this.data.$$fbKey){
                                // Do nothing, you already liked it
                                entry += 1;
                            }
                    });
                    if(entry === 0){
                        ref.push({key:this.data.$$fbKey,datetime:Firebase.ServerValue.TIMESTAMP});
                        var newRef =  new Firebase(this.firebaseUrl).child('users').child(this.data.name).child('got_favourites');
                        newRef.push({key:this.data.$$fbKey, datetime:Firebase.ServerValue.TIMESTAMP});
                    }
                }else{
                    ref.push({key:this.data.$$fbKey,datetime:Firebase.ServerValue.TIMESTAMP});
                    var newRef =  new Firebase(this.firebaseUrl).child('users').child(this.data.name).child('got_favourites');
                    newRef.push({key:this.data.$$fbKey, datetime:Firebase.ServerValue.TIMESTAMP});
                }
            });
         }else{
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val().key === this.data.$$fbKey){
                                ref.child(childSnapshot.key()).remove();
                                var newRef =  new Firebase(this.firebaseUrl).child('users').child(this.data.name).child('got_favourites');
                                 newRef.once('value',data =>{
                                     data.forEach(queryData => {
                                        if(queryData.val().key === this.data.$$fbKey){
                                         var removeRef =  new Firebase(this.firebaseUrl).child('users').child(this.data.name).child('got_favourites').child(queryData.key());
                                         removeRef.remove(); 
                                        }
                                     })
                                 });
                                
                            }
                    });
                }
            });
         }
    }
    checkKind(){
        //this.selectedKind = true;
        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey).child('sort');
        ref.on('value',snap =>{
            if(snap.exists() === true){
                this.tripkind = snap.val();
            }else{
                var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey).child('sort');
                ref.on('value',snap =>{
                    this.tripkind = snap.val();
                });
            }
        }); 
    }
    updateKind(){
        if(this.data.sort != this.tripkind){
                var ref = new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey);
                ref.once('value',snap =>{
                    if(snap.exists() === true){
                        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey);
                        ref.update({sort:this.tripkind}); 
                    }else{
                        var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey);
                        ref.once('value',snap =>{
                        if(snap.exists() === true){
                            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey);
                            ref.update({sort:this.tripkind}); 
                        }
                });
                    }
                });
        }
    }
    editTrip(){
        let actionSheet = ActionSheet.create({
            title: 'Modify your trip',
            buttons: [{
                text: 'Edit',
                icon: !this.platform.is('ios') ? 'build' : null,
                handler: () => {
                console.log('Archive clicked');
                }
            },{
                text: 'Delete',
                role: 'destructive',
                icon: !this.platform.is('ios') ? 'trash' : null,
                handler: () => {
                        let confirm = Alert.create({
                        title: 'Confirm delete...',
                        message: 'Are you sure you want to delete this trip?',
                        buttons: [
                            {
                            text: 'Cancel',
                            role: 'destructive',
                            handler: () => {
                                //console.log('Disagree clicked');
                            }
                            },
                            {
                            text: 'Delete',
                            handler: () => {
                                console.log('Delete clicked');
                            }
                            }
                        ]
                        });
                        this.nav.present(confirm);
                }
            },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                console.log('Cancel clicked');
                }
            }]
        });
        this.nav.present(actionSheet);
    }
    edit(){
        console.log('edit'); 
    }
}
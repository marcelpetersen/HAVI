// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Platform, Page, NavParams, NavController, ActionSheet, Alert } from 'ionic-angular';
import { Observable }              from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';

// Pages & constants
import { Firebase_const, StandardPicture } from '../../const';
import { Part }     from '../trip.part/trip.part';
import { Add }      from '../add/add';
import { Profile }  from '../profile/profile';


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
        this.showEditPart = false;

        // Add days
        this.pictures = [];
        for (var index = 0; index < Object.keys(this.data.pictures).length; index++) {
            var key = Object.keys(this.data.pictures);
            key = key[index];
            this.pictures.push(this.data.pictures[key]);
        }
        // Sort on date
        this.pictures.sort(function(a,b){
            return new Date(b.datetime) + new Date(a.datetime);
        });
                
        this.checkStartFavourite();
       
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
        // Add part to planned trip
        if(!this.tripPart.src){
            this.tripPart.src = "";
        }
        if(e){
            // Add to already made (still planned) trip
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').orderByChild("datetime").startAt(e.datetime).endAt(e.datetime);
            e = this.tripPart;
            ref.once("value",(val) =>{
               var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(Object.keys(val.val()).toString()).child('pictures');    
               e.datetime = Firebase.ServerValue.TIMESTAMP;
                ref.push({
                    name: e.name,
                    datetime: e.datetime,
                    location: e.location,
                    src: e.src,
                    text: e.text
                });
            });
            this.tripPart = "";
            this.showPiece = true;            
        }else{
            // Push to new trip
            if(this.tripName){
                var ref = new Firebase(this.firebaseUrl)
                            .child('users').child(this.user).child('created_trips');
                this.tripPart.datetime = Firebase.ServerValue.TIMESTAMP;  
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
                this.tripPart = "";
                this.showPiece = true;
            }else{
                this.focusLocate =! this.focusLocate;
            }
        }    
    }
    checkStartFavourite(){
        // Check for favourites
        var ref = new Firebase(this.firebaseUrl)
                        .child('users')
                        .child(this.user)
                        .child('favourites');
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
        // Which kind of trip is this update here
        this.updateKind();
        this.tabBarElement.style.display = 'flex';
        // If trip is favourite check here and push if needed
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
        // Check kind of trip ex. Business, beach, city, ...
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
        // Update kind of trip
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
        // Edit a trip or maybe delete it
        let actionSheet = ActionSheet.create({
            title: 'Modify trip',
            buttons: [{
                text: 'Edit',
                icon: !this.platform.is('ios') ? 'build' : null,
                handler: () => {
                  this.showEditPart =! this.showEditPart;
                  this.editTrips = [];
                  var len = Object.keys(this.data.pictures).length;
                  for (var i = 0; i < len; i++) {
                      var keys =  Object.keys(this.data.pictures);
                      var key = keys[i];
                      this.editTrips.push({
                          location: this.data.pictures[key].location,
                          key:key
                      })
                  }
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
                                //this.showEditPart =! this.showEditPart;
                                //this.nav.push()
                            }
                            },
                            {
                            text: 'Delete',
                            handler: () => {
                                    // Delete the whole trip
                                    var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey);
                                    ref.once('value', snap =>{
                                        if(snap.exists() === true){
                                            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey);
                                            ref.remove();
                                        }else{
                                            var ref = new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey);
                                            ref.remove();
                                        }
                                    })
                                    ref.remove();
                                    this.nav.pop();
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
    editSelected(){
        // Choose which part do you want to edit
        this.nav.push(Part,{
            edit:true,
            data:this.data,
            location:this.whichEdit
        });
        this.whichEdit = "";
        this.showEditPart =! this.showEditPart;
        this.editTrips = [];
    }
    onCancel(){
        this.whichEdit = "";
        this.showEditPart =! this.showEditPart;
        this.editTrips = [];
    }
    changeLocation(){
        // Change title/location of the whole trip
        let prompt = Alert.create({
            title: 'Title - location',
            message: "Are you sure you want change the location?",
            inputs: [
                {
                name: 'location',
                placeholder: 'Location'
                },
            ],
            buttons: [
                {
                text: 'Cancel',
                handler: data => {
                }
                },
                {
                text: 'Save',
                handler: data => {
                    // Push title/location to URL
                    this.data.location = data.location;
                    var ref = new Firebase(this.firebaseUrl)
                                    .child('trips').child(this.data.$$fbKey);
                    ref.once('value', snap =>{
                        if(snap.exists() === true){
                            var ref = new Firebase(this.firebaseUrl).child('trips').child(this.data.$$fbKey);
                            ref.update({location:data.location});
                        }else{
                            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(this.data.$$fbKey);
                            ref.update({location:data.location});
                        }
                    });
                }
                }
            ]
        });
        this.nav.present(prompt);
    }
    changeDate(){
        //TODO: Datum wijzigen, wat te doen met timestamp?
    }
}
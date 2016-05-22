// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16
// TODO: trips zijn niet chronologisch geordend, eerste datum komt laatste. 
// Pipe werkt wel maar de datum is een servervalue, en neemt telkens de huidige datum ipv de datum van dat het gepost is. 

import { Page, NavController, NavParams, Alert, Loading } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Http,Headers,RequestOptions,HTTP_PROVIDERS } from '@angular/http';

//Pages & constant
import { Firebase_const, ProfilePicture } from '../../const';
import { Settings } from '../settings/settings';
import { Trip }     from '../trip/trip';
import { Part }     from '../trip.part/trip.part';

// Pipes
import { obfiPipe }        from '../../pipes/obfiPipe';
import { namePipe }        from '../../pipes/namePipe';
import { orderByDatePipe } from '../../pipes/orderByDatePipe';

// Native
import { SocialSharing } from 'ionic-native';


@Page({
  templateUrl: 'build/pages/profile/profile.html',
  pipes: [[obfiPipe],[namePipe],[orderByDatePipe]]
})

export class Profile {
    static get parameters() {
        return [[NavController], [NavParams],[Http]];
    }
    constructor(nav,params,http){
        this.http = http;
        this.nav = nav;
        this.firebaseUrl = Firebase_const.API_URL;
        
        this.name = params.get('data');
        this.user = localStorage.getItem('user');

        this.favoTrips = "active";
        // Check if user or is somebody else...
        if(this.name && this.name != this.user){
            // This isn't the user
            this.notMyProfile = true; 
            this.tripFavourite();
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.name).child('pictureUrl');
            ref.once('value', snap =>{
                if(snap.exists() === true){
                    this.profileImg = snap.val();
                     this.profilePic = "";
                }else{
                    this.profileImg = ProfilePicture.URL;
                    this.profilePic = "";
                }
            });            
        }else{
            // This is the user
            this.name = localStorage.getItem('user');
            this.notMyProfile = false;
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.name).child('pictureUrl');
             ref.once('value',snap =>{
                if(snap.exists() === true){
                    this.profileImg = snap.val();
                     this.profilePic = "";
                }else{
                    this.profileImg = ProfilePicture.URL;
                    this.profilePic = "show";
                }
             });
        }
        this.numberOfTrips();
    }
    goSettings(){
        this.nav.push(Settings);
    }
    goTrip(e){
        this.nav.push(Trip,{data:e});
    }
    heartUser(){
        this.heart =! this.heart;
    }
    changeActive(e){
        if(e === "trips"){
            this.favoUser = "";
            this.favoTrips = "active";
            this.chooseCreated();
        }else if(e === "users"){
            this.favoUser = "active";
            this.favoTrips = "";
            this.chooseCreated();
        }
    }
    onPageDidEnter(){
        this.chooseCreated();
    }
    chooseCreated(){
       if(!this.favoUser){
           // My trips I made
           this.message = "";
           this.all = [];
            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name);
            ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(s =>{
                        this.value = s.val()
                        this.value.$$fbKey = s.key();
                        this.all.push(this.value);
                    });
                }else{
                    this.message = "Upload all the trips you made so far.";
                }
            });
       }else{
           // My trips I planned & I'm the user
        if(this.notMyProfile != true){
           this.message = "";
           this.all = [];
           this.value = [];
           var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips');
            ref.once('value', snap => {
                if(snap.val()){
                    snap.forEach(s =>{
                        this.value = s.val()
                        this.value.$$fbKey = s.key();
                        this.all.push(this.value);
                    });
                }else{
                    this.message = "Plan a trip with experiences from others.";
                }
            });
        }else{
            // My trips I planned but I'm not the user
            this.all = [];
            this.message = "This is private";
        }
       }
    }
    onPageDidLeave(){
        // Check if the user used the heart
        if(this.heart === true){
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites_users');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    var entry = 0;
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val() === this.name){
                                // Do nothing, you already liked it
                                entry += 1;
                            }
                    });
                    if(entry === 0){
                        ref.push(this.name);
                    }
                }else{
                   ref.push(this.name);
                }
            });
         }else{
            var ref = new Firebase(this.firebaseUrl)
                    .child('users').child(this.user).child('favourites_users');
            ref.once("value", snapshot =>{
                if(snapshot.val()){
                    // Check if favourite
                    snapshot.forEach(childSnapshot => {
                            if(childSnapshot.val() === this.name){
                                ref.child(childSnapshot.key()).remove();
                            }
                    });
                }
            });
         }
    }
    
    tripFavourite(){
            // Favourite trip
            var ref = new Firebase(this.firebaseUrl)
                            .child('users').child(this.user);
            ref.child('favourites_users').once("value",snapshot => {
                // Check if favourite
                snapshot.forEach(childSnapshot => {
                        if(childSnapshot.val() === this.name){
                            this.heart = true;
                        };
                });
            });
    }
    numberOfTrips(){
        this.numberOfTrips = 0;
       var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name);
       ref.on('value',data =>{
           this.numberOfTrips = data.numChildren();
       });
       var newRef = new Firebase(this.firebaseUrl).child('users').child(this.user);
       newRef.child('favourites').once("value",snapshot => {
            this.following = snapshot.numChildren(); 
            if(!this.following){
                this.following = 0;
            }
        });
        newRef.child('got_favourites').once("value",snapshot => {
            this.followers = snapshot.numChildren(); 
            if(!this.followers){
                this.followers = 0;
            }
        });
    }
    goBack(){
        this.nav.pop();
    }
    share(){
            FB.ui({
                method: 'share',
                href: 'https://havi.firebaseapp.com/',
            }, (response) =>{});
            //SocialSharing.share("message","subject","http://localhost:8100/","http://localhost:8100/");
    }
    delete(e){
        // Confirm delete & then do delete
        var confirm = Alert.create({
            title: 'Confirm delete...',
            message: 'Are you sure you want to delete this trip?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'destructive',
                    handler: () => {
                             // Just cancel this
                    }
                },
                    {
                    text: 'Delete',
                    handler: () => {
                        var ref = new Firebase(this.firebaseUrl).child('users').child(this.user).child('created_trips').child(e.$$fbKey);
                        ref.remove();
                        this.nav.pop();
                    }
                }
            ]
            });
            this.nav.present(confirm);
    }
    uploadProfile(evt){
        // Give the loading dots
        this.loading = Loading.create({
            spinner: "dots",
            content: "Uploading, please wait.."
        });
        this.nav.present(this.loading);
        // Read to upload the file
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = ((theFile) => {
                return (e) => {
                    // Upload picture to nathalieleye.com, this is where user-pitures go...;
                    var data = JSON.stringify({"image": e.target.result});
                    var headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('/upload-users.php', data ,{ headers: headers }).subscribe(
                        data => {
                            if(data){
                                this.newPicture =  "http://nathalieleye.com/users/" + data._body + ".jpeg";
                                var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
                                ref.update({pictureUrl:this.newPicture});
                                this.profilePic = "";
                                this.profileImg = this.newPicture;
                                this.loading.dismiss();
                            }
                        },
                        err => console.log(err)
                        );
                    };
        })(f);
        reader.readAsDataURL(f);
    }
}

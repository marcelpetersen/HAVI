// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 22/05/16

import { Page,Platform, NavParams, NavController, Alert, Loading }   from 'ionic-angular';
import { Http, Headers, RequestOptions, HTTP_PROVIDERS }       from '@angular/http';
import { Firebase_const, StandardPicture }                  from '../../const';

// Pages & Pipes
import { Home }     from '../home/home';
import { Maps }     from '../maps/maps';
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';

@Page({
  templateUrl: 'build/pages/trip.part/trip.part.html',
  pipes: [[obfiPipe],[namePipe]]
})

export class Part {
    
    static get parameters() {
        return [[NavController], [NavParams],[Http],[Platform]];
    }
    
    constructor(nav,params,http,platform){
        this.platform = platform;
        this.http = http;
        this.firebaseUrl = Firebase_const.API_URL;
        this.edit = params.get('edit');
        if(this.edit){
            this.key = "";
            this.location = params.get('location');
            this.allData = params.get('data');
            this.allPictures = params.get('data').pictures;
            for(this.key in this.allPictures) {
                if(this.allPictures[this.key].location === this.location){
                    this.data = this.allPictures[this.key] ;
                }
            }
        }else{
            this.data = params.get('data');
        }
        this.newData = {
            location: this.data.location,
            text: this.data.text
        }
        this.nav = nav;
        this.standardPicture = StandardPicture.URL;
        this.tabBarElement = document.querySelector('tabbar');
    }
    
    goBackHome(){
        this.nav.pop();
    }
    
    goMaps(){
        if(this.data.coords && this.data.coords.lat && this.data.coords.lon){
            this.nav.push(Maps,{data:this.data.coords,location:this.data.location});
        }else if(this.coords.lat && this.coords.lng){
            this.nav.push(Maps,{data:this.coords,location:this.data.location});
        }else{
            this.error = "Can't find any location with this name";
            setTimeout(() => {
                this.error = "";
            }, 2500);
        }
    }
    onPageWillEnter(){
        this.coords = {
            lat: "",
            lng: ""
        }
        if(!this.data.coords || !this.data.coords.lat || !this.data.coords.lon){
             this.searchLocation();
        }
    }
    
    searchLocation(){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': this.data.location}, (results, status)=> {
            if (status === google.maps.GeocoderStatus.OK) {
                if(results[6]){
                    this.coords = results[6].geometry.location;
                }else if(results[5]){
                     this.coords = results[5].geometry.location;
                }else{
                     this.coords = results[0].geometry.location;
                }
            }
        });
    }
    
    cancelPart(){
        this.edit = "";
    }
    
    editPart(){
        this.data.location = this.newData.location;
        this.data.text = this.newData.text;
        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures');
        ref.once("value", (snap) =>{
            snap.forEach(snapData =>{
               if(snapData.val().location === this.location){
                    var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures').child(snapData.key());
                    ref.update({
                        location: this.data.location,
                        text: this.data.text,
                        update_time: Firebase.ServerValue.TIMESTAMP
                    });
               } 
            });
        });
        this.newData.location = "";
        this.newData.text = "";
        this.edit = "";
    }
    
    uploadPicture(evt){
        // Uploading dots
        this.loading = Loading.create({
            spinner: "dots",
            content: "Uploading, please wait.."
        });
        this.nav.present(this.loading);
        
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = ((theFile) => {
                return (e) => {
                    this.data.src = e.target.result;
                    // Upload picture to server;
                     var data = JSON.stringify({"image":this.data.src, "user":localStorage.getItem('user')});
                    var headers = new Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('/upload.php', data ,{ headers: headers })
                    .subscribe(
                        data => {
                            this.data.src =  "http://stuart-nieuwpoort.be/uploads/" + data._body + ".jpeg"
                            var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures');
                            ref.once("value", (snap) =>{
                                snap.forEach(snapData =>{
                                if(snapData.val().location === this.location){
                                        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures').child(snapData.key());
                                        ref.update({
                                            src:this.data.src
                                        });
                                } 
                                });
                                 this.loading.dismiss();
                            });
                        },
                        err => console.log(err)
                        );
                    };
        })(f);
        reader.readAsDataURL(f);
    }
    
    deletePart(){
        let confirm = Alert.create({
                        title: 'Confirm delete...',
                        message: 'Are you sure you want to delete this part of the trip?',
                        buttons: [
                            {
                            text: 'Cancel',
                            role: 'destructive',
                            handler: () => {
                                // Silence
                                }
                            },
                            {
                            text: 'Delete',
                            handler: () => {
                                    if(Object.keys(this.allData.pictures).length === 1){
                                        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey);
                                        ref.remove();
                                        this.nav.push(Home);
                                    }else{
                                        var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures');
                                        ref.once("value", (snap) =>{
                                            snap.forEach(snapData =>{
                                            if(snapData.val().location === this.location){
                                                var ref = new Firebase(this.firebaseUrl).child('trips').child(this.allData.$$fbKey).child('pictures').child(snapData.key());
                                                ref.remove();
                                            } 
                                            });
                                            
                                        })
                                      this.nav.pop();
                                    }                     
                                }
                            }
                        ]
                        });
            this.nav.present(confirm);
    }
    
    pictureWidth(){
        
    }
    
    bigPicture(){
        this.big =! this.big;
    }
}


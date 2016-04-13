// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page, NavController, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const, StandardPicture } from '../../const';
import { EXIF } from 'exif-js';
import { Http,Headers,RequestOptions,HTTP_PROVIDERS } from 'angular2/http';
import { Trip } from '../trip/trip';
import { Camera, Geolocation } from 'ionic-native';


@Page({
  templateUrl: 'build/pages/add/add.html',
  providers: [HTTP_PROVIDERS]
})

export class Add {  
  static get parameters() {
    return [[NavController],[Http],[NavParams], [Platform]];
  }
  
  constructor(nav,http,params,platform) {
      this.nav = nav;
      this.http = http;
      this.platform = platform;
      this.albumTitle = "Give the new album a name";
      this.visiblePicture = true;
      this.visibleNote = true;
      this.visibleMap = true;
      this.standardPicture = StandardPicture.URL;
      this.firebaseUrl = Firebase_const.API_URL;
      this.name = localStorage.getItem('user');
      this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
      this.canUpdate = false;
      this.newalbum = true;
      this.data = params.get('data');
      if(this.data){
          this.pickTrip(this.data);
      }
      this.tabBarElement = document.querySelector('tabbar');
  }
  uploadPicture(evt){
       this.tabBarElement.style.display = 'none';
        this.visiblePicture = false;
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = ((theFile) => {
                return (e) => {
                    this.previewImage = e.target.result;
                    // FIND EXIF
                    this.Exif();
            };
        })(f);
        reader.readAsDataURL(f);
    }
    Exif(){
            let img = document.getElementById('preview-image');
                EXIF.getData(img, ()=> {
                console.log(EXIF.pretty(img));
                var lon = EXIF.getTag(img,"GPSLongitude");
                var lat = EXIF.getTag(img,"GPSLatitude");
                //console.log(lat);
                //console.log(lon);
                if(!lon || !lat) {
                        console.log('geen locatie');
                        alert('Vul locatie in');
                }
                //utility funct based on https://en.wikipedia.org/wiki/Geographic_coordinate_conversion
                var convertDegToDec = (arr) => {
                    return (arr[0].numerator + arr[1].numerator/60 + (arr[2].numerator/arr[2].denominator)/3600).toFixed(4);
                };
                
                lon = convertDegToDec(lon);
                lat = convertDegToDec(lat);
                //handle W/S
                if(EXIF.getTag(this,"GPSLongitudeRef") === "W") lon = -1 * lon;
                if(EXIF.getTag(this,"GPSLatitudeRef") === "S") lat = -1 * lat;
                
            var geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(lat, lon);
                geocoder.geocode({'location': latlng}, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                            // hier komt adress
                            this.locate = results[0].formatted_address;
                    } else {
                        window.alert('No results found');
                    }
                    } else {
                    window.alert('Geocoder failed due to: ' + status);
                    }
                });
            });
    }
    getPicture(){
    if(this.locate){
        console.log('hier');
        this.visiblePicture = true;
        this.tabBarElement.style.display = 'flex';
    var data = JSON.stringify({"image":this.previewImage});
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('/upload.php', data ,{ headers: headers })
    .subscribe(
        data => {
            this.firebaseUrl = Firebase_const.API_URL;
            this.name = localStorage.getItem('user');
            if(!this.chosen){
                var ref = new Firebase(this.firebaseUrl).child('trips');
                // Push item to firebase URL (ref)
                var newId = ref.push({
                        name: this.name.toLowerCase(),
                        location: this.locate.toLowerCase(),
                        src: "http://stuart-nieuwpoort.be/uploads/" + data._body + ".jpeg", //this.previewImage
                        datetime: Firebase.ServerValue.TIMESTAMP,
                        sort: "roadtrip",
                        text: this.smallText.toLowerCase()
                }); 
                this.chosen = newId;
                if(this.chosen){
                var ref = new Firebase(this.firebaseUrl).child('trips')
                    .child(this.chosen.path.o[1])
                    .child('pictures');
                                            
                    // Push item to firebase URL (ref)
                    ref.push({
                            name: this.name.toLowerCase(),
                            location: this.locate.toLowerCase(),
                            src: "http://stuart-nieuwpoort.be/uploads/"  + data._body + ".jpeg", //this.previewImage
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            text: this.smallText.toLowerCase()
                    }); 
                }
            }else{
                var ref = new Firebase(this.firebaseUrl).child('trips')
                    .child(this.chosen)
                    .child('pictures');
                                        
                // Push item to firebase URL (ref)
                ref.push({
                        name: this.name.toLowerCase(),
                        location: this.locate.toLowerCase(),
                        src: "http://stuart-nieuwpoort.be/uploads/"  + data._body + ".jpeg", 
                        datetime: Firebase.ServerValue.TIMESTAMP
                }); 
            }
            this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
        },
        err => console.log(err)
        );
    }else{
        this.focusLocate =! this.focusLocate;
    }
    }
    cancel(){
        if(this.visiblePicture === false){
            this.previewImage = "";
            this.smallText = "";
            this.visiblePicture = true;
            
        }else if(this.visibleNote === false){
            this.longText = "";
            this.visibleNote = true;
        }else{
            this.mapLocation = "";
            this.smallText = "";
            this.visibleMap = true;
        }
        document.getElementById('preview-image').innerHTML = "";
    }
    pickTrip(e){
        this.noPictures = false;
        this.albumTitle = e.location;
        this.oldTitle = this.albumTitle;
        this.chosen = e.$$fbKey;
        this.newImages = observableFirebaseArray(
            new Firebase(this.firebaseUrl)
                .child('trips')
                .child(this.chosen)
                .child('pictures'));
                    
        this.newImages = this.newImages;
        this.newalbum = false;
    }
    changeTitle(){
        console.log(this.chosen)
        if(this.albumTitle == "Give the new album a name"){
                this.albumTitle = "";
        }else if(this.chosen){
            this.canUpdate = true;
        }
    }
    loadMore(){
        this.moreLoaded =! this.moreLoaded;
        this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name));
    }
    loadLess(){
        this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
    }
    updateTitle(){
        if(this.albumTitle != this.oldTitle){
            console.log(this.chosen);
            var ref = new Firebase(this.firebaseUrl)
                    .child('trips')
                    .child(this.chosen);
            ref.update({
                location: this.albumTitle
            }); 
            this.canUpdate = false;
        }
    }
    newAlbum(){
        this.newalbum = true;
        this.noPictures = true;
        this.chosen = "";
        this.albumTitle = "Give the new album a name";
        this.locate = "";
    }
    addNote(){
        this.visibleNote = false;
    }
    getNote(longText, noteLocation){
        if(noteLocation != ""){
            this.firebaseUrl = Firebase_const.API_URL;
            this.name = localStorage.getItem('user');
            if(!this.chosen){
                console.log('hier');
                    var ref = new Firebase(this.firebaseUrl).child('trips');
                    // Push item to firebase URL (ref)
                        var newId = ref.push({
                            name: this.name.toLowerCase(),
                            location: noteLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            sort: "roadtrip",
                            text: this.longText.toLowerCase()
                    }); 
                    this.chosen = newId;
                    if(this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen.path.o[1])
                        .child('pictures');
                        // Push item to firebase URL (ref)
                        ref.push({
                                name: this.name.toLowerCase(),
                                location: noteLocation.toLowerCase(),
                                datetime: Firebase.ServerValue.TIMESTAMP,
                                sort: "roadtrip",
                                text: this.longText.toLowerCase()
                        }); 
                    }
                }else{
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen)
                        .child('pictures');
                                            
                    // Push item to firebase URL (ref)"
                    ref.push({
                            name: this.name.toLowerCase(),
                            location: noteLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            text: this.longText.toLowerCase()
                    }); 
                }
                this.visibleNote = true;
                this.noteLocation = "";
                this.longText = "";
                this.location = "";
        }else{
                this.focusLocate =! this.focusLocate;
        }
    }  
    addLocation(){
    this.visibleMap = false;
        let mapEle = document.getElementById('map');

        let map = new google.maps.Map(mapEle, {
        center: {lat: 55.676098, lng: 12.568337},
        zoom: 8
        });
        
        Geolocation.getCurrentPosition().then((position) => {
                let map = new google.maps.Map(mapEle, {
                    center: {lat: position.coords.latitude, lng: position.coords.longitude},
                    zoom: 14
                });
                let marker = new google.maps.Marker({
                position: {lat: position.coords.latitude, lng: position.coords.longitude},
                map: map,
                title: "Your location"
                });
            var geocoder = new google.maps.Geocoder;
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        geocoder.geocode({'location': latlng}, (results, status)=> {
                            console.log(results);
                            if (status === google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                this.mapLocation = results[0].formatted_address;
                            } else {
                                window.alert('No results found');
                            }
                            } else {
                            window.alert('Geocoder failed due to: ' + status);
                            }
                        });
        },
        (error) => {
            console.log(error);
        })
    }
    getLocation(mapLocation){
        if(mapLocation != ""){
            this.firebaseUrl = Firebase_const.API_URL;
            this.name = localStorage.getItem('user');
            if(!this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips');
                    // Push item to firebase URL (ref)
                        var newId = ref.push({
                            name: this.name.toLowerCase(),
                            location: mapLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            sort: "roadtrip",
                            text: this.smallText.toLowerCase()
                    }); 
                    this.chosen = newId;
                    if(this.chosen){
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen.path.o[1])
                        .child('pictures');
                        // Push item to firebase URL (ref)
                        ref.push({
                                name: this.name.toLowerCase(),
                                location: mapLocation.toLowerCase(),
                                datetime: Firebase.ServerValue.TIMESTAMP,
                                sort: "roadtrip",
                                text: this.smallText.toLowerCase()
                        }); 
                    }
                }else{
                    var ref = new Firebase(this.firebaseUrl).child('trips')
                        .child(this.chosen)
                        .child('pictures');
                                            
                    // Push item to firebase URL (ref)"
                    ref.push({
                            name: this.name.toLowerCase(),
                            location: mapLocation.toLowerCase(),
                            datetime: Firebase.ServerValue.TIMESTAMP,
                            text: this.smallText.toLowerCase()
                    }); 
                }
                this.visibleMap = true;
                this.mapLocation = "";
                this.smallText = "";
                this.location = "";
        }else{
                this.focusLocate =! this.focusLocate;
        }
    }
    takePicture(){
        this.visiblePicture = false;
        this.platform.ready().then(() => {
        let options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true,
            correctOrientation:true
        };
        // https://github.com/apache/cordova-plugin-camera#module_camera.getPicture
        Camera.getPicture(
            (data) => {
           
            this.previewImage = data;
            var image = document.getElementById('preview-image');
            image.src = "data:image/jpeg;base64," + data;
            
             this.smallText = data;
            //let imagedata = "data:image/jpeg;base64," + data;
                
                // here do something with picture
                this.Exif();
            }, (error) => {
            alert(error);
            }, options
        );
        });
    }
    }



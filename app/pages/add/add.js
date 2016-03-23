// Page:        Small messaging with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 20/02/16

import { Page } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';
import { Firebase_const } from '../../const';
import { EXIF } from 'exif-js';
import { Http,Headers,HTTP_PROVIDERS } from 'angular2/http';


// import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';
@Page({
  templateUrl: 'build/pages/add/add.html',
  providers: [HTTP_PROVIDERS]
  //directives: [FILE_UPLOAD_DIRECTIVES]
})

export class Add {
  //static get uploader() {return new FileUploader({url: ""})};
  
  static get parameters() {
    return [[Http]];
  }
  
  constructor(http) {
      this.http = http;
      this.albumTitle = "Give the new album a name";
      this.pictureVisible = true;
      this.firebaseUrl = Firebase_const.API_URL;
      this.name = localStorage.getItem('user');
         
      this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
      this.canUpdate = false;
      this.newalbum = true;
  }
  uploadPicture(evt){
     console.log(this.pictureVisible);
        this.pictureVisible = false;
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = ((theFile) => {
                return (e) => {
                    this.previewImage = e.target.result;
                    
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
            };
        })(f);
        reader.readAsDataURL(f);
}
getPicture(){
    /*
  var headers = new Headers();
   headers.append('Content-Type', 'application/json');
  this.http.post('http://stuart-nieuwpoort.be/upload.php', {"image":this.peviewImage},{ headers: headers })
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('Authentication Complete')
    );
    */
    
    if(this.locate){
        this.firebaseUrl = Firebase_const.API_URL;
        this.name = localStorage.getItem('user');
        if(!this.chosen){
            var ref = new Firebase(this.firebaseUrl).child('trips');
            // Push item to firebase URL (ref)
            var newId = ref.push({
                    name: this.name,
                    location: this.locate,
                    src: "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/OHUZL4GT6P.jpg", //this.previewImage
                    datetime: Firebase.ServerValue.TIMESTAMP,
                    sort: "Roadtrip",
                    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec scelerisque nulla. Etiam semper aliquet fermentum. Curabitur aliquam gravida nisl vitae tempus. Maecenas a varius mi, at convallis risus. Nulla gravida dolor ac dui iaculis, eu laoreet felis pellentesque. Vestibulum tempus tortor eget leo vulputate egestas. Phasellus aliquam, metus in congue faucibus, lorem ipsum pharetra libero, eu commodo orci sem a dolor. Etiam convallis sit amet ante nec malesuada. Proin at diam id ligula congue sagittis quis sed urna. Pellentesque non massa ac turpis vestibulum condimentum. Curabitur convallis felis metus, vel viverra est scelerisque eget. Vivamus vitae nisi nulla. Phasellus a imperdiet metus."
            }); 
            this.chosen = newId;
            if(this.chosen){
               var ref = new Firebase(this.firebaseUrl).child('trips')
                   .child(this.chosen.path.o[1])
                   .child('pictures');
                                        
                // Push item to firebase URL (ref)
                ref.push({
                        name: this.name,
                        location: this.locate,
                        src: "https://snap-photos.s3.amazonaws.com/img-thumbs/960w/OHUZL4GT6P.jpg",//this.previewImage
                        datetime: Firebase.ServerValue.TIMESTAMP,
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec scelerisque nulla. Etiam semper aliquet fermentum. Curabitur aliquam gravida nisl vitae tempus. Maecenas a varius mi, at convallis risus. Nulla gravida dolor ac dui iaculis, eu laoreet felis pellentesque. Vestibulum tempus tortor eget leo vulputate egestas. Phasellus aliquam, metus in congue faucibus, lorem ipsum pharetra libero, eu commodo orci sem a dolor. Etiam convallis sit amet ante nec malesuada. Proin at diam id ligula congue sagittis quis sed urna. Pellentesque non massa ac turpis vestibulum condimentum. Curabitur convallis felis metus, vel viverra est scelerisque eget. Vivamus vitae nisi nulla. Phasellus a imperdiet metus."
                }); 
            }
        }else{
            var ref = new Firebase(this.firebaseUrl).child('trips')
                .child(this.chosen)
                .child('pictures');
                                    
            // Push item to firebase URL (ref)
            ref.push({
                    name: this.name,
                    location: this.locate,
                    src: this.previewImage,
                    datetime: Firebase.ServerValue.TIMESTAMP
            }); 
        }

        this.pictureVisible = true;
        this.images = observableFirebaseArray(new Firebase(this.firebaseUrl).child('trips').orderByChild('name').startAt(this.name).endAt(this.name).limitToLast(3));
    }else{
        //console.log('niet gepost');
        this.focusLocate =! this.focusLocate;
    }
  }
    cancelPicture(){
        this.previewImage = "";
        this.pictureVisible = true;
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
}



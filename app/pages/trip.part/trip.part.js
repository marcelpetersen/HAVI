// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16
// TODO: when nog lat, long & coords

import { Page, NavParams, NavController } from 'ionic-angular';
import { Maps } from '../maps/maps';
import { StandardPicture } from '../../const';
import { obfiPipe } from '../../pipes/obfiPipe';
import { namePipe } from '../../pipes/namePipe';

@Page({
  templateUrl: 'build/pages/trip.part/trip.part.html',
  pipes: [[obfiPipe],[namePipe]]
})

export class Part {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.data = params.get('data');
        this.nav = nav;
        this.standardPicture = StandardPicture.URL;
        this.tabBarElement = document.querySelector('tabbar');
        this.searchName();
    }
    goBackHome(){
        this.nav.pop();
    }
    goMaps(){
        if(!this.data.coords || !this.data.coords.lat || !this.data.coords.lon){
            //this.nav.push(Maps,{location:this.data.location});
            console.log('Do something');
        }else if(this.coords){
             this.nav.push(Maps,{data:this.coords,location:this.data.location});
        }else{
            this.nav.push(Maps,{data:this.data.coords,location:this.data.location});
        }
    }
    onPageWillEnter(){
        if(!this.data.coords || !this.data.coords.lat || !this.data.coords.lon){
             this.searchLocation();
        }
        //this.tabBarElement.style.display = 'none';
    }
    onPageWillLeave(){
        //this.tabBarElement.style.display = 'flex';
    }
    
    searchLocation(){
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': this.data.location}, (results, status)=> {
            if (status === google.maps.GeocoderStatus.OK) {
               this.coords = results[0].geometry.location;
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    searchName(){

    }
}


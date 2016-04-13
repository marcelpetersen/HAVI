// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Maps } from '../maps/maps';
import { StandardPicture } from '../../const';

@Page({
  templateUrl: 'build/pages/trip.part/trip.part.html'
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
        console.log(this.data);
    }
    goBackHome(){
        this.nav.pop();
    }
    goMaps(){
        if(this.coords){
            this.nav.push(Maps,{data:this.coords,location:this.data.location});
        }else{
            this.nav.push(Maps,{location:this.data.location});
        }
    }
    onPageWillEnter(){
        this.searchLocation();
        this.tabBarElement.style.display = 'none';
    }
    onPageWillLeave(){
        this.tabBarElement.style.display = 'flex';
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
}
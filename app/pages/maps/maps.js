// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { NgZone } from 'angular2/core';

@Page({
  templateUrl: 'build/pages/maps/maps.html'
})

export class Maps {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.data = params.get('data');
        this.nav = nav;

           var mapOptions = {
            center: {lat: 55.676098, lng: 12.568337},
            zoom: 8
        }
        
        
        this.googleMap = new google.maps.Map(document.getElementById('map'),mapOptions);
        geocoder.geocode({'address': this.data}, (results, status) =>  {
            if (status === google.maps.GeocoderStatus.OK) {
            this.googleMap.setCenter(results[0].geometry.location);
                    
                    
                                
                var marker = new google.maps.Marker({
                    map: this.googleMap,
                    position: results[0].geometry.location
                });
                
            } else {
        alert('Geocode was not successful for the following reason: ' + status);
        }
        });
        

    }
    goBack(){
        this.nav.pop();
    }
}


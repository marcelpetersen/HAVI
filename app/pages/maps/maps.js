// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Cookie } from 'ng2-cookies/ng2-cookies';

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

        //Load google maps
        this.map = {
            locateAdress: function(){
                console.log('hier');
        var geocoder = new google.maps.Geocoder();
        var address = "Eikevlietbaan 27, Puurs";
        this.googleMap = new google.maps.Map(document.getElementById('map'));
                geocoder.geocode({'address': address}, (results, status) =>  {
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
            },
            init() {
                var map = new google.maps.Map(document.getElementById('map'),{
                    center: {lat: 55.676098, lng: 12.568337},
                    zoom: 8
                });
                this.map.locateAdress();
            }
        };

    }
    goBack(){
        this.nav.pop();
    }
    onPageDidEnter(){
        google.maps.event.addDomListener(window, "load",  this.map.init());
        //google.maps.event.addListenerOnce(new google.maps.Map(document.getElementById('map')), 'idle',this.map.locateAdress());
    }
}


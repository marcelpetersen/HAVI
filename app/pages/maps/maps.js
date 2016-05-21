// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16
// BUG: 
import { Page, NavParams, NavController } from 'ionic-angular';
import { NgZone } from '@angular/core';

@Page({
  templateUrl: 'build/pages/maps/maps.html'
})

export class Maps {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params){
        this.data = params.get('data');
        this.location = params.get('location');
        this.nav = nav;
        if(this.data.lat && this.data.lon){
            this.data = {
                lat : Number(this.data.lat),
                lng : Number(this.data.lon)
            }
        }
        this.tabBarElement = document.querySelector('tabbar');
    }
    goBack(){
        this.nav.pop();
    }
    onPageLoaded() {
        // On page load show map!
        document.getElementById('map').innerHTML = "";
        var mapEle = document.getElementById('map');
        var map = new google.maps.Map(mapEle, {
            center: this.data,
            zoom: 14,
            panControl: true,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true,
            draggable:true
        });
        // do something only the first time the map is loaded
        var marker = new google.maps.Marker({
            position: this.data,
            map: map,
            title: this.location
        });
    }
    onPageWillEnter(){
      // Show map in full page!
      this.tabBarElement.style.display = 'none';
    }
    onPageWillLeave(){
      this.tabBarElement.style.display = 'flex';
    }
}


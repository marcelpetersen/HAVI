// Page:        Photo wall connecting with Firebase & RXJS
// Author:      Pieter-Jan Sas
// Last update: 28/01/16

import { Page, NavParams, NavController } from 'ionic-angular';
import { Firebase_const } from '../../const';
import { Maps } from '../maps/maps';


@Page({
  templateUrl: 'build/pages/settings/settings.html'
})

export class Settings {
    static get parameters() {
        return [[NavController], [NavParams]];
    }
    constructor(nav,params,refresher){
        this.data = params.get('data');
        this.firebaseUrl = Firebase_const.API_URL;
        this.nav = nav;
        this.refresher = refresher;
        this.user = localStorage.getItem('user');
        //http.get('http://pjsas:Saskespj3@stuart-nieuwpoort.be/api/api.json')
        //    .observer({next: (value) => this.people = value});
    }
    goMaps(){
        this.nav.push(Maps,{data:this.data.address});
    }
    logOut(){
        localStorage.removeItem('user');
        localStorage.removeItem('name');
        localStorage.removeItem('picture');
        location.reload();
    }
    onPageWillEnter(){
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
            ref.child('private').once("value", snap => {
                if(snap.exists() === true){
                   if(snap.val() == true){
                       this.private = true;
                   }else{
                       this.private = false;
                   }
                }
            });
    }
    
    onPageWillLeave(){
        if(this.private === true){
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
            ref.child('private').once("value", snap => {
                if(snap.exists() === true){
                     var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
                    ref.update({private:true});
                }
            });
            
            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt(this.user).endAt(this.user);
            ref.once('value', snap => {
               if(snap.val()){
                   snap.forEach(snapshot =>{
                       var ref = new Firebase(this.firebaseUrl).child('trips').child(snapshot.key());
                       ref.update({private:true});
                   });
               } 
            });
        }else{
            var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
            ref.child('private').once("value", snap => {
                if(snap.exists() === true){
                    var ref = new Firebase(this.firebaseUrl).child('users').child(this.user);
                    ref.update({private:false});
                }
            });
            
            var ref = new Firebase(this.firebaseUrl).child('trips').orderByChild("name").startAt(this.user).endAt(this.user);
            ref.once('value', snap => {
               if(snap.val()){
                   snap.forEach(snapshot =>{
                       var ref = new Firebase(this.firebaseUrl).child('trips').child(snapshot.key());
                       ref.update({private:false});
                   });
               } 
            });
        }
    }
    goBack(){
        this.nav.pop();
    }
}
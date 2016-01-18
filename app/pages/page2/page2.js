import {Page,NgZone} from 'ionic/ionic';
import {Observable} from 'rxjs/Observable';

@Page({
  templateUrl: 'build/pages/page2/page2.html',
})

export class Page2 {
    zone:NgZone;
    constructor(){
        
   }
   
  takePhoto() {
    console.log("Going to take a pic ...");
    if(navigator.camera){
        navigator.camera.getPicture( (imageURI) => {
            this.url = imageURI;
        }, function (err) {
            this.error = err;
        }, {});
    }else{
         this.error = "Nog niet beschikbaar in de browser";
    }
  }
  
  uploadPhoto(input){
       if(input.files && input.files[0]){
           
       }
  }

}


import { Pipe, PipeTransform} from 'angular2/core';
import { Firebase_const } from '../const';
import { Observable } from 'rxjs/Observable';
import { observableFirebaseArray } from 'angular2-firebase';

@Pipe({
  name: 'Here'
})

export class Here {
  transform(value, args) {
    this.firebaseUrl = Firebase_const.API_URL;
    // Favourite trip
    return observableFirebaseArray(new Firebase(this.firebaseUrl).child('users').child(value).orderByChild('name'));
  }
}
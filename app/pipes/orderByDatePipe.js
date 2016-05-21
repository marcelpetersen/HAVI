import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderByDatePipe'
})

export class orderByDatePipe {
  transform(value, args) {
      if(value){
         value.sort(function(a,b){
            return new Date(b.datetime) - new Date(a.datetime);
        }); 
      }
      return value;
  }
}
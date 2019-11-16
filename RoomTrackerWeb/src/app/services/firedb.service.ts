import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UserEvent } from '../interfaces/events.interface';

@Injectable({
  providedIn: 'root'
})
export class FiredbService {

  constructor(private afs: AngularFirestore) {
  }

  getPeopleInRoom(roomName:string) {
    return new Observable(observer => {
      this.afs.collection('data', ref => 
        ref.where('tsout', '==', null)
        .where('room', '==', roomName)
      ).valueChanges()
      .subscribe(count => observer.next(count.length))
    })
  }

  getSum(days) {
    let sum = {};
    let now = new Date();
    return new Observable(observer => {
        
      this.afs.collection('data').valueChanges()
      .subscribe(data => {
        data.forEach((ue:UserEvent) => {
          if (ue.tsout == null)
            return;
          if ((now.valueOf()/1000) - days*24*60*60 <= ue.tsin.seconds)
          {
            if (sum[ue.room])
              sum[ue.room] += ue.tsout.seconds - ue.tsin.seconds;
            else
              sum[ue.room] = ue.tsout.seconds - ue.tsin.seconds;
            }
        })
        observer.next(sum);
      })
    })
  }
  

}

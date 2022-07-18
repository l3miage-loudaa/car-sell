import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Offer } from '../interfaces/Offer';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(private db:AngularFireDatabase, 
              private strorage : AngularFireStorage) {
      this.getOfferOn()
   }


  private offers : Offer[] = []
  offersSubject: BehaviorSubject<Offer[]> = new BehaviorSubject<Offer[]>([])

  getOfferOn() :void{
    this.db.list('offres').query.limitToLast(10).once('value', snapshot => {
      const offersSnapshotValue  = snapshot.val()
      const offers = Object.keys(offersSnapshotValue).map(id => ({id,...offersSnapshotValue[id]}))
      console.log(offers)
    })
  }



  getOffers(): void {
    this.db.list('offres').query.limitToLast(10).once('value', snapshot => {
      const offersSnapshotValue  = snapshot.val()
      if (offersSnapshotValue){
        const offers = Object.keys(offersSnapshotValue).map(id => ({id,...offersSnapshotValue[id]}))
        this.offers = offers
      }
      this.dispachOffers()
    })
  }

dispachOffers(){
  this.offersSubject.next(this.offers)
}

 async  createOffer(offer:Offer, offerPhoto?: any): Promise<Offer>{
    
      try {
        const photoUrl =  offerPhoto ? await this.uploadPhoto(offerPhoto) : ''
        const response = this.db.list('offres').push({...offer, photo:photoUrl})
        const createdOffre = {...offer, photo :photoUrl, id: <string>response.key}
        this.offers.push(createdOffre)
        this.dispachOffers()
        return createdOffre
      } catch (error) { 
        throw error
      }


  }

 async editOffer(offer : Offer,offerid : string,newOfferPhto?:any): Promise<Offer>{

  try {
    if(newOfferPhto && offer.photo && offer.photo !== ''){
      await this.revomePhoto(offer.photo);
    }
    if(newOfferPhto){
      const newPhotoUrl = await this.uploadPhoto(newOfferPhto)
      offer.photo = newPhotoUrl
    }
    await this.db.list('offres').update(offerid,offer)
    const offerIndexToUpdate = this.offers.findIndex(el => el.id === offerid)
    this.offers[offerIndexToUpdate] = {...offer, id:offerid}
    this.dispachOffers()
    return {...offer, id:offerid}
  } catch (error) {
    throw error
  }
  

  }

  async deleteOffer(offerId: string):  Promise<Offer>{
    try {
       const offerToDeleteindex = this.offers.findIndex(el => el.id === offerId)
       const offerToDelete  = this.offers[offerToDeleteindex]
       if(offerToDelete.photo && offerToDelete.photo !=='') {
          await this.revomePhoto(offerToDelete.photo)
       }
      await this.db.list('offres').remove(offerId)
      this.offers.splice(offerToDeleteindex,1)
      this.dispachOffers()
      return offerToDelete;
    } catch (error) {
      throw error;
    } 
    
  }

  private uploadPhoto(photo: any) : Promise<string>{
    return new Promise((resolve,reject)=> {
       const upload = this.strorage.upload('offers/'+ Date.now()+'-'+ photo.name, photo)
       upload.then((res) =>{
         resolve(res.ref.getDownloadURL())
       }).catch(reject)
    })
  } 

  private revomePhoto(photoUrl :string): Promise<any>{
    return  new Promise((resolve,reject)=> {
      this.strorage.refFromURL(photoUrl).delete().subscribe({
        complete: () => resolve({}),
        error: reject
      })
    })
  }

}

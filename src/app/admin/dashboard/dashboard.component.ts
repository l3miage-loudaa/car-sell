import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { observable, Subscription } from 'rxjs';
import { Offer } from 'src/app/interfaces/Offer';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  offerFORM!: FormGroup
  
  offers: Offer[] = []
  
  currentcar: any
  
  supscription !:Subscription

  currentOfferPhotoFile!: any

  currentOfferPhotoUrl !: string

  constructor(private formbuilder : FormBuilder,
              private offersService :OffersService) { }
  ngOnInit(): void {
    this.initOfferForm()
    this.offersService.getOffers()

    this.supscription = this.offersService.offersSubject.subscribe({
      next :(offers : Offer[]) => {this.offers = offers},
      complete: () => {console.log('Observable complete')},
      error : (error) => { console.log(error);} 
    })
    
  }
 
  initOfferForm() : void{
    this.offerFORM = this.formbuilder.group({
      id:[null],
      title: ['',[Validators.required,Validators.maxLength(100)]],
      photo: [],
      brand: '',
      model : '',
      description : '',
      price: 0
    })
  }

  onChangeOfferPhoto($event : any) :void {
    this.currentOfferPhotoFile = $event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(this.currentOfferPhotoFile)
    fileReader.onloadend =  (e) => {
      this.currentOfferPhotoUrl = <string>e.target?.result
    }
  }
 

  onSubmitOfferForm(): void{
    const offerId = this.offerFORM.value.id
    let offer = this.offerFORM.value
    const offerPhotoUrl = this.offers.find(el => el.id === offerId)?.photo
    offer = {...offer, photo:offerPhotoUrl}
    if(!offerId || offerId && offerId === ''){
      delete offer.id
    this.offersService.createOffer(offer,this.currentOfferPhotoFile).catch(console.error)
    }else{
      delete offer.id
      this.offersService.editOffer(offer,offerId,this.currentOfferPhotoFile).catch(console.error)
    }

    this.offerFORM.reset();
    this.currentOfferPhotoFile = null;
    this.currentOfferPhotoUrl = '';
  }

onEditeOffer(offer : Offer): void{
  this.currentOfferPhotoUrl =  offer.photo ? <string>offer.photo : ''
  this.offerFORM.setValue({
    id: offer.id ? offer.id : '',
    title : offer.title ? offer.title : '',
    photo:'',
    brand : offer.brand ? offer.brand : '',
    model : offer.model ? offer.model : '',
    price : offer.price ? offer.price : 0,
    description : offer.description ?  offer.description : ''
  })
}

onDeleteOffer(offerId?: string) : void{
  if(offerId){
     this.offersService.deleteOffer(offerId)
  }else{
    console.log("An id must be provided to delete an offer")
  }
}
}


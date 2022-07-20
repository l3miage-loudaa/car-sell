import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer } from 'src/app/interfaces/Offer';
import { OffersService } from 'src/app/services/offers.service';

@Component({
  selector: 'app-single-offer',
  templateUrl: './single-offer.component.html',
  styleUrls: ['./single-offer.component.scss']
})
export class SingleOfferComponent implements OnInit {

  currentOffer !: Offer
  constructor(
    private offerService : OffersService,
    private activatedRoute : ActivatedRoute 
  ) { }

  ngOnInit(): void {
    const offerId = this.activatedRoute.snapshot.paramMap.get('id')
    this.offerService.getOffersById(<string>offerId)
    .then((offer) => this.currentOffer = offer) 
    .catch(console.error)
  }

}

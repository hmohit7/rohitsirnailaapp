import { Component } from '@angular/core';

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-razor',
  templateUrl: 'razor.page.html',
  styleUrls: ['razor.page.scss'],
})
export class RazorPage {
  paymentAmount: number = 333;
  currency: string = 'INR';
  currencyIcon: string = '₹';
  razor_key = '7x85rWExQttEoWcsRxxIyCpd';
  cardDetails: any = {};


  constructor() {
  }



  payWithRazor() {

    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: this.currency,
      key: this.razor_key,
      amount: this.paymentAmount,
      name: 'Naila',
      prefill: {
        email: 'hmohit7@gmail.com',
        contact: '9880013407',
        name: 'Naila'
      },
      theme: {
        color: '#F37254'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };

    var successCallback = function (payment_id) {
      alert('payment_id: ' + payment_id);
    };

    var cancelCallback = function (error) {
      alert(error.description + ' (Error ' + error.code + ')');
    };

    RazorpayCheckout.open(options, successCallback, cancelCallback);
  }

}

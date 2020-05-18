import { Component } from '@angular/core';

declare var RazorpayCheckout: any;

@Component({
  selector: 'app-razor',
  templateUrl: 'approvalpopup.component.html',
  styleUrls: ['approvalpopup.component.scss'],
})
export class ApprovalpopupComponent {
  paymentAmount: number = 333;
  currency: string = 'INR';
  currencyIcon: string = '₹';
  razor_key = 'rzp_test_W6w8NUHKBgXqpL';
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

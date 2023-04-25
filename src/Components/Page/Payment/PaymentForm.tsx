import React, { useState } from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { toastNotify } from '../../../Helper';
import orderSummaryProps from '../Order/orderSummaryProps';
import { apiResponse, cartItemModel } from '../../../Interfaces';
import { useCreateOrderMutation } from '../../../apis/orderApi';
import { SD_Status } from '../../../Utility/SD';
import { useNavigate } from 'react-router-dom';
function PaymentForm({ data, userInput }: orderSummaryProps) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required"
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      toastNotify("An unexpected error occured.", "error");
      setIsProcessing(false);
    } else {
      let grandTotal = 0;
      let totalItems = 0;
      const orderDetailsDto: any = []

      data.cartItems?.forEach((item:cartItemModel) => {
        const tempOrderDetail: any = {};
        grandTotal += (item.quantity! * item.menuItems?.price!);
        totalItems += item.quantity!;
        return tempOrderDetail["menuItemId"] = item.menuItems?.id,
        tempOrderDetail["qty"] = item.quantity,
        tempOrderDetail["itemName"] = item.menuItems?.name,
        tempOrderDetail["price"] = item.menuItems?.price,
        orderDetailsDto.push(tempOrderDetail);
      });

      const response: apiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems: totalItems,
        orderTotal: grandTotal,
        appUserId: data.userId,
        orderDetailsDto: orderDetailsDto,
        stripePaymentIntentId: data.stripePaymentIntentId ,
        status: result.paymentIntent.status === "succeeded" ? SD_Status.CONFIRMED: SD_Status.PENDING,
      });

      if(response){
        if(response.data?.result.status === SD_Status.CONFIRMED){
          navigate(`/order/orderConfirmed/${response.data.result.orderHeaderId}`)
        }
        else {
          navigate("/failed");
        }
      }
    }
    setIsProcessing(false);
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || isProcessing} 
       className='btn btn-success form-control mt-4'>
          <span id="button-text">
              {isProcessing ? "Processing ..." : "Submit Order"}
          </span>
        </button>
    </form> 
    </>
  )
}

export default PaymentForm;
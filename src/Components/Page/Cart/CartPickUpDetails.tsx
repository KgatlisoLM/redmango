import React, { useEffect, useState } from 'react';
import { apiResponse, cartItemModel, userModel } from '../../../Interfaces';
import { RootState } from '../../../Storage/Redux/store';
import { useSelector } from 'react-redux';
import { inputHelper } from '../../../Helper';
import { MiniLoader } from '../Common';
import { useInitiatePaymentMutation } from '../../../apis/paymentApi';
import { useNavigate } from 'react-router-dom';

function CartPickUpDetails() {
    let grandTotal = 0;
    let totalItems = 0;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
    );
    const userData: userModel = useSelector(
      (state: RootState) => state.userAuthStore
    );
   const initialUserData = {
      name: userData.fullname,
      email: userData.email,
      phoneNumber: "",
   };
  const [userInput, setUserInput] = useState(initialUserData);
  const [initiatePayment] = useInitiatePaymentMutation();

    shoppingCartFromStore?.map((cartItem: cartItemModel) => {
        totalItems += cartItem.quantity ?? 0;
        grandTotal += (cartItem.menuItems?.price ?? 0) * (cartItem.quantity ?? 0);
        return null;
    });


    const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
    };


    useEffect(() => {
      setUserInput({
        name: userData.fullname,
        email: userData.email,
        phoneNumber: "",
      });
    },[userData])

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const {data} : apiResponse = await initiatePayment(userData.id);
        // const orderSummary = {grandTotal, totalItems};
        navigate("/payment", {
            state: { apiResult: data?.result, userInput},
        });

    };
  

  return (
    <>
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form onSubmit={handleSubmit} className="col-10 mx-auto">
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            className="form-control"
            placeholder="name..."
            value={userInput.name}
            name="name"
            required
            onChange={handleUserInput}
          />
        </div>
        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            className="form-control"
            placeholder="email..."
            value={userInput.email}
            name="email"
            required
            onChange={handleUserInput}
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="number"
            className="form-control"
            placeholder="phone number..."
            value={userInput.phoneNumber}
            name="phoneNumber"
            required
            onChange={handleUserInput}
          />
        </div>
        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Grand Total : ${grandTotal.toFixed(2)}</h5>
            <h5>No of items : {totalItems}</h5>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={loading}
        >
            {loading ? <MiniLoader/> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
    </>
  )
}

export default CartPickUpDetails;
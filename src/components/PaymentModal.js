import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTruck } from "@fortawesome/free-solid-svg-icons";
import { faBell, faStar } from "@fortawesome/free-regular-svg-icons";
import { Logincontext } from "../context/LoginContext";
import { CartContext } from "../context/CartContext";
import { handleIncreQty, handleDecQty, handleRemoveItemInCart } from "../utils/ProductQuantity";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageContext } from "../context/MessageContext";

function PaymentModal() {
  const { logindetails, SetLoginDetails } = useContext(Logincontext);
  const { cartItems, setCartItems, priceDetails } = useContext(CartContext);
  const { msg, setMsg } = useContext(MessageContext)
  const [deliveryAddress, setDeliveryAdresss] = useState('')

  const navigate = useNavigate()
  const { state } = useLocation();

  const [formValues, setFormValues] = useState({
    Card_Number: '',
    ExpirationDate: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    Card_Number: false,
    ExpirationDate: false,

  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });

    //updated field validation status
    if (value.trim() === "") {
      setFieldErrors({
        ...fieldErrors,
        [name]: true,
      })

    } else {
      setFieldErrors({
        ...fieldErrors,
        [name]: false,
      })
    }
  }

  const isValidExpiryDate = (ExpirationDate) => {
    // Check if the input matches the "MM/YY" format
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(ExpirationDate)) {
      return false;
    }

    // Split the input into month and year parts
    const [inputMonth, inputYear] = ExpirationDate.split('/').map((str) => parseInt(str, 10));

    // Get the current date
    const currentDate = new Date();

    // Extract the current year and month
    const currentYear = currentDate.getFullYear() % 100; // Extract the last two digits
    const currentMonth = currentDate.getMonth() + 1; // January is 1, February is 2, etc.

    // Check if the year is in the future, or if it's the current year and the month is in the future
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      return false;
    }

    // If all checks pass, the expiration date is valid
    return true;
  };

  // function isValidExpiryDate(cardNumber) {
  //   // Remove non-digit characters
  //   const cleanedCardNumber = cardNumber.replace(/\D/g, '');

  //   // Check if the cleaned card number is the correct length (for simplicity, we'll assume 13-19 digits)
  //   return /^[0-9]{13,19}$/.test(cleanedCardNumber);
  // }

  const [paymentOption, setPaymentOption] = useState({
    upi: false,
    wallets: false,
    card: false,
    netBank: false,
    cash: false,
  });

  function handlePaymenOptionOnChange(e) {
    const { value } = e.target;
    const newopj = {
      upi: false,
      wallets: false,
      card: false,
      netBank: false,
      cash: false,
    };
    setPaymentOption({
      ...newopj,
      [value]: true,
    });
  }
  const handleFormValuesChange = () => {
    const formFields = Object.values(formValues);
    const allFieldsFilled = formFields.every((field) => field !== '');
    setFieldErrors(allFieldsFilled);
  }

  const [paymentform, setPaymentForm] = useState({
    form1: false,
    form2: false,
    form3: false,
    form4: false,
  });

  let loginCarddetailStyle = logindetails.isLogin
    ? {
      height: "fit-content",
      overflow: "hidden",
      opacity: "1",
      visibility: "visible",
      padding: "1rem",
    }
    : {
      height: "fit-content",
      overflow: "hidden",
      opacity: "1",
      visibility: "visible",
    };

  let deliveryCardDetailStyle = logindetails.isLogin
    ? {
      height: "fit-content",
      overflow: "hidden",
      opacity: "1",
      visibility: "visible",
      padding: "1rem",
    }
    : {};

  let orderSumeryHeadStyle =
    logindetails.isLogin && paymentform.form1 && paymentform.form2
      ? { backgroundColor: "#2874f0", color: "white" }
      : {};
  let orderSumeryHead2Style = logindetails.isLogin && paymentform.form3
    ? { backgroundColor: "white", color: "#878787" }
    : {};
  let orderSumeryDetailsStyle =
    logindetails.isLogin && paymentform.form1 && paymentform.form2
      ? {
        height: "fit-content",
        overflow: "hidden",
        opacity: "1",
        visibility: "visible",
        padding: "1rem",
      }
      : {};

  let paymentMethodHeadStyle =
    logindetails.isLogin && paymentform.form1 && paymentform.form2 && paymentform.form3
      ? { backgroundColor: "#2874f0", color: "white" }
      : {};

  let paymentMethodDetailsStyle =
    logindetails.isLogin && paymentform.form1 && paymentform.form2 && paymentform.form3
      ? {
        height: "fit-content",
        overflow: "hidden",
        opacity: "1",
        visibility: "visible",
      }
      : {};

  function handleDeiveryAdressOnchange(e) {
    setDeliveryAdresss(e.target.value)
  }

  function isValidCardNumber(cardNumber) {
    // Remove any non-digit characters from the card number
    const cleanedCardNumber = cardNumber.replace(/\D/g, '');

    // Check if the cleaned card number is exactly 16 digits
    if (cleanedCardNumber.length !== 16) {
      return false;
    }

    // You can add more validation rules here if needed

    // If all checks pass, consider the card number valid
    return true;
  }

  useEffect(() => {
    if (!state) {
      navigate('/marketplace/FLIPKART')
    }
  }, [state, navigate])


  function handlePlaceOrder(e) {
    // Check if the card number is valid
    if (!isValidCardNumber(formValues.Card_Number)) {
      // Show an error message for invalid card number
      setFieldErrors({
        ...fieldErrors,
        Card_Number: true,
      });
      return; // Stop order placement if the card number is invalid
    }

    // Check if the expiration date is valid
    if (!isValidExpiryDate(formValues.ExpirationDate)) {
      // Show an error message for invalid expiration date
      setFieldErrors({
        ...fieldErrors,
        ExpirationDate: true,
      });
      return; // Stop order placement if the expiration date is invalid
    }
    if (localStorage.getItem('flip-cart') && localStorage.getItem('flip-cart-price')) {
      let cartItem = JSON.parse(localStorage.getItem('flip-cart'));
      let cartprice = JSON.parse(localStorage.getItem('flip-cart-price'));
      let placedOrder = {}
      placedOrder.cartItem = cartItem
      placedOrder.cartPrice = cartprice;
      placedOrder.status = 'On the way'
      placedOrder.payment = paymentOption.upi ? 'UPI' : paymentOption.card ? 'CARD' : paymentOption.netBank ? 'Net Banking' : paymentOption.cash ? 'CASH ON DELIVERY' : paymentOption.wallets ? 'Wallet' : ''

      if (localStorage.getItem('orderList')) {
        let oldlist = JSON.parse(localStorage.getItem('orderList'));

        localStorage.setItem('orderList', JSON.stringify([{ ...placedOrder }, ...oldlist]))
      }
      else {
        localStorage.setItem('orderList', JSON.stringify([{ ...placedOrder }]))
      }

      setCartItems([])
      navigate('/user/orderPlaced/confirm', { state: { ...placedOrder } })
      setMsg({
        ...msg,
        msgStatus: true, msgType: 'o', msg: 'order placed successfully'
      })
    }
  }

  useEffect(() => {

    if (logindetails.isLogin && logindetails.address !== "") {
      setPaymentForm({ ...paymentform, form1: true, form2: true });
    }
    else if (logindetails.isLogin) {
      setPaymentForm({ ...paymentform, form1: true });
    }
  }, [logindetails.isLogin]);
  let isValid;

  return (
    <div className="paymentmodel">

      <div className="left-pamentDetails">
        <div className="paymentDetails-holder">
          <div className="paymentModellogin">
            <div
              className="paymentModellogin-hold-head"
              style={{
                backgroundColor: logindetails.isLogin ? "white" : "#2874f0",
                color: logindetails.isLogin ? "#878787" : "white",
              }}
            >
              <span>1</span>
              <span>
                LOGIN{" "}
                {logindetails.isLogin && <FontAwesomeIcon color="#2874f0" icon={faCheck} />}{" "}
              </span>
            </div>
            <div
              className="paymentModellogin-hold-details"
              style={{
                ...loginCarddetailStyle,
              }}
            >
              {!logindetails.isLogin && (
                <div className="paymentModellogin-hold-details-card">
                  <div className="paymentModellogin-hold-details-cardLogininput">
                    <div className="paymentModellogin-input-holder">
                      <input placeholder="Email/mobile Number" />
                      <label>Email/mobile Number</label>
                    </div>
                    {/* <div className="paymentModellogin-input-holder">
                      <input placeholder="Enter OTP" />
                      <label>Enter OTP</label>
                    </div> */}
                    <div>
                      By continuing, you agree to Flipkart's{" "}
                      <span>Terms of Use</span> and <span>Privacy Policy</span>
                    </div>
                    <button type="button">Request to OTP</button>
                    {/* <button type="button">Login</button> */}
                  </div>
                  <div className="advantage-secure">
                    <div>Advantages of our secure login</div>
                    <div>
                      <FontAwesomeIcon icon={faTruck} /> Easily Track Orders,
                      Hassle free Returns
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faBell} /> Get Relevant Alerts and
                      Recommendation
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faStar} /> Wishlist, Reviews,
                      Ratings and more.
                    </div>
                  </div>
                </div>
              )}

              {logindetails.isLogin && (
                <div>
                  {logindetails.name} {logindetails.mobile}
                </div>
              )}
            </div>
          </div>
          <div className="paymentmodelDelivery">
            <div
              className={`paymentmodelDelivery-hold-head`}
              style={{
                backgroundColor: !logindetails.isLogin
                  ? "white"
                  : logindetails.isLogin && logindetails.address !== ""
                    ? "white"
                    : "#2874f0",
                color: !logindetails.isLogin
                  ? "#878787"
                  : logindetails.isLogin && logindetails.address !== ""
                    ? "#878787"
                    : "white",
              }}
            >
              <span>2</span>
              <span>
                DELIVERY ADDRESS{" "}
                {logindetails.isLogin && logindetails.address !== "" && (
                  <FontAwesomeIcon color="#2874f0" icon={faCheck} />
                )}
              </span>
            </div>
            <div
              className="paymentmodelDelivery-hold-details"
              style={{ ...deliveryCardDetailStyle }}
            >

              {logindetails.isLogin && logindetails.address === "" && (
                <div>
                  <input type={"text"} placeholder="Delivery Address" onChange={handleDeiveryAdressOnchange} />
                  <button
                    value={deliveryAddress}
                    type="button"
                    onClick={(e) => {

                      if (localStorage.getItem('UserData')) {
                        let usedata = JSON.parse(localStorage.getItem('UserData')).map((user) => {

                          if (user.email === logindetails.email) {

                            return { ...user, address: deliveryAddress }
                          }
                          else {
                            return user
                          }
                        })
                        SetLoginDetails({
                          ...logindetails,
                          address: deliveryAddress
                        })
                        localStorage.setItem('FlipKart_isLogin', JSON.stringify({ ...logindetails, address: deliveryAddress }))
                        localStorage.setItem('UserData', JSON.stringify([...usedata]))
                        setPaymentForm({
                          ...paymentform,
                          form2: true
                        })
                      }
                    }}
                  >
                    Save Address
                  </button>
                </div>
              )}
              {logindetails.isLogin && logindetails.address !== "" && (
                <div>{logindetails.address}</div>
              )}
            </div>
          </div>
          <div className="PaymentmodelOrderSummary">
            <div
              className="PaymentmodelOrderSummary-hold-head"
              style={{ ...orderSumeryHeadStyle, ...orderSumeryHead2Style }}
            >
              <span>2</span>
              <span>ORDER SUMMARY</span>{" "}
              {(logindetails.isLogin && paymentform.form2 && paymentform.form3) && <FontAwesomeIcon color="#2874f0" icon={faCheck} />}
            </div>
            <div
              className="PaymentmodelOrderSummary-hold-details"
              style={{ ...orderSumeryDetailsStyle }}
            >
              {!paymentform.form3 && (
                <div className="orderSumarry-Card-wrap">
                  {cartItems.map((item, idx) => {
                    return (
                      <div key={item.title + idx} className="orderSumarry-Card">
                        <div className="orderSumarry-Card-img-holder">
                          <div className="orderSumarry-Card-img">
                            <img
                              src={item.images[0]}
                              alt=""
                              style={{
                                maxWidth: "100%",
                                objectFit: "cover",
                                width: "100px",
                              }}
                            />
                          </div>
                          <div className="orderSumarry-Card-qty">
                            <button disabled={item.quantity === 1 ? true : false} onClick={e => handleDecQty(e, item.id, cartItems, setCartItems)}>-</button>
                            <span> {item.quantity} </span>
                            <button onClick={e => handleIncreQty(e, item.id, cartItems, setCartItems)}>+</button>
                          </div>
                        </div>
                        <div className="orderSumarry-Card-details">
                          <div className="orderSumarry-Card-details-title">
                            {item.title}
                          </div>
                          <div className="orderSumarry-Card-details-price">
                            &#x20B9;{item.price}
                          </div>
                          <div>
                            <button onClick={e => handleRemoveItemInCart(e, item.id, cartItems, setCartItems)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    className="orderSummery-Confirm-order"
                    onClick={(e) =>
                      setPaymentForm({ ...paymentform, form3: true })
                    }
                  >
                    Confirm Orders
                  </button>
                </div>
              )}
              {paymentform.form3 && <div>{cartItems.length} item</div>}
            </div>
          </div>
          <div className="PaymentmodelPayMentOption">
            <div
              className="PaymentmodelPayMentOption-hold-head"
              style={{ ...paymentMethodHeadStyle }}
            >
              <span>1</span>
              <span>PAYMENT OPTIONS</span>
            </div>
            <div className="PaymentmodelPayMentOption-hold-details"
              style={{ ...paymentMethodDetailsStyle }}
            >
              <div className="Paymentoption-wrap">
                <div className="Paymentoption-input-holder-wrap">
                  <div className="Paymentoption-input-holder">
                    <input
                      type={"radio"}
                      name="paymentOption"
                      value={"card"}
                      onChange={handlePaymenOptionOnChange}
                    />
                    <label>Credit/ Debit / ATM Card</label>
                    {/* <p>Add and Secure your card as per RBI guidelines</p> */}
                  </div>
                  {paymentOption.card && <div className="paymentOption-Selected-radio">
                    <label>CARD Number</label>
                    <input
                      label="Credit Card Number"
                      variant="outlined"
                      fullWidth
                      placeholder="XXXX-XXXX-XXXX-XXXX" // Placeholder for the format
                      name="Card_Number"
                      margin="normal"
                      type="text"
                      onInput={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                        const formattedValue = inputValue
                          .slice(0, 16) // Limit to 16 digits
                          .replace(/(\d{4})(?=\d)/g, '$1-'); // Add dashes every 4 digits
                        e.target.value = formattedValue;
                      }}
                      inputProps={{ maxLength: 19 }}
                      value={formValues.Card_Number}
                      onChange={handleInputChange}
                      onBlur={handleFormValuesChange}
                      error={formValues.Card_Number.length !== 19 && formValues.Card_Number !== ''} // Check for validation error
                      helpertext={
                        formValues.Card_Number.length !== 19 && formValues.Card_Number !== ''
                          ? 'Invalid card number (XXXX-XXXX-XXXX-XXXX)'
                          : ''
                      }
                      required
                    /><label>Name In Card</label>
                    <input
                      name="ExpirationDate"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="text"
                      placeholder="MM/YY" // You can use a placeholder for the format
                      maxLength={5}
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")   // Remove non-numeric characters
                          .replace(/(\d{2})(\d{0,2})/, "$1/$2") // Format as MM/YY
                          .substr(0, 5);         // Limit to 5 characters (MM/YY)

                        isValid = isValidExpiryDate(e.target.value);
                        if (!isValid) {
                          e.target.setCustomValidity("Invalid expiration date (MM/YY)");
                        } else {
                          e.target.setCustomValidity("");
                        }
                      }}
                      value={formValues.ExpirationDate}
                      onChange={handleInputChange}
                      onBlur={handleFormValuesChange}
                      error={!isValidExpiryDate(formValues.ExpirationDate)}
                      
                      required
                    />

                    <label>Expiry Date</label>
                    <input
                      name="ExpirationDate"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="text"
                      placeholder="MM/YY" // You can use a placeholder for the format
                      maxLength={5}
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")   // Remove non-numeric characters
                          .replace(/(\d{2})(\d{0,2})/, "$1/$2") // Format as MM/YY
                          .substr(0, 5);         // Limit to 5 characters (MM/YY)

                        isValid = isValidExpiryDate(e.target.value);
                        if (!isValid) {
                          e.target.setCustomValidity("Invalid expiration date (MM/YY)");
                        } else {
                          e.target.setCustomValidity("");
                        }
                      }}
                      value={formValues.ExpirationDate}
                      onChange={handleInputChange}
                      onBlur={handleFormValuesChange}
                      error={!isValidExpiryDate(formValues.ExpirationDate)}
                      
                      required
                    />

                  </div>}
                </div>


                {/* <div className="Paymentoption-input-holder-wrap">
                  <div className="Paymentoption-input-holder">
                    <input
                      type={"radio"}
                      name="paymentOption"
                      value={"cash"}
                      onChange={handlePaymenOptionOnChange}
                    />
                    <label>Cash on Delivery</label>
                  </div>
                </div> */}
              </div>

              {(paymentOption.card || paymentOption.cash) && <div className="paymentoption-Continue">
                <button onClick={e => { handlePlaceOrder(e) }}>Confirm</button>
              </div>}
            </div>
          </div>
        </div>
      </div>
      {logindetails.isLogin && (
        <div className="right-priceDetails" style={{}}>
          <div
            className="right-priceDetails-wrap"
            style={{
              marginTop: "1rem",
              backgroundColor: "white",
              padding: "1rem",
            }}
          >
            <div>PRICE DETAILS</div>
            <div className="">
              <span>Price ({cartItems.length} item)</span>
              <span>&#8377;{priceDetails.price}</span>
            </div>
            <div className="">
              <span>Discount</span>
              <span style={{ color: 'green' }}>-&#8377;{priceDetails?.discountPrice}</span>
            </div>
            <div className="">
              <span>Delivery Charges</span>
              <span>FREE</span>
            </div>
            <div className="">
              <span>Total Payable</span>
              <span>&#8377;{priceDetails.TotalPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentModal;

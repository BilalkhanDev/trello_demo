import React from 'react';

const ProductDisplay = () => (
  <section>
    <div className="product">
      <h3>Starter plan</h3>
      <h5>$20.00 / month</h5>
      <form action="/create-checkout-session" method="POST">
        <input type="hidden" name="lookup_key" value="{{PRICE_LOOKUP_KEY}}" />
        <button type="submit">Checkout</button>
      </form>
    </div>
  </section>
);

const SuccessDisplay = ({ sessionId }) => (
  <section>
    <h3>Subscription successful!</h3>
    <form action="/create-portal-session" method="POST">
      <input type="hidden" name="session_id" value={sessionId} />
      <button type="submit">Manage Billing</button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

const Product = () => {
  const { message, success, sessionId } = useSubscriptionStatus();

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
};

export default Product;

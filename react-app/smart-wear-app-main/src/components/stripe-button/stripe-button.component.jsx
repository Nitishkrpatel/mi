import React from 'react';

import StripeCheckout from 'react-stripe-checkout';

const StripeCheckoutButton = ({price}) => {
    const priceForStripe = price*100;
    const publishableKey = 'pk_test_51HzMdLLtPVm0UL536r9A7LwnGH2zDQkWNYapOz4yDmg5nyLLAhLBcj9z3lfdhVFruRULGJTsKTAQQSHfS30Vs5GI00NT3xDqpn';

    const onToken = (token) => {
        console.log(token);
        alert('payment successful');
    }
    return(
        <StripeCheckout 
            label='Pay Now'
            name='smart-wear'
            billingAddress
            shippingAddress
            image='https://svgshare.com/i/CUz.svg'
            description={`your total is $${price}`}
            amount={priceForStripe}
            panelLabel='Pay Now'
            token={onToken}
            stripeKey={publishableKey}
                    
        />
    );
}

export default StripeCheckoutButton;
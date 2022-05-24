/* eslint-disable jsx-a11y/aria-role */

import {PayPalScriptProvider, PayPalButtons} from '@paypal/react-paypal-js'
import {RequireAuth} from '../../src/auth/components/requireAuth'
import {Auth} from '../../src/auth/hooks'
import {Container} from '../../src/shared/components/container'
import {DashboardNavigation} from '../../src/shared/components/dashboardNavigation/dashboardNavigation'

const Subscriptions = ({auth}: {auth: Auth}) => {
  return (
    <>
      <DashboardNavigation user={auth.user} />
      <Container>
        <div>Subscriptions</div>
        {/* <PayPalScriptProvider
          options={{
            'client-id':
              'Ae_y8UT79uzz_hrfjOKIE_xXq79mikMnDTL0uHK9ixAd7y704ut9u5WYPIBVt3zs3JjflXwxYmRfjUEe',
          }}
        >
          <PayPalButtons style={{layout: 'horizontal'}} />
        </PayPalScriptProvider> */}
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_blank"
        >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="LQHVKZ25VHPXC" />
          <input
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif"
            border="0"
            name="submit"
            alt="PayPal - The safer, easier way to pay online!"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
        <a
          target="_blank"
          href="https://www.paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=KYGRJRX9VFPUA"
          rel="noreferrer"
        >
          <img
            src="https://www.paypalobjects.com/en_US/i/btn/btn_unsubscribe_LG.gif"
            BORDER="0"
          />
        </a>
      </Container>
    </>
  )
}

export default function SubscriptionsPage() {
  return (
    <RequireAuth
      render={({auth}) => {
        return <Subscriptions auth={auth} />
      }}
    />
  )
}

// <div id="paypal-button-container-P-6LV985452D429430VMKGMFCA"></div>
// <script src="https://www.paypal.com/sdk/js?client-id=Ae_y8UT79uzz_hrfjOKIE_xXq79mikMnDTL0uHK9ixAd7y704ut9u5WYPIBVt3zs3JjflXwxYmRfjUEe&vault=true&intent=subscription" data-sdk-integration-source="button-factory"></script>
// <script>
//   paypal.Buttons({
//       style: {
//           shape: 'rect',
//           color: 'gold',
//           layout: 'vertical',
//           label: 'subscribe'
//       },
//       createSubscription: function(data, actions) {
//         return actions.subscription.create({
//           /* Creates the subscription */
//           plan_id: 'P-6LV985452D429430VMKGMFCA'
//         });
//       },
//       onApprove: function(data, actions) {
//         alert(data.subscriptionID); // You can add optional success message for the subscriber here
//       }
//   }).render('#paypal-button-container-P-6LV985452D429430VMKGMFCA'); // Renders the PayPal button
// </script>

/**
 * SRT Royal — payment gateway abstraction.
 *
 * IMPORTANT: No real payment gateway is configured yet. Nothing in this file
 * pretends a payment succeeded. Until real credentials exist (bKash, Nagad,
 * or SSLCommerz merchant account), the only supported flow is 'manual':
 * an admin looks at proof of payment (bank transfer, bKash SMS, etc.)
 * outside the platform and confirms it themselves.
 *
 * When you're ready to add a real gateway:
 *   1. Add its credentials to your environment variables (never hard-code them).
 *   2. Implement a real initiatePayment() branch for that gateway that calls
 *      their API and returns a redirect/checkout URL.
 *   3. Implement a webhook route that gateway calls back on completion,
 *      verifies their signature, and ONLY THEN calls markPaid() below.
 *   4. Never mark a payment 'paid' from a request that originated in the browser —
 *      only from a verified webhook call or an authenticated admin action.
 */

const SUPPORTED_GATEWAYS = ['bkash', 'nagad', 'sslcommerz', 'manual'];
const LIVE_GATEWAYS = []; // none configured yet — add e.g. 'sslcommerz' here once real credentials exist

function isGatewayLive(gateway) {
  return LIVE_GATEWAYS.includes(gateway);
}

function assertGatewaySupported(gateway) {
  if (!SUPPORTED_GATEWAYS.includes(gateway)) {
    const err = new Error(`Unsupported payment gateway: ${gateway}`);
    err.statusCode = 400;
    throw err;
  }
  if (gateway !== 'manual' && !isGatewayLive(gateway)) {
    const err = new Error(
      `${gateway} is not connected yet. Add its API credentials to your environment variables ` +
      `and register it in server/services/paymentService.js before clients can pay through it. ` +
      `For now, payments are recorded as pending and an admin confirms them manually.`
    );
    err.statusCode = 501; // Not Implemented — accurate, not a generic 400/500
    throw err;
  }
}

module.exports = { SUPPORTED_GATEWAYS, LIVE_GATEWAYS, isGatewayLive, assertGatewaySupported };

/**
 * SRT Royal — centralized revenue-split rule.
 *
 * This is the ONLY place the developer/platform split percentages are defined.
 * Every part of the backend that needs to calculate money must import
 * calculateRevenueSplit() from here instead of hard-coding a percentage.
 *
 * Nothing on the frontend can influence this calculation — it only ever
 * runs on the server, against a gross amount the server itself derived
 * (see paymentRoutes.js, which pulls the amount from the project record,
 * never from the request body).
 */

const DEVELOPER_SHARE_PERCENT = 50;
const PLATFORM_SHARE_PERCENT = 100 - DEVELOPER_SHARE_PERCENT;

/**
 * @param {number} grossAmount - total amount the client is paying, in the smallest
 *   sane currency unit you're already using elsewhere in this codebase (this
 *   project stores plain decimal amounts, e.g. 100 = ৳100).
 * @param {number} paymentFeeAmount - gateway processing fee already deducted
 *   from the gross amount, if known. Defaults to 0 (no gateway wired up yet).
 * @returns {{ grossAmount:number, paymentFee:number, netAmount:number, developerShare:number, platformShare:number }}
 */
function calculateRevenueSplit(grossAmount, paymentFeeAmount = 0) {
  const gross = Math.round(Number(grossAmount) * 100) / 100;
  const fee = Math.round(Number(paymentFeeAmount || 0) * 100) / 100;
  if (!Number.isFinite(gross) || gross <= 0) {
    throw new Error('grossAmount must be a positive number.');
  }
  if (!Number.isFinite(fee) || fee < 0 || fee > gross) {
    throw new Error('paymentFeeAmount must be a non-negative number no larger than the gross amount.');
  }

  const net = Math.round((gross - fee) * 100) / 100;
  const developerShare = Math.round(net * (DEVELOPER_SHARE_PERCENT / 100) * 100) / 100;
  const platformShare = Math.round((net - developerShare) * 100) / 100; // remainder, so the two always sum to netAmount exactly

  return {
    grossAmount: gross,
    paymentFee: fee,
    netAmount: net,
    developerShare,
    platformShare,
  };
}

module.exports = { DEVELOPER_SHARE_PERCENT, PLATFORM_SHARE_PERCENT, calculateRevenueSplit };

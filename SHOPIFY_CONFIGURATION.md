# Shopify Configuration Guide

This document outlines required Shopify admin configurations to resolve common e-commerce issues.

## Shipping Methods Configuration

### Problem
Both "Economy" and "Standard" shipping methods show the same delivery time ("Next Business Day"), giving customers no reason to choose the more expensive option.

### Solution
Configure distinct shipping methods with different delivery times in your Shopify Admin Dashboard:

1. **Login to Shopify Admin**
   - Go to your Shopify admin: `https://eonlife-2.myshopify.com/admin`
   - Navigate to: **Settings → Shipping and delivery**

2. **Review Shipping Zones**
   - Click on your shipping zone (e.g., "United States")
   - Review existing shipping rates

3. **Update Shipping Rate Definitions**

   **Option A: Different Delivery Times**
   - **Economy Shipping**: 3-5 Business Days, $X.XX
   - **Standard Shipping**: 1-2 Business Days, $Y.YY
   - **Express Shipping**: Next Business Day, $Z.ZZ

   **Option B: Consolidate to Single Method**
   - Remove duplicate methods
   - Keep only one "Standard Shipping" with clear delivery expectations

   **Option C: Free Shipping Tier**
   - Economy: $5.99 (5-7 business days)
   - Standard: $9.99 (3-5 business days)
   - Free Shipping: $0 (orders over $100, 5-7 business days)

4. **Update Rate Names and Prices**
   - Click "Edit" next to each shipping rate
   - Update the **Rate name** to reflect actual delivery time
   - Set appropriate **Price**
   - Set **Estimated delivery time** range

5. **Save Changes**
   - Click "Save" after editing each rate
   - Test checkout flow to verify changes

### Best Practices
- Make delivery times realistic and achievable
- Price faster shipping higher than slower options
- Consider offering free shipping threshold (already implemented in cart: free over $100)
- Clearly communicate delivery expectations to reduce support inquiries

---

## Tax Configuration

### Current Behavior
The Next.js cart shows an estimated 8.5% tax, but Shopify recalculates the actual tax based on the customer's shipping address during checkout.

### Expected Behavior
This is working as intended. Tax rates vary by location, so Shopify calculates the exact amount only after the customer enters their address.

### What Was Changed in Code
- Updated cart display to show "Estimated Tax" instead of "Tax (8.5%)"
- Added disclaimer: "Final tax and shipping calculated at checkout based on your location"

### Shopify Tax Settings (Optional Review)
1. Go to **Settings → Taxes and duties**
2. Verify tax collection is enabled for your selling regions
3. Review tax registration numbers if applicable
4. Consider enabling Shopify Tax for automated tax calculations in all jurisdictions

---

## Checkout Branding (Header Navigation)

### Potential Issue
If customers see an "Eonlife" header on the Shopify checkout page that links to your Shopify store instead of your Next.js app, this is a Shopify checkout customization issue.

### Solution
1. Go to **Settings → Checkout**
2. Under **Checkout customization**, click "Customize"
3. In the checkout editor:
   - Remove or update header logo link
   - Configure logo to link back to your Next.js app (`https://your-nextjs-domain.com`)
   - Or remove the logo from checkout entirely for a cleaner flow

### Note
The Next.js app header has been updated to use proper client-side navigation (`Link` component), so clicking the logo on your main site stays within the Next.js app.

---

## Testing Checklist

After making Shopify configuration changes, test the following:

- [ ] Add product to cart
- [ ] Verify tax displays as "Estimated Tax" in cart sidebar
- [ ] Verify disclaimer about final calculation appears
- [ ] Click "Proceed to Checkout"
- [ ] Verify redirect to Shopify hosted checkout
- [ ] Enter shipping address
- [ ] Confirm tax recalculates based on location
- [ ] Review available shipping methods
- [ ] Verify each shipping method has distinct delivery time
- [ ] Verify shipping prices are different (if applicable)
- [ ] Complete test purchase using test credit card (number: 1)
- [ ] Verify cart persists if backing out of checkout
- [ ] Click header logo to confirm it navigates correctly

---

## Additional Resources

- [Shopify Shipping Documentation](https://help.shopify.com/en/manual/shipping)
- [Shopify Tax Documentation](https://help.shopify.com/en/manual/taxes)
- [Shopify Checkout Customization](https://help.shopify.com/en/manual/checkout-settings/customize-checkout)

---

**Last Updated:** 2026-02-07

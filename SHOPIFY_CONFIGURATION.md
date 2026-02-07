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

## Checkout Branding (Header Navigation) - CRITICAL FIX NEEDED

### Problem
Customers see "eonlife-dev" (or your store name) in the Shopify checkout header that links to your Shopify storefront (`https://eonlife-dev.myshopify.com`) instead of your Next.js app.

### Solution: Update Checkout Settings

1. **Login to Shopify Admin**
   - Go to: `https://eonlife-2.myshopify.com/admin`

2. **Navigate to Checkout Settings**
   - Go to **Settings → Checkout and accounts**
   - OR direct link: `https://admin.shopify.com/store/[your-store]/settings/checkout`

3. **Update Store Information**
   - Scroll to **Checkout** section
   - Find **Checkout language** and click "Manage checkout language"
   - OR go to **Settings → Branding** to update header

4. **Option A: Redirect Shopify Storefront to Next.js App (RECOMMENDED)**
   - Make the Shopify storefront (`eonlife-dev.myshopify.com`) redirect to your Next.js site
   - When customers click "eonlife-dev" in checkout header, they'll be redirected to `www.eonlifewellness.net/en`
   - Steps:
     1. Login to Shopify Admin: `https://eonlife-2.myshopify.com/admin`
     2. Go to **Sales channels → Online Store → Themes**
     3. Click **•••** (three dots) on your current theme → **Edit code**
     4. In the **Layout** folder, click `theme.liquid`
     5. Find the opening `<head>` tag (near the top)
     6. Add this code right after `<head>`:
     ```html
     {% unless template contains 'checkout' or template contains 'cart' or template contains 'order' %}
       <script>
         window.location.href = 'https://www.eonlifewellness.net/en';
       </script>
     {% endunless %}
     ```
     7. Click **Save**
   - **What this does**: Redirects all storefront pages to your Next.js site, but keeps Shopify checkout working
   - **Pros**: Simple, free, solves the clickable header problem
   - **Cons**: Customers briefly see Shopify before redirect (~200ms)

5. **Option B: Remove Header Logo from Checkout**
   - Go to **Settings → Checkout and accounts** or **Settings → Branding**
   - Find the **Logo** section
   - Click **"Remove"** under the image
   - This removes the logo image (text link may still remain)

6. **Option C: Change Header Link Destination**
   - This requires Shopify Plus or checkout customization
   - Use Checkout Extensions to customize the header
   - Add custom HTML/CSS to override the default link behavior

7. **Option D: Use Custom Domain (ONLY works if DNS points to Shopify)**
   - Go to **Settings → Domains**
   - Add your custom domain (e.g., `eonlife.com`)
   - Set it as the primary domain
   - This makes the checkout header link to your custom domain instead of `.myshopify.com`
   - **CRITICAL LIMITATION:** This requires your domain's DNS to point to Shopify's servers, which will break your Next.js site on Vercel
   - **Not recommended if using headless architecture**

8. **Option E: Use Subdomain for Checkout**
   - Keep main domain pointing to Vercel: `www.eonlifewellness.net` → Next.js
   - Create subdomain for checkout: `shop.eonlifewellness.net` → Shopify
   - Steps:
     1. In GoDaddy DNS, add CNAME record: `shop` → `shops.myshopify.com`
     2. In Shopify Settings → Domains, add `shop.eonlifewellness.net`
     3. Set it as primary domain for checkout
     4. Checkout header will now show "shop.eonlifewellness.net"
   - **Pros:** Keeps Next.js site working, professional checkout branding
   - **Cons:** Subdomain visible in URL when user is checking out

### Best Practice: Custom Domain Setup
The best long-term solution is to:
1. Use a custom domain for your Shopify store
2. Configure DNS to point your domain to your Next.js app (Vercel)
3. Use Shopify's Buy Button or Storefront API for products (which you're already doing)
4. This way, the entire experience stays under your brand domain

### Limitations
- **Standard Shopify**: You cannot fully customize the checkout header link without Shopify Plus
- **Tax Display**: Shopify only shows tax after customer enters shipping address (cannot be changed)
- **Cart Editing**: Shopify checkout doesn't allow editing cart quantities (Shopify limitation)

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

## Known Shopify Checkout Limitations

These are **Shopify platform limitations** that cannot be changed via code:

### 1. Tax Not Displayed Until Address Entered
- **Why:** Shopify calculates tax based on exact shipping location
- **Cannot be changed:** This is required for legal compliance
- **What we did:** Added "Estimated Tax" in cart with disclaimer

### 2. No Cart Editing During Checkout
- **Why:** Shopify's hosted checkout doesn't support inline cart editing
- **Workaround Options:**
  - Add "Return to Cart" link in checkout (requires Shopify Plus or custom domain)
  - Users can use browser back button to return to cart
  - Consider Shopify Plus for custom checkout
- **What we did:** Cart now persists when users go back, so they can edit and re-checkout

### 3. Checkout Header Links to Shopify Store
- **Why:** Default Shopify checkout branding
- **Fix:** See "Checkout Branding" section above
- **Best solution:** Use custom domain or remove header from checkout

### Alternative: Build Custom Checkout (Advanced)
If you need full control over the checkout experience, you would need to:
1. Upgrade to **Shopify Plus** ($2,000/month minimum)
2. Use **Checkout Extensions** to customize the checkout
3. OR build a completely custom checkout using Shopify's Storefront API + Payment APIs
   - This is complex and requires handling payment processing, PCI compliance, etc.
   - Not recommended unless you have specific business requirements

## Additional Resources

- [Shopify Shipping Documentation](https://help.shopify.com/en/manual/shipping)
- [Shopify Tax Documentation](https://help.shopify.com/en/manual/taxes)
- [Shopify Checkout Customization](https://help.shopify.com/en/manual/checkout-settings/customize-checkout)
- [Shopify Checkout Extensions](https://shopify.dev/docs/apps/checkout) (Requires Shopify Plus)

---

**Last Updated:** 2026-02-07

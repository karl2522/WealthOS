# Manual Verification Checklist

**Test Date:** _________  
**Tester:** _________  
**Environment:** Development (Mock Prices)

---

## ✅ Pre-Test Setup

- [ ] Backend running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Database connection successful
- [ ] No console errors on startup

---

## 🧪 Test 1: User Registration & Onboarding

### 1.1 - Registration Flow
- [ ] Navigate to `http://localhost:3000`
- [ ] Click "Get Started" or "Register"
- [ ] Fill in registration form (email, password)
- [ ] Submit form
- [ ] **Expected:** Redirected to `/onboarding/step1`

**Notes:**
```
_______________________________________________________
```

### 1.2 - Onboarding Step 1: Create Portfolio
- [ ] See "Create Your Portfolio" heading
- [ ] Progress indicator shows Step 1 of 3 active
- [ ] Enter portfolio name: "Test Portfolio"
- [ ] Select currency: USD
- [ ] Select risk profile: "Balanced"
- [ ] Click "Continue to Goals"
- [ ] **Expected:** Redirected to `/onboarding/step2`

**Notes:**
```
_______________________________________________________
```

### 1.3 - Onboarding Step 2: Set Goal (Optional)
- [ ] See "Set Your Savings Goal" heading
- [ ] Progress indicator shows Step 2 of 3 active
- [ ] Select goal type: "Emergency Fund"
- [ ] Enter target amount: 10000
- [ ] Enter monthly contribution: 500
- [ ] Click "Continue to Assets"
- [ ] **Expected:** Redirected to `/onboarding/step3`

**Alternative Test (Skip Goal):**
- [ ] Click "Skip for Now"
- [ ] **Expected:** Redirected to `/onboarding/step3`

**Notes:**
```
_______________________________________________________
```

### 1.4 - Onboarding Step 3: Add First Asset
- [ ] See "Add Your First Asset" heading
- [ ] Progress indicator shows Step 3 of 3 active
- [ ] Select asset type: "Stock"
- [ ] Choose symbol: "NVDA" from dropdown
- [ ] Enter quantity: 5
- [ ] Enter avg price: 500
- [ ] Click "Complete Setup"
- [ ] **Expected:** Success toast appears
- [ ] **Expected:** Redirected to `/dashboard`

**Notes:**
```
_______________________________________________________
```

---

## 📊 Test 2: Dashboard Display

### 2.1 - Portfolio Summary Cards
- [ ] See 3 summary cards displayed
- [ ] **Card 1:** "Total Portfolio Value" shows ~$2,500 (5 × $500)
- [ ] **Card 2:** "Unrealized P/L" shows calculated value
- [ ] **Card 3:** "Total Assets" shows "1"
- [ ] Numbers formatted correctly ($2,500.00)

**Actual Values:**
```
Total Value: $_______
P/L: $_______
Asset Count: _______
```

### 2.2 - Holdings Table
- [ ] Table displays with headers (Symbol, Type, Quantity, etc.)
- [ ] NVDA row visible
- [ ] Symbol shows "NVDA"
- [ ] Type badge shows "STOCK" (green)
- [ ] Quantity shows "5"
- [ ] Avg Price shows "$500.00"
- [ ] Current Price populated (mock or real)
- [ ] Total Value calculated correctly
- [ ] P/L shows with badge (green if positive, red if negative)
- [ ] Delete button (trash icon) visible

**Notes:**
```
_______________________________________________________
```

### 2.3 - Asset Allocation Chart
- [ ] Pie chart displays
- [ ] Shows "Stocks" category at 100%
- [ ] Legend below chart matches
- [ ] Chart is responsive

**Notes:**
```
_______________________________________________________
```

---

## ➕ Test 3: Add Asset from Dashboard

### 3.1 - Open Add Asset Dialog
- [ ] Click "Add Asset" button in header
- [ ] Dialog/modal opens
- [ ] See "Add Asset" title
- [ ] Form has 3 tabs: ETF, Stock, Crypto

**Notes:**
```
_______________________________________________________
```

### 3.2 - Add ETF Asset
- [ ] Click "ETF" tab
- [ ] Select symbol: "VOO"
- [ ] Enter quantity: 10
- [ ] Enter avg price: 430
- [ ] Click "Add Asset"
- [ ] **Expected:** Success toast "Asset added!"
- [ ] **Expected:** Dialog closes
- [ ] **Expected:** Holdings table updates immediately
- [ ] **Expected:** VOO row appears
- [ ] **Expected:** Total value increases to ~$6,800

**Actual Results:**
```
Success: Yes / No
Toast appeared: Yes / No
Table updated: Yes / No
New total value: $_______
```

### 3.3 - Add Crypto Asset
- [ ] Click "Add Asset" again
- [ ] Click "Crypto" tab
- [ ] Select symbol: "BTC"
- [ ] Enter quantity: 0.1
- [ ] Leave avg price empty (test price fetching)
- [ ] Click "Add Asset"
- [ ] **Expected:** Success toast
- [ ] **Expected:** BTC appears in table
- [ ] **Expected:** Current price populated (mock or real)

**Notes:**
```
_______________________________________________________
```

---

## 🔄 Test 4: Duplicate Asset Handling (Upsert)

### 4.1 - Add Duplicate Asset
- [ ] Click "Add Asset"
- [ ] Select "Stock" tab
- [ ] Choose "NVDA" (same as onboarding)
- [ ] Enter quantity: 3
- [ ] Enter avg price: 520
- [ ] Click "Add Asset"
- [ ] **Expected:** Toast says "Asset updated!" (not "added")
- [ ] **Expected:** Only ONE NVDA row in table
- [ ] **Expected:** Quantity shows "8" (5 + 3)
- [ ] **Expected:** Avg price shows ~$507.50 (weighted average)

**Calculation Check:**
```
Formula: (5 × 500 + 3 × 520) / 8 = $507.50
Actual avg price shown: $_______
Correct: Yes / No
```

---

## 🗑️ Test 5: Delete Asset

### 5.1 - Delete an Asset
- [ ] Find BTC row in holdings table
- [ ] Click trash icon button
- [ ] **Expected:** Success toast "Asset removed"
- [ ] **Expected:** BTC row disappears
- [ ] **Expected:** Total value decreases
- [ ] **Expected:** Allocation chart updates

**Notes:**
```
_______________________________________________________
```

### 5.2 - Delete All Assets (Empty State)
- [ ] Delete NVDA
- [ ] Delete VOO
- [ ] **Expected:** Holdings table shows empty state
- [ ] **Expected:** Icon and message: "No assets yet"
- [ ] **Expected:** Allocation chart shows empty state
- [ ] **Expected:** Total portfolio value shows $0.00

**Notes:**
```
_______________________________________________________
```

---

## 📱 Test 6: Responsive Design (Mobile)

### 6.1 - Resize Browser to Mobile Width
- [ ] Resize browser to ~375px width (or use DevTools)
- [ ] Mobile navigation appears (bottom bar)
- [ ] Dashboard layout stacks vertically
- [ ] Cards are full width
- [ ] Table is scrollable horizontally
- [ ] "Add Asset" button text shows "Add" (short version)

**Notes:**
```
_______________________________________________________
```

### 6.2 - Test Onboarding on Mobile
- [ ] Register new user (or logout/clear data)
- [ ] Complete onboarding on mobile width
- [ ] All 3 steps work properly
- [ ] Progress bar visible and accurate
- [ ] Forms are usable
- [ ] Buttons are touch-friendly

**Notes:**
```
_______________________________________________________
```

---

## 🔐 Test 7: Protected Routes

### 7.1 - Unauthenticated Access
- [ ] Logout from app
- [ ] Attempt to navigate to `/dashboard`
- [ ] **Expected:** Redirected to `/login`

**Notes:**
```
_______________________________________________________
```

### 7.2 - Portfolio Check Redirect
- [ ] Login to account with NO portfolio
- [ ] Attempt to access `/dashboard`
- [ ] **Expected:** Redirected to `/onboarding/step1`

**Alternative:**
- [ ] Login to account WITH portfolio
- [ ] Attempt to access `/onboarding/step1`
- [ ] **Expected:** Can access (no redirect)

**Notes:**
```
_______________________________________________________
```

---

## 🧮 Test 8: Calculation Accuracy

### 8.1 - Manual Calculation Verification

**Setup:** Add these exact assets:
1. NVDA: 5 shares @ $500
2. VOO: 10 shares @ $430

**Expected Calculations:**
```
Total Value = (5 × $500) + (10 × $430)
            = $2,500 + $4,300
            = $6,800

Allocation:
- Stock (NVDA): $2,500 / $6,800 = 36.8%
- ETF (VOO): $4,300 / $6,800 = 63.2%
```

**Verify:**
- [ ] Total Portfolio Value: $6,800.00 ✓
- [ ] Stock percentage: ~36.8% ✓
- [ ] ETF percentage: ~63.2% ✓
- [ ] Percentages sum to 100% ✓

**Actual Values:**
```
Total: $_______
Stock %: _______
ETF %: _______
Sum: _______%
```

---

## 💾 Test 9: Data Persistence

### 9.1 - Refresh Page
- [ ] Add 2-3 assets
- [ ] Note total value
- [ ] Refresh page (F5)
- [ ] **Expected:** All data persists
- [ ] **Expected:** Assets still visible
- [ ] **Expected:** Values unchanged

**Notes:**
```
_______________________________________________________
```

### 9.2 - Logout and Login
- [ ] Logout from app
- [ ] Login again with same credentials
- [ ] Navigate to dashboard
- [ ] **Expected:** Portfolio data intact
- [ ] **Expected:** All assets present

**Notes:**
```
_______________________________________________________
```

---

## 🎨 Test 10: UI/UX Polish

### 10.1 - Loading States
- [ ] Hard refresh dashboard (Ctrl+F5)
- [ ] **Expected:** Skeleton loaders appear briefly
- [ ] **Expected:** Smooth transition to content

**Notes:**
```
_______________________________________________________
```

### 10.2 - Toast Notifications
- [ ] Test all actions that trigger toasts:
  - [ ] Add asset → Success toast
  - [ ] Update asset → "Asset updated" toast
  - [ ] Delete asset → "Asset removed" toast
  - [ ] Portfolio created → Success toast

**Notes:**
```
_______________________________________________________
```

### 10.3 - Form Validation
- [ ] Open Add Asset dialog
- [ ] Try to submit without selecting symbol
- [ ] **Expected:** Validation error appears
- [ ] Try to enter negative quantity
- [ ] **Expected:** Validation error or input rejected

**Notes:**
```
_______________________________________________________
```

---

## 🐛 Test 11: Error Handling

### 11.1 - Network Error Simulation
- [ ] Stop backend server
- [ ] Try to add asset
- [ ] **Expected:** Error toast appears
- [ ] **Expected:** App doesn't crash
- [ ] Restart backend
- [ ] Try again
- [ ] **Expected:** Works normally

**Notes:**
```
_______________________________________________________
```

---

## ✅ Final Checklist

### Critical Functionality
- [ ] User can register and onboard successfully
- [ ] User can create portfolio with all options
- [ ] User can add assets from dashboard
- [ ] Duplicate assets are merged (upsert works)
- [ ] Calculations are accurate
- [ ] Data persists across sessions
- [ ] Protected routes work correctly

### UI/UX Quality
- [ ] Loading states present and smooth
- [ ] Empty states guide users effectively
- [ ] Toast notifications informative
- [ ] Form validation works
- [ ] Mobile responsive design works
- [ ] No console errors during testing

### Data Integrity
- [ ] No duplicate asset rows in database
- [ ] Weighted average calculated correctly
- [ ] Portfolio currency respected
- [ ] Goal data saved properly

---

## 📝 Test Summary

**Total Tests Passed:** _____ / _____  
**Critical Issues Found:** _____  
**Minor Issues Found:** _____

**Overall Status:** 🟢 Pass / 🟡 Pass with Issues / 🔴 Fail

### Issues Discovered
```
1. _______________________________________________________

2. _______________________________________________________

3. _______________________________________________________
```

### Recommendations
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 🎯 Sign-off

✅ System verified and ready for production

**Tested by:** _______________  
**Date:** _______________  
**Time spent:** _______________ mins

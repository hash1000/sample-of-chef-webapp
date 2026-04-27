## AmricanFood – low‑fi wireframes (Customer / Chef / Admin)

This document maps your current app routes to simple, professional screen wireframes and UX guidelines.

### Global UI rules (keep it “top professional”)
- **Single navigation per role**: customer uses `Navbar`; chef/admin use left sidebar + topbar.
- **One primary action per screen** (red `Primary` button), everything else secondary.
- **Consistent surfaces**: light page background, white cards, soft shadow, border `#E5E7EB`.
- **Consistent copy**: use one brand name everywhere (“AmricanFood”).

---

## Customer (public)

### `/home` – Restaurants + Location
Purpose: choose location, browse, search.

Layout:
- Header (sticky)
  - Brand (left)
  - Nav: Home, Cart (desktop)
  - Account + Logout (right when logged in)
- Main
  - Hero card
    - Title: “Restaurants in {City}”
    - Subtitle: short helper text
    - Controls row: City select, Search, Category
  - Section: Featured (3 cards)
  - Section: All restaurants grid
- Modal (blocking): Select City
  - Title + explanation
  - City list buttons

Wireframe:
```
[Navbar______________________________________________]

[HeroCard:RestaurantsInCity__________________________]
 CitySelect | SearchInput | CategoryInput

[Featured___________________________________________]
 [Card] [Card] [Card]

[AllRestaurants_____________________________________]
 [Card] [Card] [Card]
 [Card] [Card] [Card]

[CityModal(onlyIfNoCity)____________________________]
 SelectYourCity
 [Islamabad]
 [Karachi]
 [Lahore]
```

### `/restaurant/:id` – Restaurant + Menu
Purpose: see restaurant info, add items.

Layout:
- Restaurant header card
  - Name + description/menu type
  - Primary CTA: “Cart (N)”
- Menu sections
  - Category title
  - Item cards (name/desc/price + Add to cart)

Wireframe:
```
[Navbar______________________________________________]
[RestaurantHeader__________________________][CartCTA]

[Category:Pizza_____________________________________]
 [ItemCard(Add)] [ItemCard(Add)]
[Category:Burgers___________________________________]
 [ItemCard(Add)] [ItemCard(Add)]
```

### `/cart` – Cart review
Purpose: quantity control + checkout.

Layout (desktop):
- Left: cart items list
- Right: summary card (subtotal/delivery/total) + Checkout CTA

Wireframe:
```
[Navbar______________________________________________]
 [YourCart_____________________________][Summary____]
 [CartItem qty +/- remove]              Subtotal
 [CartItem qty +/- remove]              Delivery
                                       Total
                                       [Checkout]
```

### `/checkout` – Delivery details + payment
Purpose: collect delivery info, redirect to Stripe.

Layout:
- Left: form card (name/phone/email/address)
- Right: order summary + “Pay with Stripe”
- Error banner inline if stripe canceled / request failed

Wireframe:
```
[Navbar______________________________________________]
 [DeliveryForm__________________________][Summary____]
 FullName  Phone
 Email
 Address
 [ErrorIfAny]
                                      Items...
                                      Total
                                      [PayWithStripe]
```

### `/orders/:id` – Order tracking
Purpose: show payment status + progress.

Layout:
- Header card (order id, restaurant, customer, payment)
- Status tracker (5 steps)
- Items card + totals

Wireframe:
```
[Navbar______________________________________________]
[OrderHeader________________________________________]
 Order#  Restaurant
 CustomerInfo
 PaymentStatus
 [StatusSteps: Pending->Accepted->Preparing->Ready->Delivered]

[Items______________________________________________]
 item x qty .... line total
 Total
```

### Auth / onboarding

#### `/login`
Purpose: sign in and redirect by role.

Wireframe:
```
[Card]
 Login
 Email
 Password
 [Login]
 CreateAccount | RegisterRestaurant
```

#### `/signup`
Purpose: create customer account.

Wireframe:
```
[Card]
 CreateAccount
 Name
 Email
 Password
 [SignUp]
 BackToLogin | RegisterRestaurant
```

#### `/register-restaurant`
Purpose: create chef account + restaurant request (pending approval).

Wireframe:
```
[Card]
 RegisterRestaurant
 OwnerName | Email
 Password
 RestaurantName | City
 MenuType
 Description
 [SubmitForApproval]
 BackToLogin
```

---

## Chef (role = chef)

Global shell:
- Left sidebar: Dashboard, Restaurant, Orders, Menu
- Topbar: title, role pill, user email, right-side actions

### `/chef-dashboard`
Purpose: fast overview + jump into orders.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [KPI Total] [KPI Active] [KPI Completed] [KPI Today]
 [RecentOrdersTable_________________________________]
```

### `/chef/restaurant`
Purpose: show approval status + edit profile.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [StatusCard] [RatingCard] [ActiveCard] [CityCard]
 [NoticeIfNotApproved]
 [ProfileForm______________________________________]
 Name | City
 MenuType
 Description
 [SaveProfile]
```

### `/chef/orders`
Purpose: triage and update status quickly.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 Tabs: [New] [Preparing] [Completed]    [Refresh]
 [OrdersTable__________________________ Actions_____]
 Order | Customer | Items | Status | Time | Buttons
```

### `/chef/orders/:id`
Purpose: see items + totals + update state.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [OrderInfoCard_____________][ActionsCard___________]
 [ItemsTable_______________________________________]
 [TotalsCard_______________________________________]
```

### `/chef/menu`
Purpose: CRUD menu items.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 Search | Count                               [AddItem]
 [Add/EditFormCard(whenOpen)_______________________]
 [MenuTable_______________________________________]
 Name | Category | Price | Availability | Actions
```

---

## Admin (role = admin)

Global shell:
- Left sidebar: Dashboard, Users, Restaurants, Orders, Roles, Payments, Reports
- Topbar: title, role pill, user email, right-side actions

### `/admin-dashboard`
Purpose: overall KPIs + recent orders.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [KPI Users] [KPI Restaurants] [KPI Active] [KPI Pending]
 [KPI Orders] [KPI Revenue]
 [RecentOrdersTable_________________________________]
```

### `/restaurants`
Purpose: approve/reject/block + edit restaurant data.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 Badges: Total | Pending                     [AddRestaurant]
 [Create/EditFormCard(whenOpen)____________________]
 [RestaurantsTable__________________________Actions]
 Edit | Approve | Reject | Block/Unblock
```

### `/users`
Purpose: search + user actions.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 SearchInput | Count                         [Refresh]
 [UsersTable_______________________________________]
 View | Block/Unblock | Delete
```

### `/orders`
Purpose: monitor lifecycle and payment state.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 StatusSelect | Count                         [Refresh]
 [OrdersTable______________________________________]
```

### `/roles`
Purpose: quick RBAC editor (local storage currently).

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [CreateRoleCard___________][GrantPermissionsCard__]
 [RolesTable_______________________________________]
```

### `/payments`
Purpose: transactions list.

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [PaymentsTable____________________________________]
```

### `/reports`
Purpose: future analytics hub (placeholders today).

Wireframe:
```
[Sidebar][Topbar____________________________________]
 [SalesCard] [OperationsCard]
```

---

## Pro + simple improvements (prioritized checklist)

### P0 (big impact, low effort)
- **Unify customer layout**: all customer pages should use one layout with `Navbar` (done).
- **Global UI tokens**: use the same buttons/inputs/cards everywhere (in progress via `ui.css` + Tailwind brand colors).
- **Fix broken nav link**: remove `/restaurants` route link from customer nav (done).
- **Standardize auth input styling**: no special one-off Tailwind input classes (done).

### P1 (professional polish)
- **Brand consistency**: pick one name (recommend “AmricanFood”) and use it in Navbar, admin/chef shells, and titles.
- **Replace technical error copy** (customer-facing): show friendly error with “Try again” and “Go back” CTAs.
- **Add a cart badge** in navbar (shows item count) for quick feedback.

### P2 (complete product feel)
- Customer: **Order history** (`/orders`), Profile (`/me`), Saved addresses
- Chef: Store hours, Payouts, bulk availability editor
- Admin: Restaurant detail screen (audit trail), support inbox


// src/data/documentationContent.tsx
import { DocumentationContent } from "@/types/documentation";

// ================================
// Documentation Content
// ================================
export const documentationContent: Record<string, DocumentationContent> = {
  // ----------------
  // CATEGORY: Getting Started
  // ----------------
  "getting-started": {
    id: "getting-started",
    title: "Getting Started",
    type: "category",
    children: ["creating-account", "first-order", "understanding-services"],
  },

  // Article 1
  "creating-account": {
    id: "creating-account",
    title: "Creating Your Account",
    categoryId: "getting-started",
    type: "article",
    views: 1250,
    content: (
      <div className="space-y-4 text-sm">
        <p>
          <strong>Step 1 — Visit the Signup Page</strong>
          <br />
          Go to the homepage and click the <strong>Sign Up</strong> button at
          the top-right corner.
        </p>

        <p>
          <strong>Step 2 — Enter Your Information</strong>
          <br />
          Fill in the registration form with:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>Full Name</strong> — Your real name.
          </li>
          <li>
            <strong>Email Address</strong> — A valid email you can access.
          </li>
          <li>
            <strong>Password</strong> — At least 8 characters; mix letters,
            numbers and symbols.
          </li>
        </ul>

        <p>
          <strong>Step 3 — Confirm Your Email</strong>
          <br />
          After submitting the form you will receive a verification email. Open
          the email and click the verification link. If you don't see it, check
          spam/junk.
        </p>

        <p>
          <strong>Step 4 — Log In</strong>
          <br />
          After verifying, return to the login page and sign in with your email
          and password.
        </p>

        <p>
          <strong>Step 5 — Set Up Profile (optional but recommended)</strong>
          <br />
          Add a profile picture, update contact details, and enable Two-Factor
          Authentication (2FA) for extra security.
        </p>

        <p className="font-semibold text-green-600">
          ✅ That's it — your account is ready!
        </p>
      </div>
    ),
  },

  // Article 2
  "first-order": {
    id: "first-order",
    title: "First Order Guide",
    categoryId: "getting-started",
    type: "article",
    views: 890,
    content: (
      <div className="space-y-4 text-sm">
        <p>
          <strong>Step 1 — Navigate to the Orders Page</strong>
          <br />
          After logging in, click on <strong>Orders</strong> in the main menu.
        </p>

        <p>
          <strong>Step 2 — Select a Category</strong>
          <br />
          Choose a service category (e.g. Instagram, YouTube, Website Traffic).
        </p>

        <p>
          <strong>Step 3 — Pick a Service</strong>
          <br />
          Browse the available services, check their descriptions and
          minimum/maximum order limits, then select the one that matches your
          needs.
        </p>

        <p>
          <strong>Step 4 — Enter Your Details</strong>
          <br />
          Provide the required input (e.g. link to your post, username, or
          website). Double-check this information because it can’t be changed
          after submission.
        </p>

        <p>
          <strong>Step 5 — Set the Quantity</strong>
          <br />
          Enter the number of units you want to order. The system will calculate
          the cost automatically.
        </p>

        <p>
          <strong>Step 6 — Place the Order</strong>
          <br />
          Click <strong>Submit</strong>. Your order will be added to the system,
          and you can track its progress from the <em>My Orders</em> page.
        </p>

        <p className="font-semibold text-green-600">
          🎉 Congratulations! You’ve placed your first order successfully.
        </p>
      </div>
    ),
  },

  // Article 3
  "understanding-services": {
    id: "understanding-services",
    title: "Understanding Services",
    categoryId: "getting-started",
    type: "article",
    views: 720,
    content: (
      <div className="space-y-4 text-sm">
        <p>
          Our platform offers a wide variety of services. Each service is
          grouped under a<strong> category</strong> (e.g. Instagram, YouTube,
          SEO). Inside a category, you’ll find specific services with unique
          requirements and pricing.
        </p>

        <p>
          <strong>Service Description</strong>
          <br />
          Every service has a short explanation of what it does (e.g. “Instagram
          Followers — Real accounts, gradual delivery”).
        </p>

        <p>
          <strong>Minimum & Maximum Quantity</strong>
          <br />
          Each service has order limits. Example: Min 100, Max 10,000. Your
          order must fall within this range.
        </p>

        <p>
          <strong>Pricing</strong>
          <br />
          The cost per unit is shown in the service description. The final price
          is calculated automatically when you enter your desired quantity.
        </p>

        <p>
          <strong>Order Speed</strong>
          <br />
          Some services start instantly, while others may take time. The service
          description usually mentions delivery speed.
        </p>

        <p>
          <strong>Special Notes</strong>
          <br />
          Some services have specific requirements (e.g. account must be
          public). Always read the notes carefully before placing your order.
        </p>

        <p className="font-semibold text-blue-600">
          💡 Tip: Always test a service with a smaller order first to see how it
          performs before scaling up.
        </p>
      </div>
    ),
  },

  // ----------------
  // CATEGORY: Orders & Services
  // ----------------
  "orders-services": {
    id: "orders-services",
    title: "Orders & Services",
    type: "category",
    children: [
      "placing-orders",
      "order-status",
      "flow-boost",
      "refund-policy",
      "tracking-orders",
      "canceling-orders",
    ],
  },

  // Article 1
  "placing-orders": {
    id: "placing-orders",
    title: "How to Place an Order",
    categoryId: "orders-services",
    type: "article",
    views: 2100,
    content: (
      <div>
        <p>
          To place an order, go to <strong>New Order</strong> page, select your
          service, enter the details, and confirm. Make sure you have sufficient
          balance in your wallet before placing an order.
        </p>
      </div>
    ),
  },

  // Article 2
  "order-status": {
    id: "order-status",
    title: "Order Status Explained",
    categoryId: "orders-services",
    type: "article",
    views: 1580,
    content: (
      <div>
        <p>
          Order statuses help you track progress:
          <br />
          <strong>Pending</strong> — Waiting to be processed.
          <br />
          <strong>Processing</strong> — Actively being delivered.
          <br />
          <strong>Completed</strong> — Successfully delivered.
          <br />
          <strong>Partial</strong> — Partially completed, refund issued for the
          rest.
          <br />
          <strong>Cancelled</strong> — Order canceled and refunded.
        </p>
      </div>
    ),
  },

  // Article 3
  "flow-boost": {
    id: "flow-boost",
    title: "Flow Boost Feature",
    categoryId: "orders-services",
    type: "video",
    views: 945,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Watch this short video tutorial to learn how to place your first
          order.
        </p>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="How to Place an Order"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },

  // Article 4
  "tracking-orders": {
    id: "tracking-orders",
    title: "Tracking Your Orders",
    categoryId: "orders-services",
    type: "article",
    views: 400,
    content: (
      <div>
        <p>
          You can track all your orders from the <strong>Orders</strong> page in
          your dashboard. Each order displays progress percentage, start count,
          and estimated completion time.
        </p>
      </div>
    ),
  },

  // ----------------
  // CATEGORY: Payments & Billing
  // ----------------

  "payments-billing": {
    id: "payments-billing",
    title: "Payments & Billing",
    type: "category" as const,
    children: [
      "funding-wallet",
      "payment-methods",
      "billing-history-video",
      "payment-issues",
    ],
  },

  // Article 1
  "funding-wallet": {
    id: "funding-wallet",
    title: "Tracking Your Orders",
    categoryId: "payments-billing",
    type: "article",
    views: 400,
    content: (
      <div className="space-y-4">
        <p>
          To use our platform, you’ll first need to add funds to your wallet.
          This ensures quick and seamless order processing.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Log in to your account and navigate to the Wallet section.</li>
          <li>
            Click <strong>“Add Funds”</strong>.
          </li>
          <li>
            Select a payment method (e.g., card, bank transfer, mobile money).
          </li>
          <li>Enter the amount you wish to deposit.</li>
          <li>
            Confirm the transaction and wait for it to reflect in your wallet
            balance.
          </li>
        </ol>
        <p className="text-muted-foreground">
          Tip: Always keep a minimum balance in your wallet to avoid delays.
        </p>
      </div>
    ),
  },

  // Article 2
  "payment-methods": {
    id: "payment-methods",
    title: "Available Payment Methods",
    categoryId: "payments-billing",
    type: "article",
    views: 400,
    content: (
      <div className="space-y-4">
        <p>
          We support multiple payment methods to make it convenient for users
          worldwide. Currently, you can pay through:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Credit/Debit Cards (Visa, MasterCard)</li>
          <li>Bank Transfer</li>
          <li>Mobile Money (selected regions)</li>
          <li>Cryptocurrency (BTC, USDT)</li>
        </ul>
        <p className="text-muted-foreground">
          Note: The availability of payment methods may vary depending on your
          location.
        </p>
      </div>
    ),
  },

  // Article 3
  "billing-history-video": {
    id: "billing-history-video",
    title: "Checking Your Billing History (Video)",
    categoryId: "payments-billing",
    type: "video",
    views: 150,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          This video will guide you through accessing and understanding your
          billing history.
        </p>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Billing History Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ),
  },

  // Article 4
  "payment-issues": {
    id: "payment-issues",
    title: "Resolving Payment Issues",
    categoryId: "payments-billing",
    type: "article",
    views: 175,
    content: (
      <div className="space-y-4">
        <p>
          Sometimes payments may fail or not reflect immediately in your wallet.
          Here are common issues and how to resolve them:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Transaction Pending:</strong> Bank or mobile money transfers
            may take a few minutes to process. Please wait and refresh your
            wallet balance.
          </li>
          <li>
            <strong>Payment Failed:</strong> Ensure you have sufficient funds
            and your card or mobile money account is active.
          </li>
          <li>
            <strong>Incorrect Reference:</strong> If using bank transfer, make
            sure you entered the correct reference number. Missing references
            can delay the crediting process.
          </li>
          <li>
            <strong>Double Charge:</strong> If you are charged twice, contact
            support with your transaction ID. A refund will be processed back to
            your wallet.
          </li>
        </ul>
        <p className="text-muted-foreground">
          If your payment issue persists after 24 hours, please contact our{" "}
          <strong>Support Team</strong> with proof of payment for further
          assistance.
        </p>
      </div>
    ),
  },

  // ----------------
  // CATEGORY: Account Management
  // ----------------
  // ================================
  // CATEGORY: Account Management
  // ================================
  "account-management": {
    id: "account-management",
    title: "Account Management",
    type: "category" as const,
    children: [
      "updating-profile",
      "changing-password",
      "two-factor-authentication",
      "deleting-account",
    ],
  },

  // Article 1
  "updating-profile": {
    id: "updating-profile",
    title: "Updating Your Profile",
    categoryId: "account-management",
    type: "article",
    views: 420,
    content: (
      <div className="space-y-4">
        <p>
          Keeping your profile up to date ensures that you receive important
          notifications and improves account security.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to the <strong>Account Settings</strong> page in your dashboard.
          </li>
          <li>
            Click <strong>Edit Profile</strong>.
          </li>
          <li>
            Update your details such as name, phone number, and email address.
          </li>
          <li>
            Click <strong>Save</strong> to confirm your changes.
          </li>
        </ol>
        <p className="text-muted-foreground">
          💡 Tip: Use a real phone number and email to recover your account
          easily if you forget your password.
        </p>
      </div>
    ),
  },

  // Article 2
  "changing-password": {
    id: "changing-password",
    title: "Changing Your Password",
    categoryId: "account-management",
    type: "article",
    views: 600,
    content: (
      <div className="space-y-4">
        <p>
          For your account security, we recommend changing your password every
          few months.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to <strong>Account Settings</strong>.
          </li>
          <li>
            Click on <strong>Change Password</strong>.
          </li>
          <li>Enter your current password, then your new password twice.</li>
          <li>
            Click <strong>Save</strong> to update it.
          </li>
        </ol>
        <p className="text-muted-foreground">
          ✅ Use a password that’s at least 8 characters long, with numbers and
          symbols.
        </p>
      </div>
    ),
  },

  // Article 3
  "two-factor-authentication": {
    id: "two-factor-authentication",
    title: "Enabling Two-Factor Authentication (2FA)",
    categoryId: "account-management",
    type: "article",
    views: 350,
    content: (
      <div className="space-y-4">
        <p>
          Two-Factor Authentication (2FA) adds an extra layer of security by
          requiring both your password and a verification code.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Navigate to <strong>Security Settings</strong> in your account.
          </li>
          <li>
            Click <strong>Enable 2FA</strong>.
          </li>
          <li>Scan the QR code using Google Authenticator or Authy.</li>
          <li>Enter the 6-digit code from your app to confirm.</li>
        </ol>
        <p className="text-muted-foreground">
          🔒 Once enabled, you will need your authenticator app each time you
          log in.
        </p>
      </div>
    ),
  },

  // Article 4
  "deleting-account": {
    id: "deleting-account",
    title: "Deleting Your Account",
    categoryId: "account-management",
    type: "article",
    views: 210,
    content: (
      <div className="space-y-4">
        <p>
          If you no longer wish to use our services, you can permanently delete
          your account. Please note that this action is irreversible.
        </p>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            Go to <strong>Account Settings</strong>.
          </li>
          <li>
            Scroll down and click <strong>Delete Account</strong>.
          </li>
          <li>Confirm your password for security verification.</li>
          <li>
            Click <strong>Confirm Delete</strong> to finalize the process.
          </li>
        </ol>
        <p className="text-red-600 font-medium">
          ⚠️ Warning: All your data, orders, and wallet balance will be
          permanently deleted.
        </p>
      </div>
    ),
  },
};

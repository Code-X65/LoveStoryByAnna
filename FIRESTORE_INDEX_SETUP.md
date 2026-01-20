# Firestore Index Setup Instructions

## Problem
Reviews approved in the admin dashboard are not showing on the product details page because Firestore requires a composite index for the query.

## Solution

### Option 1: Deploy via Firebase CLI (Recommended)
1. Make sure you have Firebase CLI installed: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firestore (if not already done): `firebase init firestore`
4. Deploy the indexes: `firebase deploy --only firestore:indexes`

### Option 2: Create Index via Console Link
When you run the app and open a product details page, check the browser console. You should see an error message with a link like:

```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

Click that link to automatically create the required index in the Firebase Console.

### Option 3: Manual Creation in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `lovestorybyanna-80609`
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure the index:
   - **Collection ID**: `reviews`
   - **Fields to index**:
     - `productId` (Ascending)
     - `status` (Ascending)
     - `createdAt` (Descending)
   - **Query scope**: Collection
6. Click **Create**

## Verification
After creating the index (it may take a few minutes to build):
1. Refresh the product details page
2. Approved reviews should now appear in the review section
3. Check the browser console to ensure there are no more index-related errors

## Index File
The `firestore.indexes.json` file has been created in the project root for automated deployment.

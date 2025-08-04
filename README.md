# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Auth0 Configuration

This project uses Auth0 for authentication. Follow these steps to set up Auth0 for a new application:

### 1. Create Auth0 Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Create Application**
3. **Name**: Enter your app name (e.g., "RDK CRM")
4. **Application Type**: **Select "Single Page Application"** ⚠️ **CRITICAL**
5. Click **Create**

### 2. Configure Application Settings
In your Auth0 application settings:

**Allowed Callback URLs:**
```
http://localhost:3000
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

### 3. Create Auth0 API (if needed)
1. Go to **APIs** → **Create API**
2. **Name**: Your API name (e.g., "RDK CRM API")
3. **Identifier**: Your API identifier (e.g., `https://rdk-crm.api`)
4. **Signing Algorithm**: RS256
5. Click **Create**

### 4. Environment Variables
Create a `.env.local` file in the project root with:

```env
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-identifier
```

### 5. Common Issues & Solutions

**❌ "Unauthorized" error on token request:**
- Ensure **Application Type** is set to "Single Page Application"
- Verify the audience matches your API identifier exactly
- Check that your API is properly configured in Auth0

**❌ "Callback URL mismatch" error:**
- Add your exact callback URL to Auth0 settings
- Include the correct port number (e.g., `http://localhost:3000`)

**❌ Environment variables undefined:**
- Ensure `.env.local` file is in the project root
- Restart the development server after adding environment variables
- Check file encoding (should be UTF-8)

### 6. Development Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



# Auth Setup


# Auth0 Configuration and Integration for RDK CRM

This guide documents the complete process for configuring Auth0 and integrating it with the RDK CRM front-end (React) and back-end (.NET Core Web API) applications.

### Prerequisites

* An Auth0 account (a free tier is sufficient for this guide)

* Node.js and npm installed for the React front-end

* .NET Core SDK installed for the .NET back-end

### Step 1: Auth0 Dashboard Configuration

This is the most critical step. We will configure both a Client Application (for the React front-end) and an API (for the .NET Core back-end).

#### 1.1 Create the API (Backend)

1. Log in to your Auth0 Dashboard.

2. Navigate to **Applications > APIs**.

3. Click the **`+ Create API`** button.

4. **Name:** `RDK CRM API`

5. **Identifier:** `https://rdk.crm.api` (This is your API's unique audience. Use this exact value in your app settings).

6. **Signing Algorithm:** `RS256` (This is the default and recommended setting).

7. Click **Create**.

#### 1.2 Enable RBAC for the API

1. On the new API's page, go to the **Access Settings** tab.

2. Enable the **`Enable RBAC`** toggle.

3. Enable the **`Add Permissions in the Access Token`** toggle.

4. Click **Save**.

#### 1.3 Add Permissions to the API

1. On the same API page, go to the **Permissions** tab.

2. Add the following permissions:

   * `read:contacts`

   * `read:reports`

   * `create:contacts`

   * `delete:contacts`

#### 1.4 Create the Client Application (Frontend)

1. Go to **Applications > Applications**.

2. Click the **`+ Create Application`** button.

3. **Name:** `RDK CRM React Client`

4. **Application Type:** `Single Page Application`.

5. Click **Create**.

#### 1.5 Configure the Client Application

1. On the new application's page, go to the **Settings** tab.

2. **Allowed Callback URLs:** `http://localhost:3000` (Use this exact URL).

3. **Allowed Logout URLs:** `http://localhost:3000`

4. **Allowed Web Origins:** `http://localhost:3000`

5. **Application Type:** Confirm this is set to `Single Page Application`.

6. Click **Save Changes**.

#### 1.6 Create a Role and Assign Permissions

1. Go to **User Management > Roles**.

2. Click **`+ Create Role`**.

3. **Name:** `Admin`

4. Click **Create**.

5. On the new `Admin` role's page, go to the **Permissions** tab.

6. Click **`+ Add Permissions`**.

7. Select your `RDK CRM API` from the dropdown.

8. Select all the permissions you defined earlier and click **Add Permissions**.

#### 1.7 Add an Auth0 Action to Add Permissions to the Token

 1. Go to **Actions > Library**.

 2. Click **Custom**, then **`+ Create Action`**.

 3. **Name:** `Add Permissions to Token`

 4. **Trigger:** `Login / Post Login`

 5. Click **Create**.

 6. Replace the default code with the following:

    ```
    exports.onExecutePostLogin = async (event, api) => {
      const namespace = "[http://schemas.microsoft.com/ws/2008/06/identity/claims/role](http://schemas.microsoft.com/ws/2008/06/identity/claims/role)";
    
      if (event.authorization) {
        api.accessToken.setCustomClaim(namespace, event.authorization.roles);
        const permissions = event.authorization.permissions.reduce((acc, role) => {
          const rolePermissions = event.authorization.permissions.filter(p => p.roles.includes(role)).map(p => p.permission_name);
          return acc.concat(rolePermissions);
        }, []);
        api.accessToken.setCustomClaim("permissions", permissions);
      }
    };
    
    ```

 7. Click **Save** and then **Deploy**.

 8. Go to **Actions > Flows**.

 9. Select the **Login** flow.

10. Drag your `Add Permissions to Token` Action from the right-hand panel into the flow and click **Apply**.

#### 1.8 Add a Google User and Assign the Role

1. Go to **User Management > Users**.

2. Click **`+ Create User`**. Enter an email and password.

3. Click the user's name, go to the **Roles** tab, and assign them the `Admin` role.

### Step 2: .NET Core API Setup (`RdkCrmApi`)

#### 2.1 Update `appsettings.json`

Update this file with the correct values from your Auth0 API.
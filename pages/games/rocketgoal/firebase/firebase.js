var configDict;
var hasFetchedConfig;
var gameInstance;
var tokenRefreshInterval;
var tokenRefreshLastTime = null;
var pendingConflictCredential = null; // Store credential for conflict resolution
var pendingEmailPasswordCredentials = null; // Store email/password separately for conflicts
var authReady = null;
const firestoreListeners = {};
let firestoreCallbackId = 0;

function initializeFirebase(unityInstance){
    console.log("Starting firebase initialization");
    
	gameInstance = unityInstance;
	const firebaseConfig = {
	  apiKey: "AIzaSyCV0DTWtAUgMRA6nvz2CZjTZfDXEyPAF-8",
	  authDomain: "rocketball-23c12.firebaseapp.com",
	  projectId: "rocketball-23c12",
	  storageBucket: "rocketball-23c12.firebasestorage.app",
	  messagingSenderId: "263108080315",
	  appId: "1:263108080315:web:6e010294b1c6ed3ff42f9e",
	  measurementId: "G-ZN6YDCFCY8"
	};
	
	const app = firebase.initializeApp(firebaseConfig);

    console.log("Initialized firebase app");
    
	initalizeConfig();
	
	authReady = new Promise(resolve => {
		firebase.auth().onAuthStateChanged(user => {
			resolve(); // resolves the first time ONLY
		});
	});
	
	// Set up auth state change listener
	firebase.auth().onAuthStateChanged(user => {
	    if (user) {
	        // Set up token refresh
	        setupTokenRefresh();
	    } else {
	        // Clear any existing refresh interval
	        if (tokenRefreshInterval) {
                console.log("onAuthStateChanged clearInterval");
	            //clearInterval(tokenRefreshInterval);
	            //tokenRefreshInterval = null;
	        }
	    }
	});
}

async function initalizeConfig(){
    console.log("Initializing firebase remote config");
    
	const remoteConfig = firebase.remoteConfig();
	remoteConfig.settings.minimumFetchIntervalMillis = 10 * 60 * 1000; // 10 minutes

    console.log("Starting firebase remote config fetch");

    while (!hasFetchedConfig) {
        try {
            await remoteConfig.fetchAndActivate();

            // detect stale configs
            const lastFetch = remoteConfig.fetchTimeMillis;
            const timeSinceLastFetch = Date.now() - lastFetch;
            if (timeSinceLastFetch <= remoteConfig.settings.minimumFetchIntervalMillis + 1000 * 60 * 2) {
                configDict = {};
                for (let [k,v] of Object.entries(remoteConfig.getAll())) {
                    configDict[k] = v.asString();
                }
                hasFetchedConfig = true;
                console.log("Succesfully fetched remote config: " + configDict);
            } else {
                console.error("Remote config is stale with status: " + remoteConfig.lastFetchStatus + ". (time since last succesful fetch: " + timeSinceLastFetch + " milliseconds), trying to fetch again");
            }
        } catch (error) {
            console.error("Error fetching remote config:");
            console.error(error);
        }
    }

    console.log("Finished firebase remote config fetch");
}

function isFirebaseInitialized(){
	return hasFetchedConfig;	
}

function getRemoteConfig(){
	return configDict;	
}

function sendGoogleAnalyticsEvent(eventName, parameters) {
    try {
        if (firebase.analytics) {
            firebase.analytics().logEvent(eventName, parameters);
            console.log('Analytics event sent:', eventName, parameters);
        } else {
            console.warn('Firebase Analytics not initialized');
        }
    } catch (error) {
        console.error('Error sending analytics event:', error);
    }
}

function setupTokenRefresh() {
    console.log("setupTokenRefresh");
    
    tokenRefreshLastTime = Date.now();
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
    }
    
    // Refresh token every 50 minutes
    tokenRefreshInterval = setInterval(() => {
        const now = Date.now();
            if (now - tokenRefreshLastTime >= 50 * 60 * 1000) {
                refreshIdToken();
                tokenRefreshLastTime = Date.now();
            }
    }, 1 * 60 * 1000); // Check every 1 minutes
}

// Function to refresh the ID token
async function refreshIdToken() {
    try {
        const auth = firebase.auth();
        if (auth.currentUser) {
            // Force token refresh
            const token = await auth.currentUser.getIdToken(true);
            console.log("Token refreshed successfully");
            
            // Notify Unity about the new token (matching mobile implementation)
            gameInstance.SendMessage('Firebase', 'OnTokenRefreshed', JSON.stringify({
                success: true,
                uid: auth.currentUser.uid,
                idToken: token,
                provider: getPrimaryProvider(auth.currentUser)
            }));
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        gameInstance.SendMessage('Firebase', 'OnTokenRefreshed', JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}

function getPrimaryProvider(user) {
    if (!user || !user.providerData || user.providerData.length === 0) {
        return 'Anonymous';
    }
    
    // Priority order matching mobile: Google > Apple > Other > Anonymous
    for (const provider of user.providerData) {
        switch (provider.providerId) {
            case 'google.com':
                return 'Google';
            case 'apple.com':
                return 'Apple';
        }
    }
    
    return 'Anonymous';
}

async function loginAnonymously() {
    try {
        const auth = firebase.auth();
        
        // Try to get existing user first
        if (auth.currentUser) {
            // Force token refresh to ensure it's not expired
            const token = await auth.currentUser.getIdToken(true);
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: true,
                uid: auth.currentUser.uid,
                idToken: token,
                provider: 'Anonymous'
            }));
            
            return;
        }

        // If no existing user, create new anonymous account
        const userCredential = await auth.signInAnonymously();
        const token = await userCredential.user.getIdToken();

        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: userCredential.user.uid,
            idToken: token,
            provider: 'Anonymous'
        }));
    } catch (error) {
        console.error("Anonymous login failed:", error);
        // If token expired, try to refresh and login again (matching mobile implementation)
        if (error.code === 'auth/id-token-expired') {
            try {
                await firebase.auth().currentUser.getIdToken(true);
                loginAnonymously(); // Try again after refresh
            } catch (refreshError) {
                gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                    success: false,
                    error: "Token refresh failed: " + refreshError.message
                }));
            }
        } else {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message
            }));
        }
    }

    setupTokenRefresh();
}

async function loginWithGoogle() {
    try {
        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');
        
        console.log("Starting Google Sign In...");
        const result = await auth.signInWithPopup(provider);
        const token = await result.user.getIdToken();
        
        console.log("Google Sign In successful for user:", result.user.uid);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'Google'
        }));
        
        setupTokenRefresh();
    } catch (error) {
        console.error("Google login failed:", error);
        
        // Handle account linking conflicts (matching mobile implementation)
        if (error.code === 'auth/account-exists-with-different-credential' || 
            error.code === 'auth/credential-already-in-use' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'Google', false);
        } else {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code
            }));
        }
    }
}

async function loginWithApple() {
    try {
        const auth = firebase.auth();
        const provider = new firebase.auth.OAuthProvider('apple.com');
        
        // Add scopes if needed
        provider.addScope('email');
        provider.addScope('name');
        
        console.log("Starting Apple Sign In...");
        const result = await auth.signInWithPopup(provider);
        const token = await result.user.getIdToken();
        
        console.log("Apple Sign In successful for user:", result.user.uid);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'Apple'
        }));
        
        setupTokenRefresh();
    } catch (error) {
        console.error("Apple login failed:", error);
        
        // Handle account linking conflicts (matching mobile implementation)
        if (error.code === 'auth/account-exists-with-different-credential' || 
            error.code === 'auth/credential-already-in-use' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'Apple', false);
        } else {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code
            }));
        }
    }
}

async function linkGoogleProvider() {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user signed in");
        }
        
        console.log("Linking Google provider to current user:", user.uid);
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await user.linkWithPopup(provider);
        const token = await result.user.getIdToken();
        
        console.log("Google provider linked successfully");
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'Google',
            operation: 'link'
        }));
    } catch (error) {
        console.error("Google provider linking failed:", error);
        
        // Handle requires-recent-login error
        if (await handleRequiresRecentLogin(error, linkGoogleProvider, 'Google', 'link')) {
            return;
        }
        
        // Handle account linking conflicts (matching mobile implementation)
        if (error.code === 'auth/credential-already-in-use' || 
            error.code === 'auth/account-exists-with-different-credential' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'Google', true);
        } else {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code,
                operation: 'link'
            }));
        }
    }
}

async function linkAppleProvider() {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user signed in");
        }
        
        console.log("Linking Apple provider to current user:", user.uid);
        const provider = new firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        
        const result = await user.linkWithPopup(provider);
        const token = await result.user.getIdToken();
        
        console.log("Apple provider linked successfully");
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'Apple',
            operation: 'link'
        }));
    } catch (error) {
        console.error("Apple provider linking failed:", error);
        
        // Handle requires-recent-login error
        if (await handleRequiresRecentLogin(error, linkAppleProvider, 'Apple', 'link')) {
            return;
        }
        
        // Handle account linking conflicts (matching mobile implementation)
        if (error.code === 'auth/credential-already-in-use' || 
            error.code === 'auth/account-exists-with-different-credential' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'Apple', true);
        } else {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code,
                operation: 'link'
            }));
        }
    }
}

async function unlinkProvider(providerId) {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user signed in");
        }
        
        console.log("Unlinking provider:", providerId);
        await user.unlink(providerId);
        console.log(`Successfully unlinked provider: ${providerId}`);
        
        // Notify Unity about successful unlinking
        const token = await user.getIdToken();
        gameInstance.SendMessage('Firebase', 'OnProviderUnlinked', JSON.stringify({
            success: true,
            providerId: providerId,
            uid: user.uid,
            idToken: token
        }));
    } catch (error) {
        console.error(`Failed to unlink provider ${providerId}:`, error);
        gameInstance.SendMessage('Firebase', 'OnProviderUnlinked', JSON.stringify({
            success: false,
            error: error.message,
            providerId: providerId
        }));
    }
}

function getLinkedProviders() {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            return [];
        }
        
        return user.providerData.map(provider => provider.providerId);
    } catch (error) {
        console.error("Failed to get linked providers:", error);
        return [];
    }
}

// Helper function to check if account exists without disrupting current auth state
// Uses a separate Firebase app instance to avoid affecting the main authentication
async function checkAccountExistsWithoutDisruption(email, password) {
    try {
        console.log("Checking if account exists for:", email);
        
        // Create a temporary Firebase app for account verification
        // Use the same config as the main app but with a different name
        const mainConfig = firebase.app().options;
        const tempApp = firebase.initializeApp(mainConfig, 'temp-auth-check');
        const tempAuth = tempApp.auth();
        
        try {
            // Attempt to sign in with the provided credentials using the temp auth
            const signInResult = await tempAuth.signInWithEmailAndPassword(email, password);
            
            if (signInResult && signInResult.user) {
                console.log("Account exists - verified with temporary auth instance");
                return true;
            }
            
            return false;
        } finally {
            // Clean up the temporary app
            await tempAuth.signOut();
            await tempApp.delete();
        }
    } catch (error) {
        console.log("Account existence check failed:", error.code, error.message);
        return false;
    }
}


 
async function getCurrentUserWithToken() {
    try {
		if(authReady){
			await authReady;
		}
		
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: "No user signed in"
            }));
            return;
        }
        
        const token = await user.getIdToken(true);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: user.uid,
            idToken: token,
            provider: getPrimaryProvider(user)
        }));
    } catch (error) {
        console.error("Failed to get current user with token:", error);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: error.message
        }));
    }
}

async function logoutUser() {
    try {
        const auth = firebase.auth();
        
        console.log("Signing out user from Firebase...");
        await auth.signOut();
        
        // Clear token refresh interval
        if (tokenRefreshInterval) {
            clearInterval(tokenRefreshInterval);
            tokenRefreshInterval = null;
        }
        
        // Clear any stored credentials
        pendingConflictCredential = null;
        pendingEmailPasswordCredentials = null;
        
        console.log("User signed out successfully");
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            operation: 'logout'
        }));
    } catch (error) {
        console.error("Logout failed:", error);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: error.message,
            operation: 'logout'
        }));
    }
}

// Enhanced account linking conflict handling matching mobile implementation
async function handleAccountLinkingConflict(error, providerName, isLinking = false) {
    console.warn(`Account linking conflict for ${providerName}:`, error);
    
    const operation = isLinking ? 'link' : 'login';
    
    // Store the credential for potential account switching
    pendingConflictCredential = error.credential;
    
    // For email/password, we need to store the credentials differently
    // since the error.credential doesn't contain the password
    if (providerName === 'RumbleRush' && pendingEmailPasswordCredentials) {
        // Email/password credentials were stored during the attempted operation
        console.log("Stored email/password credentials for potential account switching");
    }
    
    // Extract existing user info if available
    let existingUserInfo = "unknown";
    if (error.email) {
        existingUserInfo = error.email;
    }
    
    // Send conflict information to Unity for resolution (matching mobile pattern)
    gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
        success: false,
        error: `This ${providerName} account is already linked to a different user account.`,
        conflictType: 'account-linking-conflict',
        provider: providerName,
        operation: operation,
        errorCode: error.code,
        existingUser: existingUserInfo
    }));
}

// Function called from Unity when user chooses to switch to existing account
async function switchToExistingAccount() {
    try {
        const auth = firebase.auth();
        let result, token;
        
        // Handle email/password conflicts differently from OAuth conflicts
        if (pendingEmailPasswordCredentials) {
            // For email/password, use signInWithEmailAndPassword directly
            console.log("Switching to existing email/password account");
            result = await auth.signInWithEmailAndPassword(
                pendingEmailPasswordCredentials.email, 
                pendingEmailPasswordCredentials.password
            );
            token = await result.user.getIdToken();
            
            // Clear the pending credentials
            pendingEmailPasswordCredentials = null;
            pendingConflictCredential = null;
        } else if (pendingConflictCredential) {
            // Handle different types of stored credentials
            if (pendingConflictCredential.customToken) {
                // For custom tokens (SaveCode), use signInWithCustomToken
                console.log("Switching to existing SaveCode account with custom token");
                result = await auth.signInWithCustomToken(pendingConflictCredential.customToken);
                token = await result.user.getIdToken();
            } else {
                // For OAuth providers, use the stored credential
                console.log("Switching to existing OAuth account with stored credential");
                result = await auth.signInWithCredential(pendingConflictCredential);
                token = await result.user.getIdToken();
            }
            
            // Clear the pending credential
            pendingConflictCredential = null;
        } else {
            throw new Error("No pending credentials for account switching");
        }
        
        console.log("Successfully switched to existing account:", result.user.uid);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: getPrimaryProvider(result.user),
            operation: 'switch'
        }));
        
        setupTokenRefresh();
    } catch (error) {
        console.error("Failed to switch to existing account:", error);
        pendingConflictCredential = null;
        pendingEmailPasswordCredentials = null;
        
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: "Failed to switch to existing account: " + error.message,
            operation: 'switch'
        }));
    }
}

// Enhanced error handling for better debugging
function logError(context, error) {
    console.error(`[${context}] Error:`, {
        code: error.code,
        message: error.message,
        credential: error.credential,
        email: error.email
    });
}

// Utility function to get user's authentication state
function getAuthState() {
    const auth = firebase.auth();
    const user = auth.currentUser;
    
    if (!user) {
        return {
            isSignedIn: false,
            user: null,
            providers: []
        };
    }
    
    return {
        isSignedIn: true,
        user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAnonymous: user.isAnonymous
        },
        providers: user.providerData.map(p => ({
            providerId: p.providerId,
            uid: p.uid,
            email: p.email,
            displayName: p.displayName
        }))
    };
}

function setAnalyticsUserId(userId) {
    try {
        if (firebase.analytics) {
            firebase.analytics().setUserId(userId);
        } else {
            console.warn('Firebase Analytics not initialized');
        }
    } catch (error) {
        console.error('Error setting analytics user ID:', error);
    }
}

function setAnalyticsUserProperty(name, value) {
    try {
        if (firebase.analytics) {
            firebase.analytics().setUserProperties({[name]: value});
            console.log('Analytics user property set:', name, value);
        } else {
            console.warn('Firebase Analytics not initialized');
        }
    } catch (error) {
        console.error('Error setting user property:', error);
    }
}

async function loginWithEmailPassword(email, password) {
    try {
        const auth = firebase.auth();
        
        // Store credentials in case of conflict resolution
        pendingEmailPasswordCredentials = { email, password };
        
        console.log("Starting Email/Password Sign In...");
        const result = await auth.signInWithEmailAndPassword(email, password);
        const token = await result.user.getIdToken();
        
        // Store credentials for reauthentication and clear pending credentials on success
        pendingEmailPasswordCredentials = null;
        
        console.log("Email/Password Sign In successful for user:", result.user.uid);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'RumbleRush'
        }));
        
        setupTokenRefresh();
    } catch (error) {
        console.error("Email/Password login failed:", error);
        
        // Handle account linking conflicts
        if (error.code === 'auth/account-exists-with-different-credential' || 
            error.code === 'auth/credential-already-in-use' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'RumbleRush', false);
        } else {
            // Clear pending credentials on non-conflict errors
            pendingEmailPasswordCredentials = null;
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code
            }));
        }
    }
}

async function linkEmailPasswordProvider(email, password, isRegistration = false) {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user signed in");
        }
        
        if (!isRegistration) {
            // For login: Check if account exists first to prevent automatic account creation during linking
            const accountExists = await checkAccountExistsWithoutDisruption(email, password);
            
            if (!accountExists) {
                throw new Error("Account does not exist. Please check your credentials.");
            }
        } else {
            // For registration: Check if account already exists and prevent registration
            const accountExists = await checkAccountExistsWithoutDisruption(email, password);
            
            if (accountExists) {
                throw new Error("Account already exists. Please use login instead or choose a different username.");
            }
            console.log("Creating new email/password account via linking for registration");
        }
        
        // Store credentials in case of conflict resolution
        pendingEmailPasswordCredentials = { email, password };
        
        console.log("Linking Email/Password provider to current user:", user.uid);
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        
        const result = await user.linkWithCredential(credential);
        const token = await result.user.getIdToken();
        
        // Store credentials for reauthentication and clear pending credentials on success
        pendingEmailPasswordCredentials = null;
        
        console.log("Email/Password provider linked successfully");
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: token,
            provider: 'RumbleRush',
            operation: 'link'
        }));
    } catch (error) {
        console.error("Email/Password provider linking failed:", error);
        
        // Handle requires-recent-login error
        if (await handleRequiresRecentLogin(error, () => linkEmailPasswordProvider(email, password, isRegistration), 'RumbleRush', 'link')) {
            return;
        }
        
        // For registration, don't try conflict resolution - just fail
        if (isRegistration) {
            pendingEmailPasswordCredentials = null;
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code,
                operation: 'link'
            }));
            return;
        }
        
        // Handle account linking conflicts (matching mobile implementation)
        if (error.code === 'auth/credential-already-in-use' || 
            error.code === 'auth/account-exists-with-different-credential' ||
            error.code === 'auth/email-already-in-use') {
            await handleAccountLinkingConflict(error, 'RumbleRush', true);
        } else {
            // Clear pending credentials on non-conflict errors
            pendingEmailPasswordCredentials = null;
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: error.message,
                errorCode: error.code,
                operation: 'link'
            }));
        }
    }
}

async function sendPasswordResetEmail(email) {
    try {
        const auth = firebase.auth();
        
        console.log("Sending password reset email to:", email);
        await auth.sendPasswordResetEmail(email);
        
        console.log("Password reset email sent successfully");
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            operation: 'password_reset',
            email: email
        }));
    } catch (error) {
        console.error("Password reset email failed:", error);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: error.message,
            errorCode: error.code,
            operation: 'password_reset'
        }));
    }
}

async function loginWithCustomToken(token) {
    try {
        const auth = firebase.auth();
        
        console.log("Starting Custom Token Sign In...");
        const result = await auth.signInWithCustomToken(token);
        const idToken = await result.user.getIdToken();
        
        console.log("Custom Token Sign In successful for user:", result.user.uid);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: true,
            uid: result.user.uid,
            idToken: idToken,
            provider: 'SaveCode'
        }));
        
        setupTokenRefresh();
    } catch (error) {
        console.error("Custom token login failed:", error);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: error.message,
            errorCode: error.code
        }));
    }
}

async function linkCustomTokenProvider(token) {
    try {
        const auth = firebase.auth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user signed in");
        }
        
        console.log("Linking Custom Token provider to current user:", user.uid);
        
        // Like mobile implementation, automatically trigger conflict resolution
        // Store the token for potential account switching
        pendingConflictCredential = { customToken: token };
        
        // Send conflict information to Unity for resolution (matching mobile pattern)
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: "This SaveCode account is already linked to a different user account.",
            conflictType: 'account-linking-conflict',
            provider: 'SaveCode',
            operation: 'link',
            errorCode: 'auth/credential-already-in-use',
            existingUser: 'unknown'
        }));
        
    } catch (error) {
        console.error("Custom token provider linking failed:", error);
        gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
            success: false,
            error: error.message,
            errorCode: error.code,
            operation: 'link'
        }));
    }
}

// Flags to prevent infinite reauthentication loops
var isRetryingAfterReauth = false;

// Common function to handle requires-recent-login errors
async function handleRequiresRecentLogin(error, retryFunction, providerName, operation = 'link') {
    if (error.code === 'auth/requires-recent-login' && !isRetryingAfterReauth) {
        isRetryingAfterReauth = true;
        
        try {
            const reauthSuccess = await reauthenticateWithAnyLinkedProvider();
            if (!reauthSuccess) {
                throw new Error("Reauthentication failed");
            }
            
            // Call the original function again after reauthentication
            await retryFunction();
            isRetryingAfterReauth = false;
            return true; // Indicates the error was handled and retry succeeded
        } catch (reauthError) {
            console.error("Reauthentication failed:", reauthError);
            isRetryingAfterReauth = false;
            gameInstance.SendMessage('Firebase', 'OnLoginComplete', JSON.stringify({
                success: false,
                error: "Recent authentication required. Please log out and log in again, then try linking your account.",
                errorCode: error.code,
                operation: operation
            }));
            return true; // Indicates the error was handled (even if retry failed)
        }
    }
    return false; // Indicates this error was not handled by this function
}

// Reauthenticates using any available linked provider (NOT the provider being linked)
async function reauthenticateWithAnyLinkedProvider() {
    try {
        const auth = firebase.auth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) return false;

        // Get linked providers using existing function
        const linkedProviderIds = getLinkedProviders();
        
        // Try to reauthenticate with each linked provider until one succeeds
        for (const providerId of linkedProviderIds) {
            try {
                switch (providerId) {
                    case 'password':
                        break;
                    case 'google.com':
                        // Reauthenticate with Google using popup
                        const googleProvider = new firebase.auth.GoogleAuthProvider();
                        googleProvider.addScope('profile');
                        googleProvider.addScope('email');
                        const googleResult = await currentUser.reauthenticateWithPopup(googleProvider);
                        if (googleResult && googleResult.user) {
                            return true;
                        }
                        break;
                    case 'apple.com':
                        // Reauthenticate with Apple using popup
                        const appleProvider = new firebase.auth.OAuthProvider('apple.com');
                        appleProvider.addScope('email');
                        appleProvider.addScope('name');
                        const appleResult = await currentUser.reauthenticateWithPopup(appleProvider);
                        if (appleResult && appleResult.user) {
                            return true;
                        }
                        break;
                    case 'playgames.google.com':
                        // Google Play Games is not available in WebGL
                        break;
                }
            } catch (ex) {
                // If this provider fails, try the next one
                continue;
            }
        }
        
        return false;
    } catch (ex) {
        return false;
    }
}

function getFirestoreListener(documentId, successCallback, errorCallback) {
	var isDevDefined = typeof devApp !== "undefined";
	const firebaseApp = isDevDefined ? devApp : firebase.default;
	
    firestoreCallbackId++;
    const id = firestoreCallbackId; // capture value
    const unsubscribe = firebaseApp.firestore().doc(documentId).onSnapshot(doc => {
        if (doc.exists) {
            const data = convertTimestamps(doc.data());
            successCallback([id, JSON.stringify(data)]);
        } else {
            successCallback([id, null]);  
        }
    }, error => {
        errorCallback(error.message);
    });

    firestoreListeners[id] = unsubscribe;
    console.log("--- getFirestoreListener setting listener " + id)
    return id;
}

function convertTimestamps(value) {
    // Firestore Timestamp -> JS Date
    if (value instanceof firebase.firestore.Timestamp) {
        return value.toDate();
    }

    // Arrays
    if (Array.isArray(value)) {
        return value.map(convertTimestamps);
    }

    // Plain objects (maps)
    if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = convertTimestamps(v);
        }
        return out;
    }

    // Primitives
    return value;
}

function detachFirestoreListener(id) {
    if (firestoreListeners[id] !== undefined) {
        firestoreListeners[id]();
        delete firestoreListeners[id];
    }
}

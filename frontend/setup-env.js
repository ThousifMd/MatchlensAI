const fs = require('fs');
const path = require('path');

// Frontend Environment file content
const envContent = `# Frontend Environment Variables

# Backend API URL
BACKEND_URL=http://localhost:5001
BACKEND_BASE_URL=http://localhost:5001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# PayPal Configuration (for frontend PayPal SDK)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=Aa3Qhzd--_8MNtB9U8LctWUzDXw3eO7XPw2cyHUzwa9e_sYlD1pXnQK_K3iXNIXD2i64F8AUfPiWL-AT

# PayPal API Base URL (for frontend API calls)
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com

# PayPal Credentials (for server-side API routes)
PAYPAL_CLIENT_ID=Aa3Qhzd--_8MNtB9U8LctWUzDXw3eO7XPw2cyHUzwa9e_sYlD1pXnQK_K3iXNIXD2i64F8AUfPiWL-AT
PAYPAL_SECRET_KEY=EA2AXRqUV6DzePjN9v0KBoz8eSUPCG656rSouA_VUaRbS-IUSbr4-R9VBymtCjhYwfrBnN7vYhKkKIhu

# Alternative PayPal environment variable names (for compatibility)
SANDBOX_PAYPAL_CLIENT_ID=Aa3Qhzd--_8MNtB9U8LctWUzDXw3eO7XPw2cyHUzwa9e_sYlD1pXnQK_K3iXNIXD2i64F8AUfPiWL-AT
SANDBOX_PAYPAL_SECRET_KEY=EA2AXRqUV6DzePjN9v0KBoz8eSUPCG656rSouA_VUaRbS-IUSbr4-R9VBymtCjhYwfrBnN7vYhKkKIhu

# Meta Pixel Configuration
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id_here

# Cloudinary Configuration (if needed for frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Stripe Configuration (if using Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Dodo Payment Configuration
NEXT_PUBLIC_DODO_PAYMENT_URL=https://api.dodo.com/payments
`;

const createEnvFile = () => {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            console.log('ℹ️  Frontend .env.local file already exists. Skipping creation.');
            return;
        }

        // Create .env.local file
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Frontend .env.local file created successfully');
        console.log('📝 PayPal credentials configured for sandbox mode!');
        console.log('📝 Backend URL configured for local development!');

    } catch (error) {
        console.error('❌ Error creating frontend .env.local file:', error.message);
        process.exit(1);
    }
};

createEnvFile();

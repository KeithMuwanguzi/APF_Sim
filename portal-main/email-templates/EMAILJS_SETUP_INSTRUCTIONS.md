# EmailJS Email Templates Setup Instructions

This folder contains email templates for OTP verification and password reset functionality.

## Templates Available

### 1. OTP Verification
- `OTP_EMAIL_TEMPLATE.html` - HTML version
- `OTP_EMAIL_TEMPLATE.txt` - Plain text version
- **Subject:** `Your {{app_name}} verification code`

### 2. Password Reset
- `PASSWORD_RESET_TEMPLATE.html` - HTML version
- `PASSWORD_RESET_TEMPLATE.txt` - Plain text version
- **Subject:** `Reset your {{app_name}} password`

---

## Template Variables

### OTP Template Variables
- `{{user_name}}` - Recipient's name (e.g., "John Doe")
- `{{app_name}}` - Application name (e.g., "APF Portal")
- `{{otp}}` - The 6-digit OTP code (e.g., "123456")
- `{{expires_in}}` - Expiration time in minutes (e.g., "10")
- `{{support_email}}` - Your support email (e.g., "support@apf.org")

### Password Reset Template Variables
- `{{user_name}}` - Recipient's name (e.g., "John Doe")
- `{{app_name}}` - Application name (e.g., "APF Portal")
- `{{reset_link}}` - Password reset URL (e.g., "https://apf.org/reset-password?token=...")
- `{{expires_in}}` - Link expiration time in minutes (e.g., "30")
- `{{support_email}}` - Your support email (e.g., "support@apf.org")

---

## Setup Steps for EmailJS

### 1. Create OTP Verification Template

1. Go to your EmailJS dashboard: https://dashboard.emailjs.com/
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Give it a name: `APF OTP Verification`

**Subject Line:**
```
Your {{app_name}} verification code
```

**Content:**
Copy the entire content from `OTP_EMAIL_TEMPLATE.html` and paste it into the **Content** section.

**Plain Text Alternative:**
Copy content from `OTP_EMAIL_TEMPLATE.txt` and add it to the plain text section.

### 2. Create Password Reset Template

1. In EmailJS dashboard, click **Create New Template**
2. Give it a name: `APF Password Reset`

**Subject Line:**
```
Reset your {{app_name}} password
```

**Content:**
Copy the entire content from `PASSWORD_RESET_TEMPLATE.html` and paste it into the **Content** section.

**Plain Text Alternative:**
Copy content from `PASSWORD_RESET_TEMPLATE.txt` and add it to the plain text section.

---

## Frontend Integration

### OTP Email Example

```javascript
import emailjs from '@emailjs/browser';

const sendOTPEmail = async (userEmail, userName, otp) => {
  const templateParams = {
    to_email: userEmail,
    user_name: userName,
    app_name: "APF Portal",
    otp: otp,
    expires_in: "10",
    support_email: "support@apf.org"
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_OTP_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Failed to send OTP email:', error);
  }
};
```

### Password Reset Email Example

```javascript
const sendPasswordResetEmail = async (userEmail, userName, resetToken) => {
  const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
  
  const templateParams = {
    to_email: userEmail,
    user_name: userName,
    app_name: "APF Portal",
    reset_link: resetLink,
    expires_in: "30",
    support_email: "support@apf.org"
  };

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_PASSWORD_RESET_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
    );
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
};
```

---

## Testing Templates

### Test OTP Template in EmailJS Dashboard

1. Click **Test It** in the template editor
2. Fill in sample values:
   - `user_name`: John Doe
   - `app_name`: APF Portal
   - `otp`: 123456
   - `expires_in`: 10
   - `support_email`: support@apf.org
   - `to_email`: your-test-email@example.com
3. Send test email and verify formatting

### Test Password Reset Template

1. Click **Test It** in the template editor
2. Fill in sample values:
   - `user_name`: John Doe
   - `app_name`: APF Portal
   - `reset_link`: https://apf.org/reset-password?token=test123
   - `expires_in`: 30
   - `support_email`: support@apf.org
   - `to_email`: your-test-email@example.com
3. Send test email and verify formatting

---

## Security Best Practices

### ✅ DO:
1. Generate OTP codes on the backend (use secure random generation)
2. Generate password reset tokens on the backend
3. Set appropriate expiration times (10 min for OTP, 30 min for reset links)
4. Implement rate limiting on email sending endpoints
5. Validate tokens on the backend only
6. Invalidate tokens after successful use
7. Use HTTPS for all reset links in production

### ❌ DON'T:
1. Generate OTP codes on the frontend
2. Generate reset tokens on the frontend
3. Store sensitive tokens in localStorage
4. Validate tokens on the frontend
5. Reuse tokens after they've been used
6. Allow unlimited email sending (implement rate limits)

---

## Customization

To customize the templates for your brand:

1. **Colors**: Update the color values in the HTML
   - Current primary: `#111827` (dark gray)
   - Current accent: `#1d4ed8` (blue for reset button)
   - Background: `#f6f7fb` (light gray)

2. **App Name**: Replace `{{app_name}}` with your actual app name in the template params
   - Example: "APF Portal", "Accountants Practitioners Forum"

3. **Support Email**: Update `{{support_email}}` with your actual support email

4. **Expiration Times**: Adjust `{{expires_in}}` based on your security requirements
   - Recommended: 10 minutes for OTP, 30 minutes for password reset

---

## Troubleshooting

**Issue: Variables not showing**
- Ensure variable names match exactly: `{{user_name}}`, `{{otp}}`, `{{reset_link}}`, etc.
- Check that you're passing the correct parameter names in your code

**Issue: Email not sending**
- Verify your EmailJS service is connected and active
- Check your EmailJS quota/limits
- Ensure sender email is verified

**Issue: Formatting looks broken**
- The templates use inline styles for maximum email client compatibility
- Test with multiple email clients (Gmail, Outlook, Apple Mail)

**Issue: Reset link not working**
- Ensure the reset link includes the full URL with protocol (https://)
- Verify the token is being passed correctly in the URL
- Check that the frontend route exists for password reset

---

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Dashboard: https://dashboard.emailjs.com/
- For APF technical support, contact your development team

---

## Template Features

✅ Clean, minimal design
✅ Human-friendly language
✅ Clear call-to-action
✅ Security reminders
✅ Mobile-responsive
✅ Professional but approachable
✅ Works with all major email clients

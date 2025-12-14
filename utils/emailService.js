const sgMail = require('@sendgrid/mail')

const initializeSendGrid = () => {
    const apiKey = process.env.SENDGRID_API_KEY

    if (!apiKey) {
        console.error('SendGrid API key not configured in environment variables')
        throw new Error('SendGrid API key not configured')
    }

    sgMail.setApiKey(apiKey)
    console.log('SendGrid email service initialized')
}

initializeSendGrid()

const sendEmail = async (mailOptions) => {
    try {
        const msg = {
            to: mailOptions.to,
            from: process.env.EMAIL_USER,
            subject: mailOptions.subject,
            html: mailOptions.html
        }

        await sgMail.send(msg)
        return { success: true }
    } catch (error) {
        console.error('SendGrid error:', error)
        if (error.response) {
            console.error('SendGrid error details:', error.response.body)
        }
        throw error
    }
}

const sendDonorWelcomeEmail = async (donorName, donorEmail) => {
    try {
        if (!donorEmail || !donorName) {
            return { success: false, message: 'Invalid recipient details' }
        }

        const mailOptions = {
            to: donorEmail,
            subject: 'Welcome to Good Heart Charity Platform!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #333;">Welcome, ${donorName}!</h2>
                    <p style="color: #666; font-size: 16px;">Your signup was successful.</p>
                    <p style="color: #666; font-size: 16px;">Thank you for joining Good Heart Charity Platform. Your contribution makes a difference!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Welcome email sent to ${donorEmail}`)
        return { success: true, message: 'Welcome email sent' }
    } catch (err) {
        console.error(`Error sending welcome email to ${donorEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendNGOWelcomeEmail = async (ngoContactName, ngoEmail, ngoName) => {
    try {
        if (!ngoEmail || !ngoContactName || !ngoName) {
            return { success: false, message: 'Invalid recipient details' }
        }

        const mailOptions = {
            to: ngoEmail,
            subject: 'Welcome to Good Heart Charity Platform!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #333;">Welcome, ${ngoContactName}!</h2>
                    <p style="color: #666; font-size: 16px;"><strong>${ngoName}</strong> has been successfully registered on Good Heart Charity Platform.</p>
                    <p style="color: #666; font-size: 16px;">Your account is currently pending verification. Our team will review your information and notify you shortly.</p>
                    <p style="color: #666; font-size: 16px;">We appreciate your dedication to charitable work and look forward to collaborating with you!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Welcome email sent to ${ngoEmail}`)
        return { success: true, message: 'Welcome email sent' }
    } catch (err) {
        console.error(`Error sending welcome email to ${ngoEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendAdminWelcomeEmail = async (adminEmail) => {
    try {
        if (!adminEmail) {
            return { success: false, message: 'Invalid recipient details' }
        }

        const mailOptions = {
            to: adminEmail,
            subject: 'Welcome to Good Heart Charity Admin Panel!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #333;">Welcome, Admin!</h2>
                    <p style="color: #666; font-size: 16px;">Your admin account has been successfully created on Good Heart Charity Platform.</p>
                    <p style="color: #666; font-size: 16px;">You now have access to the admin panel to manage NGOs, campaigns, donations, and contact messages.</p>
                    <p style="color: #666; font-size: 16px;">Thank you for your role in supporting our charitable initiatives!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Admin welcome email sent to ${adminEmail}`)
        return { success: true, message: 'Welcome email sent' }
    } catch (err) {
        console.error(`Error sending admin welcome email to ${adminEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendContactNotificationEmail = async (contactData) => {
    try {
        if (!contactData || !contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            return { success: false, message: 'Invalid contact data' }
        }

        if (!process.env.ADMIN_EMAIL) {
            console.error('Admin email not configured')
            return { success: false, message: 'Admin email not configured' }
        }

        const mailOptions = {
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Message: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #333;">New Contact Message</h2>
                    <p><strong>From:</strong> ${contactData.name}</p>
                    <p><strong>Email:</strong> ${contactData.email}</p>
                    <p><strong>Subject:</strong> ${contactData.subject}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px;">
                        <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p style="color: #999; font-size: 14px;"><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Admin notification sent for contact: ${contactData.email}`)
        return { success: true, message: 'Email sent to admin' }
    } catch (err) {
        console.error(`Error sending admin notification:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendContactConfirmationEmail = async (userEmail, userName) => {
    try {
        if (!userEmail || !userName) {
            return { success: false, message: 'Invalid recipient details' }
        }

        const mailOptions = {
            to: userEmail,
            subject: 'We received your message',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #333;">Hello ${userName},</h2>
                    <p style="color: #666; font-size: 16px;">Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
                    <p style="color: #666; font-size: 16px;">We appreciate your interest and look forward to assisting you!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Confirmation email sent to ${userEmail}`)
        return { success: true, message: 'Confirmation email sent' }
    } catch (err) {
        console.error(`Error sending confirmation email to ${userEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendDonationNotificationToNGO = async (ngoEmail, ngoName, campaignTitle, donorName, amount) => {
    try {
        if (!ngoEmail || !ngoName || !campaignTitle || !donorName || !amount) {
            return { success: false, message: 'Invalid donation data' }
        }

        const mailOptions = {
            to: ngoEmail,
            subject: `New Donation Received for ${campaignTitle}!`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #28a745;">Thank You for Your Trust!</h2>
                    <p style="color: #666; font-size: 16px;">Great news, <strong>${ngoName}</strong>!</p>
                    <p style="color: #666; font-size: 16px;">Your campaign <strong>${campaignTitle}</strong> has received a new donation!</p>
                    <div style="background-color: #fff; padding: 15px; border-left: 4px solid #28a745; border-radius: 4px; margin: 15px 0;">
                        <p><strong>Donor Name:</strong> ${donorName}</p>
                        <p><strong>Donation Amount:</strong> $${amount}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p style="color: #666; font-size: 16px;">Every contribution brings you closer to your goal. Thank you for making a difference!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Donation notification sent to ${ngoEmail}`)
        return { success: true, message: 'Email sent to NGO' }
    } catch (err) {
        console.error(`Error sending donation notification to ${ngoEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

const sendDonationConfirmationToDonor = async (donorEmail, donorName, campaignTitle, amount, totalDonorsCount) => {
    try {
        if (!donorEmail || !donorName || !campaignTitle || !amount) {
            return { success: false, message: 'Invalid donation data' }
        }

        const mailOptions = {
            to: donorEmail,
            subject: `Thank You for Your Donation to ${campaignTitle}!`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                    <h2 style="color: #28a745;">Thank You, ${donorName}!</h2>
                    <p style="color: #666; font-size: 16px;">Your generous donation of <strong>$${amount}</strong> to <strong>${campaignTitle}</strong> has been received successfully!</p>
                    <div style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; border-radius: 4px; margin: 15px 0;">
                        <p><strong>Campaign:</strong> ${campaignTitle}</p>
                        <p><strong>Amount Donated:</strong> $${amount}</p>
                        <p><strong>Total Campaign Donors:</strong> ${totalDonorsCount}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p style="color: #666; font-size: 16px;">Your contribution is making a real difference in people's lives. Thank you for your compassion and support!</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 14px;">Best regards,<br><strong>Good Heart Charity Team</strong></p>
                </div>
            `
        }

        await sendEmail(mailOptions)
        console.log(`Donation confirmation sent to ${donorEmail}`)
        return { success: true, message: 'Email sent to donor' }
    } catch (err) {
        console.error(`Error sending donation confirmation to ${donorEmail}:`, err.message)
        return { success: false, message: 'Failed to send email' }
    }
}

module.exports = {
    sendDonorWelcomeEmail,
    sendNGOWelcomeEmail,
    sendAdminWelcomeEmail,
    sendContactNotificationEmail,
    sendContactConfirmationEmail,
    sendDonationNotificationToNGO,
    sendDonationConfirmationToDonor
}

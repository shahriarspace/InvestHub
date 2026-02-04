package com.platform.email.service;

public class EmailTemplates {

    private static final String BASE_STYLE = """
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .amount { font-size: 28px; color: #1976d2; font-weight: bold; }
        </style>
        """;

    public static String offerReceivedEmail(String investorName, String startupName, String offerAmount) {
        return """
            <!DOCTYPE html>
            <html>
            <head>%s</head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Investment Offer!</h1>
                    </div>
                    <div class="content">
                        <p>Great news! You've received a new investment offer for <strong>%s</strong>.</p>
                        <div class="highlight">
                            <p><strong>Investor:</strong> %s</p>
                            <p><strong>Offer Amount:</strong></p>
                            <p class="amount">%s</p>
                        </div>
                        <p>Log in to your dashboard to review the offer details and respond.</p>
                        <a href="#" class="button">View Offer</a>
                    </div>
                    <div class="footer">
                        <p>Startup Investment Platform</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(BASE_STYLE, startupName, investorName, offerAmount);
    }

    public static String offerAcceptedEmail(String startupName, String offerAmount) {
        return """
            <!DOCTYPE html>
            <html>
            <head>%s</head>
            <body>
                <div class="container">
                    <div class="header" style="background: linear-gradient(135deg, #2e7d32, #66bb6a);">
                        <h1>Offer Accepted!</h1>
                    </div>
                    <div class="content">
                        <p>Congratulations! Your investment offer has been accepted!</p>
                        <div class="highlight" style="background: #e8f5e9;">
                            <p><strong>Startup:</strong> %s</p>
                            <p><strong>Accepted Amount:</strong></p>
                            <p class="amount" style="color: #2e7d32;">%s</p>
                        </div>
                        <p>The startup team will be in touch with next steps. You can also reach out to them through our messaging system.</p>
                        <a href="#" class="button" style="background: #2e7d32;">View Details</a>
                    </div>
                    <div class="footer">
                        <p>Startup Investment Platform</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(BASE_STYLE, startupName, offerAmount);
    }

    public static String offerRejectedEmail(String startupName, String offerAmount) {
        return """
            <!DOCTYPE html>
            <html>
            <head>%s</head>
            <body>
                <div class="container">
                    <div class="header" style="background: linear-gradient(135deg, #616161, #9e9e9e);">
                        <h1>Offer Update</h1>
                    </div>
                    <div class="content">
                        <p>We wanted to let you know that your investment offer was not accepted at this time.</p>
                        <div class="highlight" style="background: #fafafa;">
                            <p><strong>Startup:</strong> %s</p>
                            <p><strong>Offer Amount:</strong> %s</p>
                        </div>
                        <p>Don't be discouraged! There are many other exciting startups looking for investors like you. Browse our platform to discover new opportunities.</p>
                        <a href="#" class="button" style="background: #616161;">Explore Startups</a>
                    </div>
                    <div class="footer">
                        <p>Startup Investment Platform</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(BASE_STYLE, startupName, offerAmount);
    }

    public static String newMessageEmail(String senderName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>%s</head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Message</h1>
                    </div>
                    <div class="content">
                        <p>You have a new message from <strong>%s</strong>.</p>
                        <p>Log in to your account to read and respond to the message.</p>
                        <a href="#" class="button">View Message</a>
                    </div>
                    <div class="footer">
                        <p>Startup Investment Platform</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(BASE_STYLE, senderName);
    }

    public static String welcomeEmail(String firstName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>%s</head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to the Platform!</h1>
                    </div>
                    <div class="content">
                        <p>Hi %s,</p>
                        <p>Welcome to the Startup Investment Platform! We're excited to have you join our community of innovators and investors.</p>
                        <div class="highlight">
                            <p><strong>What you can do:</strong></p>
                            <ul>
                                <li>Create and manage your startup profile</li>
                                <li>Connect with investors</li>
                                <li>Receive and manage investment offers</li>
                                <li>Message other users directly</li>
                            </ul>
                        </div>
                        <p>Get started by completing your profile and exploring the platform.</p>
                        <a href="#" class="button">Go to Dashboard</a>
                    </div>
                    <div class="footer">
                        <p>Startup Investment Platform</p>
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(BASE_STYLE, firstName);
    }
}

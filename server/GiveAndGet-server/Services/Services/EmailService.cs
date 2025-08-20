using System;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Services.Interfaces;
using System.Net;

namespace Services.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        // Constructor to inject the configuration
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Method to send an email
        public void SendEmail(string subject, string body, string dest)
        {
            try
            {
                // Get email sender details and Mailjet API credentials from configuration
                string source = _configuration["EmailSettings:SenderEmail"];
                string apiKey = _configuration["EmailSettings:ApiKey"];
                string apiSecret = _configuration["EmailSettings:ApiSecret"];
                string smtpHost = _configuration["EmailSettings:SmtpHost"];
                int smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);

                // Create a MimeMessage to construct the email
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("give & get", source)); // Sender email
                emailMessage.To.Add(new MailboxAddress("", dest)); // Recipient email
                emailMessage.Subject = subject; // Set the subject of the email
                emailMessage.Body = new TextPart("plain") { Text = body }; // Set the email body

                using (var smtpClient = new SmtpClient())
                {
                    try
                    {
                        // הוספת לוג לפני החיבור
                        Console.WriteLine("Attempting to connect to SMTP server...");

                        // חיבור לשרת SMTP של Mailjet
                        ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
                        smtpClient.Connect("in-v3.mailjet.com", 587, SecureSocketOptions.StartTls);

                        // הוספת לוג אחרי החיבור
                        Console.WriteLine("Connected to SMTP server successfully.");

                        // ביצוע האותנטיקציה
                        smtpClient.Authenticate(apiKey, apiSecret);

                        // שליחת המייל
                        smtpClient.Send(emailMessage);
                        smtpClient.Disconnect(true);

                        // הוספת לוג אחרי שליחת המייל
                        Console.WriteLine("Email sent successfully.");
                    }
                    catch (Exception ex)
                    {
                        // הדפסת שגיאה במידה ויש בעיה בחיבור או בשליחה
                        Console.WriteLine($"Error: {ex.Message}");
                    }
                }


                // Log success message
                Console.WriteLine($"Email sent successfully to {dest}");
            }
            catch (Exception ex)
            {
                // In case of an error, print the error and throw it to allow the caller to handle it
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw new Exception(ex.Message); // Throw exception to notify calling method
            }
        }
    }
}

using MimeKit;

namespace WebShop.Services.EmailServices
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmail(Message message)
        {
            //create message
            var emailMessage = new MimeMessage();
            var address = _configuration.GetSection("EmailConfiguration")["From"];
            emailMessage.From.Add(new MailboxAddress("Vladimir", address));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Body };

            //send message
            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                try
                {
                    client.CheckCertificateRevocation = false;
                    var smtp = _configuration.GetSection("EmailConfiguration")["SmtpServer"];
                    var port = _configuration.GetSection("EmailConfiguration")["Port"];
                    var username = _configuration.GetSection("EmailConfiguration")["Username"];
                    var password = _configuration.GetSection("EmailConfiguration")["Password"];
                    await client.ConnectAsync(smtp, int.Parse(port), MailKit.Security.SecureSocketOptions.Auto);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(username, password);

                    await client.SendAsync(emailMessage);
                }
                catch (Exception)
                {

                    throw;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }
    }
}

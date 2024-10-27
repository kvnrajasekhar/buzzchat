const nodemailer = require("nodemailer");

module.exports = async function sendEmail(email, subject, link) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const logoUrl = "https://drive.google.com/uc?export=view&id=1gGK8HO3o9gSBL9DWrApIlf3xV3w-CLJU"; 
    const thankYouImageUrl = "https://i.pinimg.com/originals/1f/ef/2b/1fef2b194cca65515282c790e913d201.png";

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; width: 100%; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px;">
            <div style="text-align: center;">
              <img src="${logoUrl}" alt="Buzzchat Logo" style="width: 150px; height: auto; margin-bottom: 20px;">
            </div>
            <h1 style="color: #333; text-align: center;">Email Verification</h1>
            <p style="color: #555; text-align: center;">
              Thank you for signing up! Please verify your email address by clicking the link below:
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${link}" style="display: inline-block; padding: 10px 15px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                Verify Email
              </a>
            </div>
            <p style="color: #555; margin-top: 20px; text-align: center;">
              If you did not create an account, please ignore this email.
            </p>
            <p style="color: #555; text-align: center;">
              Best regards,<br>
              buzzchat
            </p>
            <!-- Thank You Image as Footer -->
            <div style="text-align: center; margin-top: 30px;">
              <img src="${thankYouImageUrl}" alt="Thank You" style="width: 100%; height: auto; max-width: 250px; margin-top: 20px;">
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.log(error);
  }
};

import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

interface SendEmailProps {
  email: string;
  emailType: 'VERIFY' | 'RESET';
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailProps) => {
  try {
    // Creating a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Updating the user document based on emailType
    const updateFields =
      emailType === 'VERIFY'
        ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
        : {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    await User.findByIdAndUpdate(userId, updateFields, { new: true });

    // Email transport setup
    const transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER as string,
        pass: process.env.MAILTRAP_PASS as string,
      },
    });

    const subject =
      emailType === 'VERIFY' ? 'Verify Your Email' : 'Reset Your Password';
    const url = `${process.env.NEXT_PUBLIC_DOMAIN}/${
      emailType === 'VERIFY' ? 'verifyemail' : 'reset-password'
    }?token=${hashedToken}`;

    const html = `<p>Click <a href="${url}">here</a> to ${
      emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
    } or copy and paste the link below in your browser:<br> ${url} </p>`;

    const mailOptions = {
      from: 'itstheabhiii@gmail.com',
      to: email,
      subject,
      html,
    };

    return await transport.sendMail(mailOptions);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    throw new Error(errorMessage);
  }
};

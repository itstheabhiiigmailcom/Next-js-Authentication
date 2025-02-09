import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { sendEmail } from '@/helpers/mailer';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();
    const { email }: { email: string } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the token has expired
    if (
      user.forgotPasswordTokenExpiry &&
      new Date(user.forgotPasswordTokenExpiry) < new Date()
    ) {
      return NextResponse.json(
        { error: 'Password reset token expired' },
        { status: 400 }
      );
    }

    try {
      await sendEmail({
        email,
        emailType: 'RESET',
        userId: user._id.toString(),
      });
      console.log('Email successfully sent.');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Reset email sent' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

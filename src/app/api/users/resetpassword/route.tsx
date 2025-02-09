import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connect();
    const { token, newPassword }: { token: string; newPassword: string } =
      await req.json();

    // Find user by token
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 },
      }
    );

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

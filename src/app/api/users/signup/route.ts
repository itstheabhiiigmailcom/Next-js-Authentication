import { connect } from '../../../../dbConfig/dbConfig';
import User from '../../../../models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const reqBody: { username: string; email: string; password: string } =
      await request.json();
    const { username, email, password } = reqBody;

    console.log('Request body inside signup route.ts:', reqBody);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create and save new user
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    console.log('Saved user:', savedUser);

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

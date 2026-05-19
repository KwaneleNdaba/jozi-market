'use server';

import dbConnect from '@/lib/mongodb';
import WaitlistUser, { WaitlistUserType } from '@/lib/models/WaitlistUser';

interface RegisterWaitlistInput {
  name: string;
  email: string;
  phone: string;
  type: WaitlistUserType;
}

interface WaitlistActionResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    email: string;
    type: WaitlistUserType;
  };
}

export async function registerWaitlistAction(
  input: RegisterWaitlistInput
): Promise<WaitlistActionResponse> {
  try {
    const { name, email, phone, type } = input;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return { success: false, message: 'Name, email, and phone are required.' };
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!['buyer', 'vendor'].includes(type)) {
      return { success: false, message: 'User type must be either buyer or vendor.' };
    }

    await dbConnect();

    const existing = await WaitlistUser.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return {
        success: false,
        message: "You're already on the waitlist! We'll be in touch soon.",
      };
    }

    const user = await WaitlistUser.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      type,
    });

    return {
      success: true,
      message: "You're on the list! We'll notify you when Jozi Market launches.",
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        type: user.type,
      },
    };
  } catch (error: any) {
    if (error?.code === 11000) {
      return {
        success: false,
        message: "You're already on the waitlist! We'll be in touch soon.",
      };
    }
    console.error('[Waitlist] Registration error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function getWaitlistCountAction(): Promise<{ count: number }> {
  try {
    await dbConnect();
    const count = await WaitlistUser.countDocuments();
    return { count };
  } catch {
    return { count: 0 };
  }
}

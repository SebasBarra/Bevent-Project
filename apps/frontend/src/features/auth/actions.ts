'use server';

import { auth, createClerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { ONBOARDING_REDIRECT_URL, REDIRECT_URL } from '@/features/auth/constants';
import { registerUser } from '@/features/auth/services/auth.service';
import { type RegisterUserRequest, UserRole, type UserSession } from '@/features/auth/types';
import { env } from '@/lib/env/server';
import { safeAction } from '@/lib/safe-action';

function _getCurrentSession(options: {
  redirectIfNotFound: true;
  forceCheckOnboarding?: boolean;
}): Promise<UserSession>;
function _getCurrentSession(options?: {
  redirectIfNotFound?: false;
  forceCheckOnboarding?: boolean;
}): Promise<UserSession | null>;
async function _getCurrentSession({ redirectIfNotFound = false, forceCheckOnboarding = true } = {}) {
  try {
    const { userId: clerkUserId, isAuthenticated } = await auth();

    if (!isAuthenticated || !clerkUserId) {
      if (redirectIfNotFound) {
        redirect(REDIRECT_URL);
      }

      return null;
    }

    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

    const clerkUser = await clerk.users.getUser(clerkUserId);

    const { role, userId } = clerkUser.publicMetadata as { role?: string; userId?: string };

    if (forceCheckOnboarding && (!role || !userId)) {
      redirect(ONBOARDING_REDIRECT_URL);
    }

    if (!forceCheckOnboarding) {
      return {
        id: userId ?? '',
        clerkId: clerkUserId,
        firstName: clerkUser.firstName ?? '',
        lastName: clerkUser.lastName ?? '',
        email: clerkUser.emailAddresses[0].emailAddress,
        role: (role as UserRole) ?? UserRole.CLIENT,
      };
    }

    return {
      id: userId,
      clerkId: clerkUserId,
      firstName: clerkUser.firstName ?? '',
      lastName: clerkUser.lastName ?? '',
      email: clerkUser.emailAddresses[0].emailAddress,
      role: role as UserRole,
    };
  } catch {
    if (redirectIfNotFound) {
      redirect(REDIRECT_URL);
    }

    return null;
  }
}

export const getCurrentSession = cache(_getCurrentSession);

function _getCurrentToken(options: { redirectIfNotFound: true }): Promise<string>;
function _getCurrentToken(options?: { redirectIfNotFound?: false }): Promise<string | null>;
async function _getCurrentToken({ redirectIfNotFound = false } = {}) {
  try {
    const { isAuthenticated, getToken } = await auth();

    if (!isAuthenticated) {
      if (redirectIfNotFound) {
        redirect(REDIRECT_URL);
      }

      return null;
    }

    return await getToken();
  } catch {
    if (redirectIfNotFound) {
      redirect(REDIRECT_URL);
    }

    return null;
  }
}

export const getCurrentToken = cache(_getCurrentToken);

export async function completeOnboardingAction(data: RegisterUserRequest) {
  const registerUserResponse = await safeAction(async () => registerUser(data));

  if (!registerUserResponse.success) {
    return registerUserResponse;
  }

  return safeAction(async () => {
    const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

    await clerk.users.updateUserMetadata(data.clerkId, {
      publicMetadata: {
        userId: registerUserResponse.data.userId,
        role: data.role,
      },
    });
  });
}

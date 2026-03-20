import crypto from 'crypto';
import userRepository from '../repositories/userRepository.js';
import { generateToken } from '../utils/common/authUtils.js';
import { addMailJob } from '../producers/mailQueueProducer.js';
import ClientError from '../utils/errors/ClientError.js';
import serverConfig from '../config/serverConfig.js';

const userService = {
  async signup(data) {
    const { name, email, password } = data;

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ClientError('DuplicateEmail', 'An account with this email already exists', 409);
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await userRepository.create({
      name,
      email,
      password,
      emailVerificationToken,
    });

    const verifyUrl = `${serverConfig.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

    await addMailJob({
      to: email,
      subject: 'Verify your Golf Charity account',
      html: `
        <h2>Welcome to Golf Charity Platform, ${name}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyUrl}" style="background:#c9a227;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token };
  },

  async signin(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new ClientError('InvalidCredentials', 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ClientError('InvalidCredentials', 'Invalid email or password', 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        selectedCharity: user.selectedCharity,
        charityContributionPercent: user.charityContributionPercent,
        subscriptionId: user.subscriptionId,
      },
      token,
    };
  },

  async getMe(userId) {
    return userRepository.findById(userId, {
      populate: [
        { path: 'selectedCharity', select: 'name description images' },
        { path: 'subscriptionId', select: 'status plan nextRenewalDate amount' },
      ],
    });
  },

  async updateProfile(userId, data) {
    const allowed = ['name', 'charityContributionPercent', 'selectedCharity'];
    const update = {};
    for (const key of allowed) {
      if (data[key] !== undefined) update[key] = data[key];
    }

    if (update.charityContributionPercent !== undefined) {
      if (update.charityContributionPercent < 10 || update.charityContributionPercent > 100) {
        throw new ClientError('InvalidInput', 'Charity contribution must be between 10% and 100%', 400);
      }
    }

    return userRepository.update(userId, update);
  },

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.update(user._id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });

    const resetUrl = `${serverConfig.FRONTEND_URL}/reset-password?token=${token}`;

    await addMailJob({
      to: email,
      subject: 'Reset your Golf Charity password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="background:#c9a227;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  },

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new ClientError('InvalidToken', 'Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  },

  async verifyEmail(token) {
    const user = await userRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new ClientError('InvalidToken', 'Invalid verification token', 400);
    }
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    return { message: 'Email verified successfully' };
  },
};

export default userService;

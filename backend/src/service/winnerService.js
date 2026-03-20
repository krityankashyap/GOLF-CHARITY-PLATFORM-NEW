import winnerRepository from '../repositories/winnerRepository.js';
import ClientError from '../utils/errors/ClientError.js';

const winnerService = {
  async getMyWins(userId) {
    return winnerRepository.findByUserId(userId);
  },

  async uploadProof(winnerId, userId, proofUrl) {
    const winner = await winnerRepository.findById(winnerId);

    if (winner.userId.toString() !== userId.toString()) {
      throw new ClientError('Forbidden', 'You can only upload proof for your own wins', 403);
    }

    return winnerRepository.update(winnerId, {
      proofUrl,
      proofUploadedAt: new Date(),
    });
  },

  async getPublicWinners() {
    return winnerRepository.findPublicWinners();
  },

  async getAllWinners(page, limit, filter) {
    return winnerRepository.findAllPaginated(page, limit, filter);
  },

  async verifyWinner(winnerId, status, adminNote) {
    if (!['approved', 'rejected'].includes(status)) {
      throw new ClientError('InvalidStatus', 'Status must be approved or rejected', 400);
    }

    const update = { verificationStatus: status };
    if (adminNote) update.adminNote = adminNote;

    return winnerRepository.update(winnerId, update);
  },

  async markAsPaid(winnerId) {
    const winner = await winnerRepository.findById(winnerId);
    if (winner.verificationStatus !== 'approved') {
      throw new ClientError(
        'NotVerified',
        'Winner must be approved before marking as paid',
        400
      );
    }

    return winnerRepository.update(winnerId, {
      paymentStatus: 'paid',
      paidAt: new Date(),
    });
  },
};

export default winnerService;

import { AuctionsRepository } from '../../infrastructure/repository/Auctions';

export class AuctionsUseCase {
  constructor() {
    this.auctionsRepository = new AuctionsRepository();
  }

  async createAuction(auctionData) {    
    if (!auctionData.title || !auctionData.description || !auctionData.startingPrice || !auctionData.endTime || !auctionData.createdBy) {
      throw new Error('Missing required auction fields');
    }

    return await this.auctionsRepository.createAuction(auctionData);
  }

  async getAuctions(filters) {
    return await this.auctionsRepository.getAuctions(filters);
  }

  async getBidHistory(uid) {
    return await this.auctionsRepository.getBidHistory(uid);
  }

  async getAuctionsByUser(uid) {
    return await this.auctionsRepository.getAuctionsByUser(uid);
  }

  async updateAuction(id, updateData) {
    if (!id) {
      throw new Error('Auction ID is required');
    }

    return await this.auctionsRepository.updateAuction(id, updateData);
  }

  async deleteAuction(id) {
    if (!id) {
      throw new Error('Auction ID is required');
    }

    return await this.auctionsRepository.deleteAuction(id);
  }

  async placeBid(auctionId, bidAmount, uid) {
    const auction = await this.auctionsRepository.getAuction(auctionId);
    
    if (new Date(auction.endTime) < new Date()) {
      throw new Error('Auction has ended');
    }

    if (bidAmount <= 0) {
      throw new Error('Bid must be greater than 0');
    }

    if (uid === auction.createdBy) {
      throw new Error('You cannot bid on your own auction');
    }

    if (uid === auction.currentBidder) {
      throw new Error('You are already winning this auction');
    }

    if (bidAmount >= auction.currentBid) {
      throw new Error('Bid must be lower than current bid');
    }

    const currentHistory = Array.isArray(auction.history) ? auction.history : [];

    return await this.auctionsRepository.updateAuction(auctionId, {
      currentBid: bidAmount,
      bids: auction.bids + 1,
      currentBidder: uid,
      history: [...currentHistory, { [uid]: {lastBid: bidAmount} }]
    });
  }
}

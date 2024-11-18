import { ref, push, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../database/firebase';

export class AuctionsRepository {
  constructor() {
    this.ref = ref(db, 'auctions');
  }

  async createAuction(auctionData) {
    try {
      const newAuctionRef = push(this.ref);
      const auction = {
        ...auctionData,
        createdAt: new Date().toISOString(),
        bids: 0,
        currentBid: auctionData.startingPrice,
        createdBy: auctionData.createdBy,
      };
      await update(newAuctionRef, auction);
      return { id: newAuctionRef.key, ...auction };
    } catch (error) {
      throw new Error('Error creating auction: ' + error.message);
    }
  }

  async getAuctions(filters = {}) {
    try {
      let queryRef = this.ref;
      
      if (filters.category) {
        queryRef = query(this.ref, 
          orderByChild('category'), 
          equalTo(filters.category)
        );
      }
      
      if (filters.status === 'ending-soon') {
        const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        queryRef = query(this.ref,
          orderByChild('endTime'),
          equalTo(twentyFourHoursFromNow)
        );
      }

      const snapshot = await get(queryRef);
      if (!snapshot.exists()) return [];
      
      const auctions = []; 
      snapshot.forEach((childSnapshot) => {
        auctions.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      return auctions;
    } catch (error) {
      throw new Error('Error fetching auctions: ' + error.message);
    }
  }

  async getAuction(id) {
    const snapshot = await get(ref(db, `auctions/${id}`));
    return snapshot.exists() ? { id: snapshot.key, ...snapshot.val() } : null;
  }

  async getBidHistory(uid) {
    try {
      const snapshot = await get(this.ref);
      if (!snapshot.exists()) return [];
      
      const auctions = [];
      snapshot.forEach((childSnapshot) => {
        const auctionData = childSnapshot.val();
        
        if (auctionData.history && Array.isArray(auctionData.history)) {
          const userHasBid = auctionData.history.some(entry => entry[uid]);
          if (userHasBid) {
            auctions.push({
              id: childSnapshot.key,
              ...auctionData
            });
          }
        }
      });
      return auctions;
    } catch (error) {
      throw new Error('Error fetching auction history: ' + error.message);
    }
  }

  async getAuctionsByUser(uid) {
    try {
      const snapshot = await get(this.ref);
      if (!snapshot.exists()) return [];

      const auctions = [];
      snapshot.forEach((childSnapshot) => {
        const auctionData = childSnapshot.val();
        if (auctionData.createdBy === uid) {
          auctions.push({ id: childSnapshot.key, ...auctionData });
        }
      });
      return auctions;
    } catch (error) {
      throw new Error('Error fetching auctions by user: ' + error.message);
    }
  }

  async updateAuction(id, updateData) {
    try {
      const auctionRef = ref(db, `auctions/${id}`);
      await update(auctionRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      throw new Error('Error updating auction: ' + error.message);
    }
  }

  async deleteAuction(id) {
    try {
      const auctionRef = ref(db, `auctions/${id}`);
      await remove(auctionRef);
      return true;
    } catch (error) {
      throw new Error('Error deleting auction: ' + error.message);
    }
  }
}

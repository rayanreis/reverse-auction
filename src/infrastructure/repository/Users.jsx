import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser,
    sendPasswordResetEmail
} from 'firebase/auth';
import { ref, push, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { db, auth } from '../database/firebase/firebase';

export class UsersRepository {  

    async createUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUserProfile(uid) {
        try {
            const userRef = ref(db, `users/${uid}`);
            const userSnapshot = await get(userRef);
            return userSnapshot.val();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUser(displayName, photoURL) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user is signed in');
            
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async logoutUser() {
        try {
            await signOut(auth);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteUserAccount() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user is signed in');
            await deleteUser(user);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    getCurrentUser() {
        return auth.currentUser;
    }
}

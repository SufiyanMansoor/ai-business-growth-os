import admin from 'firebase-admin';

let db = null;

export function initFirebase() {
  if (admin.apps.length) return db;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    } else {
      console.warn('Firebase Admin not configured — using in-memory storage');
      return null;
    }
    db = admin.firestore();
    return db;
  } catch (error) {
    console.warn('Firebase init failed:', error.message);
    return null;
  }
}

export function getFirestore() {
  if (!db) initFirebase();
  return db;
}

export async function saveDocument(collection, docId, data) {
  const firestore = getFirestore();
  if (!firestore) return { id: docId, ...data };
  await firestore.collection(collection).doc(docId).set(data, { merge: true });
  return { id: docId, ...data };
}

export async function getDocument(collection, docId) {
  const firestore = getFirestore();
  if (!firestore) return null;
  const doc = await firestore.collection(collection).doc(docId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

export async function queryCollection(collection, filters = []) {
  const firestore = getFirestore();
  if (!firestore) return [];
  let query = firestore.collection(collection);
  for (const [field, op, value] of filters) {
    query = query.where(field, op, value);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export { admin };

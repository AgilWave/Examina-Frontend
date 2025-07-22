import { openDB } from 'idb';

const DB_NAME = 'examina-offline';
const DB_VERSION = 2;
const ANSWERS_STORE = 'answers';
const VIOLATIONS_STORE = 'violations';
const MEDIA_STORE = 'media';
const VIDEO_CHUNKS_STORE = 'videoChunks';

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ANSWERS_STORE)) {
        db.createObjectStore(ANSWERS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(VIOLATIONS_STORE)) {
        db.createObjectStore(VIOLATIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(VIDEO_CHUNKS_STORE)) {
        db.createObjectStore(VIDEO_CHUNKS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// --- ANSWERS ---
export async function saveAnswerOffline(answer: any) {
  const db = await getDB();
  await db.add(ANSWERS_STORE, { ...answer, savedAt: Date.now() });
}

export async function getOfflineAnswers() {
  const db = await getDB();
  return db.getAll(ANSWERS_STORE);
}

export async function clearOfflineAnswers() {
  const db = await getDB();
  const tx = db.transaction(ANSWERS_STORE, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// --- VIOLATIONS ---
export async function saveViolationOffline(violation: any) {
  const db = await getDB();
  await db.add(VIOLATIONS_STORE, { ...violation, savedAt: Date.now() });
}

export async function getOfflineViolations() {
  const db = await getDB();
  return db.getAll(VIOLATIONS_STORE);
}

export async function clearOfflineViolations() {
  const db = await getDB();
  const tx = db.transaction(VIOLATIONS_STORE, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// --- MEDIA (camera/screen blobs) ---
export async function saveMediaOffline(media: { type: 'camera' | 'screen', blob: Blob, meta?: any }) {
  const db = await getDB();
  await db.add(MEDIA_STORE, { ...media, savedAt: Date.now() });
}

export async function getOfflineMedia() {
  const db = await getDB();
  return db.getAll(MEDIA_STORE);
}

export async function clearOfflineMedia() {
  const db = await getDB();
  const tx = db.transaction(MEDIA_STORE, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

// --- VIDEO CHUNKS (for MediaRecorder) ---
export async function saveVideoChunkOffline(chunk: { type: 'camera' | 'screen', blob: Blob, meta?: any }) {
  const db = await getDB();
  await db.add(VIDEO_CHUNKS_STORE, { ...chunk, savedAt: Date.now() });
}

export async function getOfflineVideoChunks() {
  const db = await getDB();
  return db.getAll(VIDEO_CHUNKS_STORE);
}

export async function clearOfflineVideoChunks() {
  const db = await getDB();
  const tx = db.transaction(VIDEO_CHUNKS_STORE, 'readwrite');
  await tx.store.clear();
  await tx.done;
} 
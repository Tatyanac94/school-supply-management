import { collection, getDocs, addDoc } from "firebase/firestore";

/**
 * Utility Function that gets all documents from a firestore database and returns an array of objects
 * @param {database instance} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore db collection
 * @returns {array}
 * @returns an array of objects
 */
async function getAllDocuments(db, collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const documents = [];

  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });

  console.log(documents);

  return documents;
}

/**
 * Utility Function that adds a document to a Google Cloud Firestore Database
 * @param {database instance} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore db collection
 * @param {object} data An object representing a collection document
 */
async function addDocument(db, collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export { getAllDocuments, addDocument };
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Utility Function that gets all documents from a Firestore collection
 * @param {object} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore collection
 * @returns {array} An array of objects representing documents
 */
async function getAllDocuments(db, collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Documents from collection", collectionName, documents);
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

/**
 * Utility Function that adds a document to a Firestore collection
 * @param {object} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore collection
 * @param {object} data An object representing the document data to add
 */
async function addDocument(db, collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

/**
 * Utility Function that updates a document in a Firestore collection
 * @param {object} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore collection
 * @param {string} id The document ID to update
 * @param {object} data An object representing the updated data
 */
async function updateDocument(db, collectionName, id, data) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    console.log("Document updated with ID: ", id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
}

/**
 * Utility Function that deletes a document from a Firestore collection
 * @param {object} db An instance of a Cloud Firestore Database
 * @param {string} collectionName The name of a Firestore collection
 * @param {string} id The document ID to delete
 */
async function deleteDocument(db, collectionName, id) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
}

export { getAllDocuments, addDocument, updateDocument, deleteDocument };

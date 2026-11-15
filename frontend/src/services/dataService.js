import { API_URL } from "../config.js";
import { getAccessToken, refresh } from "./authService.js";

async function sendUploadRequest(file, token) {
  //δημιουργία formData σε κάθε κλήση
  const formData = new FormData();
  formData.append("myFile", file);
  return await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export async function uploadFiles(file) {
  try {
    let token = await getAccessToken();

    //έλεγχος για το token
    if (!token) {
      throw new Error("Δεν βρέθηκε νέο token. Παρακαλώ συνδεθείτε.");
    }
    let response = await sendUploadRequest(file, token);

    if (response.status === 401) {
      try {
        //καλείς το refresh για να πάρεις νέο token
        const newToken = await refresh();
        //εαν το refresh δεν επιστρέφει απευθείας το νέο token, τότε το παίρνεις από το getAccessToken.
        //Βεβαίωση ότι παίρνει string και όχι Object
        token =
          typeof newToken === "string" ? newToken : await getAccessToken();

        //έλεγχος του token
        if (!token) {
          throw new Error("Αποτυχία ανάκτησης νέου token.");
        }
        //ξανά δοκιμάζεις το upload
        response = await sendUploadRequest(file, token);
      } catch (err) {
        //αν αποτύχει το refresh, ξανά στέλνεις τον χρήστη για Login
        throw new Error("Η συνεδρία έληξε. Παρακαλώ συνδεθείτε ξανά.");
      }
    }

    if (!response.ok) {
      throw new Error(`Το upload απέτυχε με status: ${response.status}`);
    }

    //Ασφαλής ανάγνωση της απάντησης
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    //επιστροφή απάντησης στο front end
    return await response.text();
  } catch (error) {
    console.error("Error uploading file", error);
    throw error; //προωθε'ι το σφάλμα στο component για να το διαχειριστεί στο UI
  }
}

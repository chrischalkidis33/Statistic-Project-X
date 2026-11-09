import { API_URL } from "../config.js";

export async function uploadFiles(file) {
  const formData = new FormData();
  formData.append("myFile", file);
  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Το upload απέτυχε με status: ${response.status}`);
    }
    //επιστροφή απάντησης στο front end
    return await response.json();
  } catch (error) {
    console.error("Error uploading file", error);
    throw error; //προωθε'ι το σφάλμα στο component για να το διαχειριστεί στο UI
  }
}

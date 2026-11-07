import ExcelJS from "exceljs";
//import path from "path";
import fs from "fs/promises";
import { Pool } from "pg";

/**
 * Επεξεργάζεται τα uploaded excel αρχεία
 * @param {Array} files - Τα αρχεία xlsx από το Multer(req.files)
 * @param {Object} user - ο χρήστης από το authMiddleware(req.user)
 */
async function uploadFiles(files, user) {
  const result = [];
  for (const file of files) {
    try {
      //Διαβάζουμε το αρχείο excel
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.path);

      //παίρνουμε το πρώτο sheet
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error(
          `Το αρχείο ${file.originalname} δεν έχει φύλλα εργασίας`,
        );
      }

      //μετατροπή σε πίνακα αντικειμένων
      //υποθέτουμε ότι η πρώτη γραμμή είναι οι κεφαλίδες των δεδομένων μας
      const data = [];
      const headers = [];

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) {
          //κεφαλίδες αρχείου
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            headers[colNumber] =
              cell.value?.toString()?.trim() || `col_${colNumber}`;
          });
        } else {
          //δεδομένα αρχείου
          const rowData = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            //includeEmpty: true για να συμπεριλάβει και τα κενά κελιά
            const header = headers[colNumber];
            let cellValue = cell.value;
            if (header) {
              if (typeof cellValue === "object") {
                cellValue = cellValue.result;
              } else if (cellValue.text !== undefined) {
                cellValue = cellValue.text;
              }
            }
            rowData[header] = cellValue !== undefined ? cellValue : null;
          });
          data.push(rowData);
        }
      });
      /** Αυτήν την μορφή θα έχουν οι πίνακες με την εκτέλεση του παραπάνω κώδικα μετά από διάβασμα ενός αρχείου excel
       *  const headers = {
            1: "Όνομα",
            2: "Ηλικία",
            3: "Πόλη"
          };

          const data = [
          {
            "Όνομα": "Γιάννης",
            "Ηλικία": 28,
            "Πόλη": "Αθήνα",
            "Site": null          // <-- Λόγω του includeEmpty: true και του ελέγχου για undefined
          },
          {
            "Όνομα": "Μαρία",
            "Ηλικία": 34,          // <-- Πήρε το cellValue.result από τη φόρμουλα
            "Πόλη": null,         // <-- Λόγω του includeEmpty: true
            "Site": "Link"         // <-- Πήρε το cellValue.text από τον υπερσύνδεσμο
          }
        ];
       * 
       */

      // Εδώ μπορείς να κάνεις ό,τι θέλεις:
      // - να τα αποθηκεύσεις στη βάση

      // - να τα επεξεργαστείς μέσα από την βάση με την χρήση queries για μεγαλύτερη ταχύτητα
      // - κλπ

      result.push({
        originalName: file.originalname,
        saveAs: file.filename,
        size: file.size,
        rows: data.length,
        //data, //αν θες να επιστρέψεις και τα δεδομένα
      });
    } finally {
      await fs.unlink(file.path).catch(() => {});
    }
  }
  return result;
}

export { uploadFiles };

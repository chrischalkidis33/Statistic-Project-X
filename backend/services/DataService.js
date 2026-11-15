import ExcelJS from "exceljs";
import path from "path";
import fs from "fs/promises";
import {
  insertData,
  totalRevenue,
  sumOrder,
  avgRevenueOrders,
  bestClient,
} from "../utils/dataCalculation";

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
      const ext = path.extname(file.originalname).toLowerCase();

      if (ext === ".csv") {
        await workbook.csv.readFile(file.path);
      } else if (ext === ".xlsx") {
        await workbook.xlsx.readFile(file.path);
      } else {
        throw new Error(`Μη υποστηριζόμενο αρχείο: ${ext}`);
      }

      //παίρνουμε το πρώτο sheet
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error(
          `Το αρχείο ${file.originalname} δεν έχει φύλλα εργασίας`,
        );
      }

      //μετατροπή σε πίνακα αντικειμένων
      //υποθέτουμε ότι η πρώτη γραμμή είναι οι κεφαλίδες των δεδομένων μας
      const data = []; //τα δεδομένα του αρχείου
      const headers = []; //οι κεφαλίδες του βιβλίου

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) {
          //1. Διαβάζουμε μόνο τα κελιά της πρώτης γραμμής τα οποία έχουν τιμή
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const headerText = cell.value?.toString()?.trim();
            if (headerText) {
              headers[colNumber] = headerText;
            }
          });
        } else {
          //δεδομένα αρχείου
          const rowData = {};
          let hasAnyRealValue = false; //flag για αγνόηση κενών κελιών
          //2. Κάνουμε loop μόνο τις στήλες που που έχουν οριστεί στο header
          headers.forEach((header, colNumber) => {
            if (!header) return; //αγνούμε τυχόν ενδιάμεσες κενές στήλες

            //Ζητάμε το κελί της συγκεκριμένης στήλης ακόμα και εάν είναι άδειο
            const cell = row.getCell(colNumber);
            let cellValue = cell.value;
            //3.Διαχείριση ειδικών αντικειμένων του ExcelJS (Τύποι, RichText, Ημερομηνίες)
            if (
              cellValue !== null &&
              cellValue !== undefined &&
              typeof cellValue === "object"
            ) {
              if (cellValue instanceof Date) {
                //Διατηρούμε την ημερομηνία ως έχει
                cellValue = cellValue.toLocaleDateString("el-GR");
              } else if (cellValue.result !== undefined) {
                //Περίπτωση μαθηματικού τύπου
                cellValue = cellValue.result;
              } else if (cellValue.text !== undefined) {
                //Περίπτωση Hyperlink ή απλού text object
                cellValue = cellValue.text;
              } else if (Array.isArray(cellValue.richText)) {
                //Περίπτωση μορφοποιημένου κειμένου (Rich Text)
                cellValue = cellValue.richText.map((rt) => rt.text).join("");
              } else {
                cellValue = "";
              }
            }
            //4. Έλεγχος αν το κελί είναι κενό και εφαρμογή της εξαίρεσης
            if (
              cellValue === null ||
              cellValue === undefined ||
              cellValue === ""
            ) {
              rowData[header] = " ";
            } else {
              rowData[header] = cellValue;
              hasAnyRealValue = true; // βρήκαμε έστω και μια πραγματική τιμή στην γραμμή
            }
          });

          //5. Αποθηκεύουμε την γραμμή ΜΟΝΟ αν έχει έστω και ένα κελί με πραγματική τιμή
          if (hasAnyRealValue) {
            data.push(rowData);
          }
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
      //η μεταβλητή data εχει όλα τα δεδομένα

      // - να τα επεξεργαστείς μέσα από την βάση με την χρήση queries για μεγαλύτερη ταχύτητα
      // - κλπ

      result.push({
        originalName: file.originalname,
        saveAs: file.filename,
        size: file.size,
        rows: data.length,
        data: data, //αν θες να επιστρέψεις και τα δεδομένα
      });
    } finally {
      await fs.unlink(file.path).catch(() => {});
    }
  }
  return result;
}

export { uploadFiles };

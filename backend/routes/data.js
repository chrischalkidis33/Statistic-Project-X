import { Router } from "express";
const dataRouter = Router();
import multer from "multer";
import path from "path";
import fs from "fs";
import { auth } from "../middleware/authMiddleware.js";
import { uploadFiles } from "../services/DataService.js";

//Δημιουργία του φακέλου Uploads εάν αυτός δεν υπάρχει
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Δημιουργία του αρχείου uploads και αποθήκευση των αρχείων που ανέβασε ο χρήστης
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); //δημιουργία του directory uploads
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname),
    );
  },
});

//Έλεγχος εάν ο χρήστης έχει ανεβάσει μόνο αρχείο xlsx η xls κλπ
const fileFilter = (req, file, cb) => {
  const allowed = /\.(xlsx|xls|xlsm)$/i;
  if (allowed.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("Μόνο αρχεία xlsx, xls και xlsm επιτρέπονται"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //10MB όριο μεγέθους για το αρχείο
});

//ορισμός του post endpoint για τα αιτήματα αποστολής αρχείου στην βάση
/**
 * POST /api/upload
 * Δέχεται ένα ή πολλά Excel αρχεία
 * Field name στο form-data: "files"
 */
dataRouter.post(
  "/api/upload",
  auth,
  upload.array("files", 5),
  async (req, res) => {
    try {
      //έλεγχος εάν το αρχείο δεν υπάρχει ή είναι κενό
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Δεν στάλθηκε κανένα αρχείο" });
      }

      //καλούμε το service για την αποθήκευση των δεδομένω στην βάση και ολόκληρης της δουλειάς για τα δεδομένα
      const result = await uploadFiles(req.files, req.user);

      return res.status(200).json({
        message: "Τα αρχεία ανέβηκαν με απιτυχία",
        files: result,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Σφάλμα κατά το ανέβασμα του αρχείου" });
    }
  },
);

export { dataRouter };

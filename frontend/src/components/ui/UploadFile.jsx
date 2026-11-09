import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, FileSpreadsheet, X } from "lucide-react";
import { uploadFiles } from "../../services/dataService";
import "./UploadFile.css";

export default function UploadFile({ isOpen, onClose }) {
  //στατε για την αποθήκευση του αρχείου
  const [dataFile, setDataFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  //μέθοδος που αποθηκέυουμε το αρχείο στο state
  function handleFileUpload(e) {
    if (e.target.files) {
      setDataFile(e.target.files[0]);
      setMessage("");
    }
  }

  async function onFileUpload() {
    if (!dataFile) {
      setMessage("Please select a file first");
      return;
    }

    try {
      await uploadFiles(dataFile);
      setMessage("Το αρχείο ανέβηκε με επιτυχία");
      setDataFile(null);
    } catch (error) {
      setMessage("Αποτυχία μεταφόρτωσης αρχείου.");
    } finally {
      setLoading(false);
    }
  }
  // Κλείσιμο με Escape + κλείδωμα του scroll της σελίδας
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal" onClick={onClose}>
      <section
        className="upload"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="upload__close"
          onClick={() => {
            onClose();
            setDataFile(null);
          }}
          aria-label="Κλείσιμο"
        >
          <X size={18} />
        </button>

        <header className="upload__head">
          <h2 id="upload-title" className="upload__title">
            Upload Excel
          </h2>
          <p className="upload__subtitle">
            {dataFile ? (
              <>
                <span>File name: {dataFile.name}</span>
                <span>Size: {(dataFile.size / 1024).toFixed(2)}KB</span>
                <span>Type: {dataFile.type}</span>
              </>
            ) : (
              "Ανέβασε ένα αρχείο για να ενημερωθούν τα στατιστικά του dashboard."
            )}
          </p>
        </header>

        <div className="upload__zone">
          <input
            id="upload-input"
            className="upload__input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
          />
          <label htmlFor="upload-input" className="upload__dropzone">
            <span className="upload__icon">
              <UploadCloud size={28} />
            </span>
            <span className="upload__text">
              {dataFile ? (
                dataFile.name
              ) : (
                <>
                  <span>Σύρε το αρχείο εδώ ή </span>
                  <span className="upload__link">
                    διάλεξε από τον υπολογιστή
                  </span>
                </>
              )}
            </span>
            <span className="upload__hint">.xlsx, .xls ή .csv · έως 10 MB</span>
          </label>
        </div>

        {/* <ul className="upload__files">
          <li className="upload__file">
            <span className="upload__file-icon">
              <FileSpreadsheet size={20} />
            </span>

            <div className="upload__file-info">
              <p className="upload__file-name">sales_2026.xlsx</p>
              <p className="upload__file-meta">248 KB · 64%</p>
              <div className="upload__progress">
                <div
                  className="upload__progress-bar"
                  style={{ width: "64%" }}
                />
              </div>
            </div>

            <button
              className="upload__remove"
              aria-label="Αφαίρεση αρχείου"
              onClick={() => setDataFile(null)}
            >
              <X size={16} />
            </button>
          </li>
        </ul> */}

        <footer className="upload__actions">
          <button
            className="upload__btn upload__btn--ghost"
            onClick={() => {
              onClose();
              setDataFile(null);
            }}
          >
            Ακύρωση
          </button>
          <button
            className="upload__btn upload__btn--primary"
            onClick={onFileUpload}
          >
            Upload
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}

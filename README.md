# Statistic Project X

Full-stack εφαρμογή για ανάλυση δεδομένων από αρχεία Excel. Ο χρήστης κάνει εγγραφή / σύνδεση, ανεβάζει ένα αρχείο Excel (π.χ. έσοδα, πωλήσεις) και επιλέγει δυναμικά ποια στατιστικά θέλει να δει σε ένα dashboard.

> Κατάσταση: σε ενεργή ανάπτυξη 🚧

## Περιεχόμενα

- [Λειτουργίες](#λειτουργίες)
- [Τεχνολογίες](#τεχνολογίες)
- [Δομή έργου](#δομή-έργου)
- [Εγκατάσταση](#εγκατάσταση)
- [Μεταβλητές περιβάλλοντος](#μεταβλητές-περιβάλλοντος)
- [Μορφή αρχείου Excel](#μορφή-αρχείου-excel)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

## Λειτουργίες

- **Authentication**: εγγραφή και σύνδεση χρήστη (σελίδα Sign in / Sign up με εναλλαγή).
- **Upload Excel**: ανέβασμα αρχείων με δεδομένα εσόδων / πωλήσεων.
- **Δυναμικά στατιστικά**: ο χρήστης επιλέγει τι θέλει να δει, για παράδειγμα:
  - έσοδα ανά περιοχή
  - έσοδα ανά κατηγορία προϊόντος
  - έσοδα ανά μήνα
- **Dashboard**: top menu, αριστερό sidebar, κεντρική περιοχή στατιστικών και footer.
- **Responsive σχεδιασμός** για desktop, tablet και κινητό.

## Τεχνολογίες

| Τομέας | Τεχνολογία |
| --- | --- |
| Frontend | React |
| Styling | CSS (CSS variables, light theme) |
| Backend | Node.js **ή** Python — _να συμπληρωθεί με την τελική επιλογή_ |
| Authentication | _να συμπληρωθεί (π.χ. JWT)_ |
| Βάση δεδομένων | _να συμπληρωθεί_ |
| Hosting | VPS |
| CI/CD | GitHub Actions |

## Δομή έργου

_Προσαρμόστε το στη δική σας δομή:_

```
statistic-project-x/
├── frontend/        # React εφαρμογή
├── backend/         # API (auth, upload, στατιστικά)
├── .github/
│   └── workflows/   # GitHub Actions (deploy)
└── README.md
```

## Εγκατάσταση

### Προαπαιτούμενα

- Node.js (έκδοση LTS) και npm
- _Python 3.x, αν το backend είναι σε Python_
- Git

### Βήματα

```bash
# 1. Κλωνοποίηση
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>

# 2. Backend
cd backend
npm install            # ή: pip install -r requirements.txt
cp .env.example .env   # συμπληρώστε τις τιμές
npm run dev            # ή η αντίστοιχη εντολή εκκίνησης

# 3. Frontend (σε νέο τερματικό)
cd frontend
npm install
npm run dev
```

Το frontend τρέχει στο `http://localhost:5173` (αν χρησιμοποιείται Vite) και το backend στη θύρα που ορίζεται στο `.env`.

## Μεταβλητές περιβάλλοντος

Δημιουργήστε αρχείο `.env` στον φάκελο `backend/`:

```env
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
```

> Μην ανεβάζετε ποτέ το `.env` στο GitHub. Προσθέστε το στο `.gitignore`.

## Μορφή αρχείου Excel

Το αρχείο πρέπει να περιέχει στήλες που η εφαρμογή αναγνωρίζει, για παράδειγμα:

| Ημερομηνία | Περιοχή | Κατηγορία προϊόντος | Έσοδα |
| --- | --- | --- | --- |
| 2026-01-15 | Θεσσαλονίκη | Ρούχα | 1250.00 |

_Προσαρμόστε τις στήλες στις πραγματικές που υποστηρίζει η εφαρμογή._

## Deployment

Η εφαρμογή γίνεται deploy σε VPS. Με κάθε push στο `main`, το GitHub Actions workflow (`.github/workflows/`) εκτελείται αυτόματα και ενημερώνει τον server.

Τα απαραίτητα secrets (π.χ. διεύθυνση server, SSH key) ορίζονται στο **Settings → Secrets and variables → Actions** του repository.

## Roadmap

- [x] Σελίδα Sign in / Sign up
- [x] Layout dashboard
- [ ] Σύνδεση frontend με το API
- [ ] Upload και ανάγνωση αρχείων Excel
- [ ] Δυναμική επιλογή στατιστικών και γραφήματα
- [ ] Deployment σε VPS
- [ ] CI/CD με GitHub Actions

## Συγγραφέας

**Chris** — Freelance Web Developer, Θεσσαλονίκη

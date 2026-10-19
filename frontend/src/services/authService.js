const API = "http://localhost:5000/api";
// Το access token μένει σε ref: δεν χρειάζεται να ξανα-ζωγραφίζει
// τα components όταν αλλάζει, και δεν αποθηκεύεται πουθενά μόνιμα.
// Το access token ζει μόνο στην μνήμη του module
let accessToken = null;

function getAccessToken() {
  return accessToken;
}

//Μια κοινή συνάρτηση για όλα τα requests
async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "aplication/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    credentials: "include", //στέλνει/δέχεται το refresh cookie
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.message ?? "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}

// Η μέθοδος που αφορά το Login
export async function login(email, password) {
  const data = await request("/login", {
    method: "POST",
    body: { email, password },
  });
  accessToken = data.accessToken;
  return data.user;
}

//Η μέθοδος που αφορά το Register
export async function register({
  email,
  password,
  first_name,
  last_name,
  company_name,
  location,
}) {
  return await request("/register", {
    method: "POST",
    body: { email, password, first_name, last_name, company_name, location },
  });
}

//Ακόμα δεν έχω route στο backend για το Logout. Θα γίνει αργότερα
// export async function logout() {
//   try {
//     await request("/logout", { method: "POST" });
//   } finally {
//     accessToken = null; // ό,τι κι αν γίνει, ξεχνάμε το token
//   }
// }

//Η μέθοδος για το refresh. Εκτελείτε στην εκκίνηση της εφαρμογής
export async function refresh() {
  try {
    const data = await request("/refresh", { method: "POST" });
    accessToken = data.accessToken;
    return data.user;
  } catch (err) {
    accessToken = null;
    if (err.status === 401) return null; // απλά δεν έχει session
    throw err;
  }
}

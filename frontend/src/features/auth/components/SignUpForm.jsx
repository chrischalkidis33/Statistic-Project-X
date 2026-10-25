import { useState } from "react";
import FormField from "../../../components/ui/FormField";
//εισαγωγη του custom hook για πρόσβαση στον provider
import { register } from "../../../services/authService";

export default function SignUpForm({ onSwitch }) {
  //δεδομένα για την διαχείριση του register
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [companyName, setCompanyName] = useState();
  const [location, setLocation] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: διασύνδεση με το API (δική σου υλοποίηση)
    const msg = await register({
      email,
      password,
      fullName,
      companyName,
      location,
    });
    if (msg) console.log("Succesfull registration");
  };

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <header className="auth__header">
        <h1>Create account</h1>
        <p>Start analysing your data in minutes.</p>
      </header>

      <FormField
        id="signup-name"
        label="Full name"
        name="fullName"
        placeholder="Your name"
        autoComplete="name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <FormField
        id="signup-email"
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="field-group">
        <FormField
          id="signup-password"
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FormField
          id="signup-confirm"
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <FormField
        id="signup-name"
        label="Company name"
        name="companyName"
        placeholder="Your company name"
        autoComplete="company"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />

      <FormField
        id="signup-name"
        label="Location"
        name="location"
        placeholder="Your location"
        autoComplete="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <label className="check">
        <input type="checkbox" name="acceptTerms" required />
        <span>
          I agree to the{" "}
          <a href="#" className="link">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="link">
            Privacy Policy
          </a>
        </span>
      </label>

      <button type="submit" className="btn">
        Create account
      </button>

      <p className="auth__switch">
        Already have an account?{" "}
        <button type="button" className="link" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </form>
  );
}

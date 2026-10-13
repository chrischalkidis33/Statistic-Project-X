import FormField from "../../../components/ui/FormField";

export default function SignUpForm({ onSwitch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: διασύνδεση με το API (δική σου υλοποίηση)
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
        required
      />

      <FormField
        id="signup-email"
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
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

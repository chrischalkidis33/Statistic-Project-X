import FormField from "../../../components/ui/FormField";

export default function SignInForm({ onSwitch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: διασύνδεση με το API (δική σου υλοποίηση)
  };

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <header className="auth__header">
        <h1>Welcome back</h1>
        <p>Sign in to access your dashboard.</p>
      </header>

      <FormField
        id="signin-email"
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
      />

      <FormField
        id="signin-password"
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      <div className="form-row">
        <label className="check">
          <input type="checkbox" name="rememberMe" />
          <span>Remember me</span>
        </label>
        <a href="#" className="link">
          Forgot password?
        </a>
      </div>

      <button type="submit" className="btn">
        Sign in
      </button>

      <p className="auth__switch">
        Don't have an account?{" "}
        <button type="button" className="link" onClick={onSwitch}>
          Sign up
        </button>
      </p>
    </form>
  );
}

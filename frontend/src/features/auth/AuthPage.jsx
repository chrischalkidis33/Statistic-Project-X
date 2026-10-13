import { useState } from "react";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'

  return (
    <main className="auth">
      {/* Brand panel: εμφανίζεται από 900px και πάνω */}
      <aside className="auth__aside">
        <div className="auth__logo">
          <span className="auth__logo-mark" aria-hidden="true" />
          <span className="auth__logo-text">Statistics</span>
        </div>
        <h2 className="auth__headline">
          Turn your spreadsheets into clear insights.
        </h2>
        <p className="auth__lead">
          Upload your Excel files and explore revenue by region, product and
          month in seconds.
        </p>
      </aside>

      <section className="auth__panel">
        <div className="auth__card">
          <div
            className="auth__tabs"
            role="tablist"
            aria-label="Authentication"
          >
            <button
              type="button"
              role="tab"
              id="tab-signin"
              aria-selected={mode === "signin"}
              aria-controls="panel-auth"
              className="auth__tab"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              id="tab-signup"
              aria-selected={mode === "signup"}
              aria-controls="panel-auth"
              className="auth__tab"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <div id="panel-auth" role="tabpanel" aria-labelledby={`tab-${mode}`}>
            {mode === "signin" ? (
              <SignInForm onSwitch={() => setMode("signup")} />
            ) : (
              <SignUpForm onSwitch={() => setMode("signin")} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

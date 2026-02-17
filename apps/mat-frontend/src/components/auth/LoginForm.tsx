/**
 * Login/Authentication Page Component
 * FRS: FR-030 (Authentication)
 * TRS: TR-011
 */
export function LoginForm() {
  return (
    <form className="login-form">
      <h2>Login</h2>
      <input type="email" placeholder="Email" aria-label="Email" />
      <input type="password" placeholder="Password" aria-label="Password" />
      <button type="submit">Sign In</button>
    </form>
  );
}

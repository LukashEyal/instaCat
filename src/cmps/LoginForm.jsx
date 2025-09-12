import React, { useState } from 'react';

export function LoginForm({ onSubmit }) {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // Wire this up to your auth logic
    onSubmit?.({ username: username.trim(), password });
  };

  return (
    <form className="login" onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="username">
        username
      </label>
      <input
        id="username"
        className="login__input"
        type="text"
        placeholder="Phone number, username, or email"
        value={username}
        onChange={(e) => setusername(e.target.value)}
        autoComplete="username"
        aria-required="true"
      />

      <label className="sr-only" htmlFor="password">
        Password
      </label>
      <div className="login__password">
        <input
          id="password"
          className="login__input"
          type={showPwd ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          aria-required="true"
        />
        <button
          type="button"
          className="login__toggle"
          onClick={() => setShowPwd((v) => !v)}
          aria-label={showPwd ? 'Hide password' : 'Show password'}
        >
          {showPwd ? 'Hide' : 'Show'}
        </button>
      </div>

      <button className="login__submit" type="submit" disabled={!canSubmit}>
        Log in
      </button>

    </form>
  );
}

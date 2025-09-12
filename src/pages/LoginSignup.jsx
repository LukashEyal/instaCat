import { CatStack } from "../cmps/CatStack,";
import { LoginForm  } from "../cmps/LoginForm";
import { SignUpCard } from "../cmps/SignUpCard";
import { ReactSVG } from "react-svg"
import { useState } from "react";
import { SignUpModal } from "../cmps/SignUpModal";


import { login } from "../store/user.actions";
import logo from "../assets/svgs/instacat-logo.svg"



export function LoginSignup() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const handleLogin = async ({ username, password }) => {
    try {
      await login({ username, password });
      // navigate("/homepage", { replace: true }); // if you want immediate redirect
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <main className="signin signin--split">
      <div className="signin__art">
        <CatStack />
      </div>

      <div className="signin__stack">
        <section className="signin__card" aria-labelledby="brand">
          <ReactSVG className="signin__logo" src={logo} />
          <LoginForm onSubmit={handleLogin} />
        </section>

        <SignUpCard onOpen={() => setIsSignUpOpen(true)} />
      </div>

      <SignUpModal open={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        {/* Replace with your real sign-up form */}
        {/* <SignUpForm /> */}
        <form onSubmit={(e) => { e.preventDefault(); /* do signup */ }}>
          <div className="field">
            <label htmlFor="su-username">Username</label>
            <input id="su-username" name="username" data-autofocus />
          </div>
          <div className="field">
            <label htmlFor="su-email">Email</label>
            <input id="su-email" type="email" name="email" />
          </div>
          <div className="field">
            <label htmlFor="su-password">Password</label>
            <input id="su-password" type="password" name="password" />
          </div>
          <button type="submit">Create account</button>
        </form>
      </SignUpModal>
    </main>
  );
}
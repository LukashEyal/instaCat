export function SignUpCard({ onOpen }) {
  return (
    <div className="signup">
      <p>
        Don&apos;t have an account?{" "}
        <button type="button" className="signup__link" onClick={onOpen}>
          Sign up
        </button>
      </p>
    </div>
  );
}
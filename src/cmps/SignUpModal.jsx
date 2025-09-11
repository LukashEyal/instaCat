// SignUpModal.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Signup } from "./SignUp.jsx"


export function SignUpModal({
  open,
  onClose,
  title = "Create your account",
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevFocused = document.activeElement;
    const panel = panelRef.current;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = panel.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden"; // lock scroll
    panel.addEventListener("keydown", onKeyDown);
    // focus the first [data-autofocus] input from Signup or fallback to panel
    setTimeout(() => panel.querySelector("[data-autofocus]")?.focus() || panel.focus(), 0);

    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      prevFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal" role="presentation">
      <div className="modal__overlay" onClick={onClose} />
      <section
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 id="signup-modal-title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className="modal__content">
          {/* Render the Signup form here. It will close the modal on success via onDone */}
          <Signup onDone={onClose} />
        </div>
      </section>
    </div>,
    document.body
  );
}

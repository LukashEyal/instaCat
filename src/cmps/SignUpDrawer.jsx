import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function SignUpDrawer({ open, onClose, title = "Create your account", children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevFocused = document.activeElement;
    const panel = panelRef.current;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = panel.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";        // lock scroll
    panel.addEventListener("keydown", onKeyDown);
    setTimeout(() => panel.querySelector("[data-autofocus]")?.focus() || panel.focus(), 0);

    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      prevFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="drawer">
      <div className="drawer__overlay" onClick={onClose} />
      <aside
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-drawer-title"
        ref={panelRef}
        tabIndex={-1}
      >
        <header className="drawer__header">
          <h2 id="signup-drawer-title">{title}</h2>
          <button className="drawer__close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="drawer__content">{children}</div>
      </aside>
    </div>,
    document.body
  );
}

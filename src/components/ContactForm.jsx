import { useState } from "react";
import emailjs from "@emailjs/browser";
import Button3 from "../Projects buttons/Button3";
import {
  floatingWrapper,
  floatingInput,
  floatingLabel,
} from "../styles/inlineStyle.js";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState(null);

  const showToastMessage = (message, type = "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (sending) return;

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // validation
    if (!name || !email || !message) {
      showToastMessage("Please fill all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showToastMessage("Please enter a valid email address.");
      return;
    }

    try {
      setSending(true);

      await emailjs.sendForm(
        "service_n6imiqa",
        "template_y223w7e",
        form,
        "_3Y8010StI4C0U46V",
      );

      form.reset();

      setSent(true);
      setShowToast(true);

      setTimeout(() => setSent(false), 2000);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "25px",
            padding: "14px 18px",
            borderRadius: "10px",
            background:
              toast.type === "error"
                ? "rgba(239,68,68,0.15)"
                : "rgba(34,197,94,0.15)",
            border:
              toast.type === "error"
                ? "1px solid rgba(239,68,68,0.4)"
                : "1px solid rgba(34,197,94,0.4)",
            color: toast.type === "error" ? "#ef4444" : "#22c55e",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            fontSize: "0.9rem",
            zIndex: 9999,
            animation: "toastSlide 0.4s ease",
          }}
        >
          {toast.message}
        </div>
      )}
      <form onSubmit={sendEmail} noValidate>
        {/* NAME */}
        <div style={floatingWrapper}>
          <input
            name="name"
            required
            style={floatingInput}
            onFocus={(e) => {
              e.target.style.border = "1px solid #22c55e";
              e.target.style.boxShadow = "0 0 14px rgba(34,197,94,0.5)";
              e.target.nextSibling.style.top = "6px";
              e.target.nextSibling.style.fontSize = "0.75rem";
              e.target.nextSibling.style.opacity = "0.9";
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.nextSibling.style.top = "50%";
                e.target.nextSibling.style.fontSize = "0.9rem";
                e.target.nextSibling.style.opacity = "0.6";
              }
              e.target.style.border = "1px solid rgba(255,255,255,0.18)";
              e.target.style.boxShadow = "none";
            }}
          />
          <label style={floatingLabel}>Your Name</label>
        </div>

        {/* EMAIL */}
        <div style={floatingWrapper}>
          <input type="text" name="company" style={{ display: "none" }} />
          <input
            name="email"
            type="email"
            required
            style={floatingInput}
            onFocus={(e) => {
              e.target.style.border = "1px solid #22c55e";
              e.target.style.boxShadow = "0 0 14px rgba(34,197,94,0.5)";
              e.target.nextSibling.style.top = "6px";
              e.target.nextSibling.style.fontSize = "0.75rem";
              e.target.nextSibling.style.opacity = "0.9";
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.nextSibling.style.top = "50%";
                e.target.nextSibling.style.fontSize = "0.9rem";
                e.target.nextSibling.style.opacity = "0.6";
              }
              e.target.style.border = "1px solid rgba(255,255,255,0.18)";
              e.target.style.boxShadow = "none";
            }}
          />
          <label style={floatingLabel}>Your Email</label>
        </div>

        {/* MESSAGE */}
        <div style={floatingWrapper}>
          <textarea
            name="message"
            rows="5"
            required
            style={floatingInput}
            onFocus={(e) => {
              e.target.style.border = "1px solid #22c55e";
              e.target.style.boxShadow = "0 0 14px rgba(34,197,94,0.5)";
              e.target.nextSibling.style.top = "6px";
              e.target.nextSibling.style.fontSize = "0.75rem";
              e.target.nextSibling.style.opacity = "0.9";
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.nextSibling.style.top = "50%";
                e.target.nextSibling.style.fontSize = "0.9rem";
                e.target.nextSibling.style.opacity = "0.6";
              }
              e.target.style.border = "1px solid rgba(255,255,255,0.18)";
              e.target.style.boxShadow = "none";
            }}
          />
          <label style={floatingLabel}>Your Message</label>
        </div>

        <Button3
          type="submit"
          disabled={sending}
          style={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            opacity: sending ? 0.8 : 1,
            pointerEvents: sending ? "none" : "auto",
          }}
        >
          {sending ? (
            <>
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Sending...
            </>
          ) : sent ? (
            <>✓ Message Sent</>
          ) : (
            <>Send Message →</>
          )}
        </Button3>
      </form>

      {showToast && (
        <div
          style={{
            marginTop: "1rem",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.4)",
            color: "#22c55e",
            fontSize: "0.9rem",
            animation: "fadeSlide 0.4s ease",
          }}
        >
          ✓ Message sent successfully — Thanks! I’ll respond within 24 hours.
        </div>
      )}
    </>
  );
}

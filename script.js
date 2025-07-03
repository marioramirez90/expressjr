// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
menuToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    navLinks.classList.toggle("active");
    e.preventDefault();
  }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    navLinks.classList.remove("active");
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "none";
  }
});

// Scroll animations mit längerer Dauer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document
  .querySelectorAll(
    ".hero-content, .hero p, .hero-buttons, .features, .pricing, .contact"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// Formular-Absende-Handling mit Animation der Erfolgsmeldung + Adressprüfung + Telefon Pflichtfeld + Popup

const form = document.getElementById("expressForm");
const successPopup = document.getElementById("successPopup");
const closeBtn = successPopup.querySelector(".close-btn");

function isValidAddress(addr) {
  // Einfache Prüfung: Adresse muss Straße, Hausnummer und PLZ enthalten (z.B. "Musterstrasse 12, 12345")
  // Dies ist sehr simpel, du kannst hier gerne eine API für echte Validierung nutzen
  const addressRegex = /\d{1,5}[a-zA-Z]?/;
  // Einfache Hausnummern-Erkennung
  const plzRegex = /\b\d{5}\b/;
  // Deutsche PLZ 5-stellig
  return addr && addressRegex.test(addr) && plzRegex.test(addr);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const requiredFields = [
    "abholadresse",
    "lieferadresse",
    "zeitfenster",
    "telefon",
  ];
  let isValid = true;

  // Reset all border colors
  requiredFields.forEach((name) => {
    form.elements[name].style.borderColor = "#2563eb";
  });

  // Validate required fields non empty
  requiredFields.forEach((name) => {
    const field = form.elements[name];
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444";
      isValid = false;
    }
  });

  // Spezielle Adressprüfung für Abholadresse und Lieferadresse
  const abhol = form.elements["abholadresse"].value.trim();
  const liefer = form.elements["lieferadresse"].value.trim();

  if (!isValidAddress(abhol)) {
    form.elements["abholadresse"].style.borderColor = "#ef4444";
    alert(
      "Bitte geben Sie eine gültige Abholadresse ein, inklusive Straße, Hausnummer und PLZ."
    );
    isValid = false;
  }

  if (!isValidAddress(liefer)) {
    form.elements["lieferadresse"].style.borderColor = "#ef4444";
    alert(
      "Bitte geben Sie eine gültige Lieferadresse ein, inklusive Straße, Hausnummer und PLZ."
    );
    isValid = false;
  }

  // Telefonnummer Prüfung (hier nur Mindestlänge + Zahlen, kann angepasst werden)
  const telefonValue = form.elements["telefon"].value.trim();
  const phoneRegex = /^[0-9+\s()-]{7,}$/;
  if (!phoneRegex.test(telefonValue)) {
    form.elements["telefon"].style.borderColor = "#ef4444";
    alert("Bitte geben Sie eine gültige Telefonnummer ein.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Daten für Email vorbereiten
  const zeit = form.elements["zeitfenster"].value.trim();
  const auftrag = form.elements["auftrag"].value.trim() || "Keine Angabe";
  const rechnung = form.elements["rechnung"].value.trim() || "Keine Angabe";

  const subject = encodeURIComponent("Neue Express-Lieferung Anfrage");
  const body = encodeURIComponent(
    `Abholadresse: ${abhol}\n` +
      `Lieferadresse: ${liefer}\n` +
      `Zeitfenster: ${zeit}\n` +
      `Auftrag: ${auftrag}\n` +
      `Rechnungsadresse: ${rechnung}\n` +
      `Telefon: ${telefonValue}`
  );

  // Mailclient öffnen
  window.location.href = `mailto:jaimeramirezjr@gmx.de?subject=<span class="math-inline" data-latex="%7Bsubject%7D%26body%3D">{subject}&body=</span>{body}`;

  // Popup anzeigen mit Animation
  successPopup.classList.add("show");
  successPopup.focus();

  // Nach 3 Sekunden Popup automatisch schließen
  const popupTimeout = setTimeout(() => {
    successPopup.classList.remove("show");
  }, 3000);

  // Schließen-Button Event
  closeBtn.onclick = () => {
    successPopup.classList.remove("show");
    clearTimeout(popupTimeout);
  };

  // Formular zurücksetzen
  form.reset();
});

// Shortcut: Button im Hero "Jetzt Anfragen" scrollt zum Formular
document.getElementById("btnRequest").addEventListener("click", (e) => {
  const formSection = document.getElementById("kontakt");
  if (formSection) {
    e.preventDefault();
    const headerOffset = 70;
    const elementPosition = formSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
});

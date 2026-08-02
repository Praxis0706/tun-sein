// Apps Script Web App URL — nach dem Deployment hier eintragen
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbw5jWFdl5frr5op2mCgMuK3sAsT19WvJ_YfOeCZFfoCU-yP45s92734E09kn_PtrWavLQ/exec";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kontaktformular");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      thema: form.thema.value,
      message: form.nachricht.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gesendet …";
    clearFormStatus(form);

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight to Apps Script
      body: JSON.stringify(data)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (result.result === "success") {
          showFormStatus(form, "success", "Vielen Dank! Ihre Anfrage wurde erfolgreich versendet.");
          form.reset();
        } else {
          showFormStatus(form, "error", "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt eine E-Mail.");
        }
      })
      .catch(function () {
        showFormStatus(form, "error", "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt eine E-Mail.");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });
});

function showFormStatus(form, type, message) {
  const status = document.createElement("p");
  status.className = "form-status form-status-" + type;
  status.textContent = message;
  form.appendChild(status);
}

function clearFormStatus(form) {
  const existing = form.querySelector(".form-status");
  if (existing) existing.remove();
}

// Prevent submission until the form is connected to a delivery service.
document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
});

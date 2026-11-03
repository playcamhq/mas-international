// Site-wide switches. Edit these, rebuild, redeploy.
window.MAS_CONFIG = {
  phoneDisplay: "+371 29 333 473",
  phoneE164: "37129333473",
  // Owner confirmed 2026-11-03: the same number is used for calls and WhatsApp.
  whatsappEnabled: true,
  // Where forms POST (JSON). Empty = forms hand off to WhatsApp: on submit, WhatsApp opens with the
  // filled-in details addressed to the number above, and the visitor taps Send. Set this to a form
  // service / API URL to receive submissions directly instead.
  formEndpoint: "",
};

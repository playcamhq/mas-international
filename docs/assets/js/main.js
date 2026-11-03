(() => {
  const cfg = window.MAS_CONFIG || {};
  const cats = window.MAS_CATEGORIES || [];
  const roles = window.MAS_ROLES || [];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const base = document.documentElement.dataset.base || ""; // set when hosted under a subpath (GitHub Pages)
  const icon = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  const STATUS = {
    open: { label: "Open vacancy", cls: "status-open" },
    paused: { label: "Paused", cls: "status-paused" },
    none: { label: "No verified vacancy yet", cls: "status-none" },
  };

  /* ---------- Mobile nav ---------- */
  const toggle = $("[data-nav-toggle]");
  const nav = $("#main-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
    document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    matchMedia("(min-width: 1181px)").addEventListener("change", () => setOpen(false));
  }

  /* ---------- Small globals ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  $$("[data-whatsapp]").forEach((el) => {
    if (!cfg.whatsappEnabled) return el.remove();
    el.hidden = false;
    el.href = `https://wa.me/${cfg.phoneE164}`;
    el.target = "_blank";
    el.rel = "noopener";
  });
  $$("[data-whatsapp-off]").forEach((el) => (el.hidden = !!cfg.whatsappEnabled));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add("is-visible"));

  /* ---------- Tabs ---------- */
  $$("[role=tablist]").forEach((list) => {
    const tabs = $$("[role=tab]", list);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus();
        select(next);
      });
    });
    const wanted = tabs.find((t) => location.hash && t.dataset.hash === location.hash.slice(1));
    if (wanted) select(wanted);
  });

  /* ---------- Category counts on home ---------- */
  $$("[data-cat-count]").forEach((el) => {
    el.textContent = `${roles.filter((r) => r.cat === el.dataset.catCount).length} roles`;
  });

  /* ---------- Role dropdowns ---------- */
  $$("select[data-role-select]").forEach((sel) => {
    cats.forEach((c) => {
      const g = document.createElement("optgroup");
      g.label = c.name;
      roles.filter((r) => r.cat === c.id).forEach((r) => g.append(new Option(r.title, r.id)));
      sel.append(g);
    });
    sel.append(new Option("Other / not listed", "other"));
    if (params.get("role")) sel.value = params.get("role");
  });

  /* ---------- Jobs page ---------- */
  const grid = $("#role-grid");
  if (grid) {
    const chipsWrap = $("#cat-filters");
    const search = $("#role-search");
    const count = $("#role-count");
    let active = params.get("cat") || "all";
    const chips = [{ id: "all", name: "All roles" }, ...cats];
    chipsWrap.innerHTML = chips
      .map((c) => `<button type="button" class="filter-chip" data-cat="${c.id}" aria-pressed="${c.id === active}">${c.name}</button>`)
      .join("");
    const render = () => {
      const q = (search.value || "").trim().toLowerCase();
      const list = roles.filter(
        (r) => (active === "all" || r.cat === active) && (!q || (r.title + " " + r.summary).toLowerCase().includes(q))
      );
      count.textContent = `${list.length} role${list.length === 1 ? "" : "s"}`;
      grid.innerHTML = list.length
        ? list.map((r) => {
            const c = cats.find((x) => x.id === r.cat);
            const s = STATUS[r.status] || STATUS.none;
            const cta = r.status === "open"
              ? `<a class="btn btn-saffron btn-sm" href="${base}/apply/?role=${r.id}">Apply now</a>`
              : `<a class="btn btn-outline btn-sm" href="${base}/apply/?role=${r.id}">Register interest</a>`;
            return `<article class="card role-card">
              <div class="role-head">
                <div><h3>${r.title}</h3><p class="role-cat">${c ? c.name : ""}</p></div>
                <span class="status ${s.cls}">${s.label}</span>
              </div>
              <p>${r.summary}</p>
              <div class="role-foot">
                <span class="small muted">${r.verified ? `Verified ${r.verified}` : "Details shown once a vacancy is verified"}</span>
                ${cta}
              </div>
            </article>`;
          }).join("")
        : `<div class="empty">No roles match that search. Try another word, or <a href="${base}/apply/">register your interest</a> anyway.</div>`;
    };
    chipsWrap.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      active = b.dataset.cat;
      $$("[data-cat]", chipsWrap).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      render();
    });
    search.addEventListener("input", render);
    render();

    const matrix = $("#verify-matrix");
    if (matrix) {
      matrix.innerHTML = cats.map((c) => `<article class="card cat-card">
        <div class="icon-badge">${icon(c.icon)}</div>
        <h3>${c.name}</h3>
        <ul class="chips">${roles.filter((r) => r.cat === c.id).map((r) => `<li class="chip">${r.title}</li>`).join("")}</ul>
        <div class="verify"><span class="verify-label">How we check</span><p>${c.verify}</p></div>
      </article>`).join("");
    }
  }

  /* ---------- Form → readable message (for the WhatsApp hand-off) ---------- */
  const FORM_TITLES = {
    "employer-request": "Workforce request",
    "employer-contact": "Employer enquiry",
    applicant: "Job application",
    "applicant-contact": "Applicant question",
  };
  const summarise = (form) => {
    const lines = [];
    const seen = new Set(["consent", "understand"]);
    $$("[name]", form).forEach((el) => {
      if (seen.has(el.name)) return;
      seen.add(el.name);
      const vals = $$(`[name="${el.name}"]`, form)
        .filter((x) => (x.type === "checkbox" || x.type === "radio" ? x.checked : x.value.trim() !== ""))
        .map((x) => (x.tagName === "SELECT" ? x.options[x.selectedIndex].text : x.value.trim()));
      if (!vals.length) return;
      const field = el.closest(".field");
      const labelEl = field ? $("label, .label", field) : el.closest(".check");
      const label = (labelEl ? labelEl.textContent : el.name).replace(/\*|\(.*?\)/g, "").replace(/\s+/g, " ").trim();
      lines.push(`${label}: ${vals.join(", ")}`);
    });
    return `${FORM_TITLES[form.dataset.form] || "Website enquiry"} (masconsultants.in)\n\n${lines.join("\n")}`;
  };

  /* ---------- Multi-step forms ---------- */
  $$("form[data-form]").forEach((form) => {
    const steps = $$(".form-step", form);
    const stepper = $$(".stepper li", form);
    const back = $("[data-back]", form);
    const next = $("[data-next]", form);
    const submit = $("[data-submit]", form);
    const success = form.parentElement.querySelector(".form-success");
    let i = 0;

    const show = (n) => {
      i = n;
      steps.forEach((s, k) => (s.hidden = k !== n));
      stepper.forEach((li, k) => {
        li.classList.toggle("active", k === n);
        li.classList.toggle("complete", k < n);
        if (k === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      if (back) back.hidden = n === 0;
      if (next) next.hidden = n === steps.length - 1;
      if (submit) submit.hidden = n !== steps.length - 1;
    };

    const validate = (scope) => {
      let firstBad = null;
      $$(".field", scope).forEach((f) => {
        const inputs = $$("input, select, textarea", f).filter((x) => x.type !== "hidden");
        let ok = true;
        if (inputs.some((x) => x.type === "checkbox" || x.type === "radio") && f.dataset.required === "group") {
          ok = inputs.some((x) => x.checked);
        } else {
          ok = inputs.every((x) => x.checkValidity());
        }
        f.classList.toggle("invalid", !ok);
        inputs.forEach((x) => x.setAttribute("aria-invalid", String(!ok)));
        if (!ok && !firstBad) firstBad = inputs[0];
      });
      $$("input[type=checkbox][required]", scope).forEach((x) => {
        const wrap = x.closest(".check");
        const ok = x.checked;
        wrap && wrap.classList.toggle("invalid-check", !ok);
        if (!ok && !firstBad) firstBad = x;
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    };

    form.addEventListener("input", (e) => {
      const f = e.target.closest(".field.invalid");
      if (f) validate(f.parentElement === form ? form : f);
    });
    next && next.addEventListener("click", () => {
      if (validate(steps[i])) { show(i + 1); form.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    back && back.addEventListener("click", () => show(i - 1));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate(steps[i] || form)) return;
      const data = Object.fromEntries(
        [...new FormData(form)].filter(([, v]) => !(v instanceof File)).reduce((m, [k, v]) => {
          m.set(k, m.has(k) ? `${m.get(k)}, ${v}` : v);
          return m;
        }, new Map())
      );
      data.formName = form.dataset.form;
      let sent = false;
      if (cfg.formEndpoint) {
        submit.disabled = true;
        submit.textContent = "Sending…";
        try {
          const res = await fetch(cfg.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          sent = res.ok;
        } catch { sent = false; }
        if (!sent) {
          submit.disabled = false;
          submit.textContent = "Try again";
          const err = $(".form-error", form) || Object.assign(document.createElement("p"), { className: "demo-note form-error", role: "alert" });
          err.textContent = `Sorry, that didn't go through. Please try again, or call us on ${cfg.phoneDisplay}.`;
          form.append(err);
          return;
        }
      }
      // No form service configured: hand the filled-in details to WhatsApp; the visitor taps Send there.
      const viaWhatsApp = !cfg.formEndpoint && !!cfg.whatsappEnabled;
      if (viaWhatsApp) window.open(`https://wa.me/${cfg.phoneE164}?text=${encodeURIComponent(summarise(form))}`, "_blank", "noopener");
      form.hidden = true;
      if (success) {
        success.hidden = false;
        $$("[data-wa-note]", success).forEach((n) => (n.hidden = !viaWhatsApp));
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
    if (steps.length) show(0);
  });

  /* ---------- Applicant language + read aloud ---------- */
  const langBtns = $$("[data-lang]");
  let lang = "en";
  if (langBtns.length) {
    const setLang = (l) => {
      lang = l;
      document.documentElement.lang = l === "hi" ? "hi" : "en";
      langBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
      $$("[data-hi]").forEach((el) => {
        if (!el.dataset.en) el.dataset.en = el.textContent;
        el.textContent = l === "hi" ? el.dataset.hi : el.dataset.en;
      });
      try { localStorage.setItem("mas-lang", l); } catch {}
    };
    langBtns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
    let saved = null;
    try { saved = localStorage.getItem("mas-lang"); } catch {}
    if (saved === "hi") setLang("hi");
  }

  const speakBtns = $$("[data-speak]");
  if (speakBtns.length) {
    if (!("speechSynthesis" in window)) speakBtns.forEach((b) => (b.hidden = true));
    else {
      speakBtns.forEach((b) => b.addEventListener("click", () => {
        const playing = b.getAttribute("aria-pressed") === "true";
        speechSynthesis.cancel();
        speakBtns.forEach((x) => x.setAttribute("aria-pressed", "false"));
        if (playing) return;
        const target = $(b.dataset.speak);
        if (!target) return;
        const u = new SpeechSynthesisUtterance(target.innerText);
        u.lang = lang === "hi" ? "hi-IN" : "en-IN";
        const v = speechSynthesis.getVoices().find((x) => x.lang === u.lang) || speechSynthesis.getVoices().find((x) => x.lang.startsWith(lang));
        if (v) u.voice = v;
        u.rate = 0.95;
        u.onend = u.onerror = () => b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-pressed", "true");
        speechSynthesis.speak(u);
      }));
    }
  }
})();

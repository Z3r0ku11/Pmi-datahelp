(() => {
  "use strict";

  const config = window.PMO_CONFIG || {};
  const loading = document.getElementById("loading");
  const loadingMessage = document.getElementById("loading-message");
  const error = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const dashboard = document.getElementById("dashboard");
  const environment = document.getElementById("environment");
  const logout = document.getElementById("logout");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const placeholder = document.getElementById("module-placeholder");
  const moduleTitle = document.getElementById("module-title");
  const moduleDescription = document.getElementById("module-description");
  const moduleNextStep = document.getElementById("module-next-step");
  const moduleIcon = document.getElementById("module-icon");
  const navItems = [...document.querySelectorAll("[data-view]")];
  const tokenKey = "pmo-auth-token";
  const verifierKey = "pmo-pkce-verifier";
  const stateKey = "pmo-oauth-state";
  let dashboardReady = false;
  let fatalError = "";

  const modules = {
    "portfolio-overview": {
      title: "PMO Portfolio Overview",
      subtitle: "Strategic Delivery | Portfolio Governance | Executive Decision Making",
      dashboard: true
    },
    "project-analysis": {
      title: "Project Analysis",
      subtitle: "Análisis individual y trazabilidad integral del proyecto",
      description: "Vista especializada para revisar salud, hitos, presupuesto, esfuerzo, riesgos y cumplimiento de cada proyecto.",
      nextStep: "Se conectará a un dashboard QuickSight individual cuando se defina su modelo de datos y diseño ejecutivo.",
      icon: "⌕"
    },
    "pm-analysis": {
      title: "Project Manager Analysis",
      subtitle: "Carga, complejidad y desempeño por responsable",
      description: "Panel para evaluar distribución de carga, peso del portafolio, proyectos activos y exposición por Project Manager.",
      nextStep: "La navegación y el espacio están listos para incorporar el futuro dashboard de responsables.",
      icon: "◎"
    },
    "risk-matrix": {
      title: "Matriz de riesgos",
      description: "Asistente para identificar, valorar y priorizar riesgos mediante impacto, probabilidad, respuesta y propietario.",
      nextStep: "Futuro artefacto asistido por IA con trazabilidad hacia RAID y el informe ejecutivo.",
      icon: "△"
    },
    raid: {
      title: "RAID",
      description: "Registro integrado de Risks, Assumptions, Issues y Dependencies para gobernanza del proyecto.",
      nextStep: "Futuro módulo de captura, seguimiento, priorización y escalamiento.",
      icon: "▦"
    },
    charter: {
      title: "Project Charter",
      description: "Generación guiada del propósito, alcance, objetivos, entregables, gobierno y criterios de éxito.",
      nextStep: "Futuro asistente de IA basado en datos del proyecto y plantillas corporativas.",
      icon: "▤"
    },
    raci: {
      title: "Matriz RACI",
      description: "Definición de responsables, aprobadores, consultados e informados para actividades y entregables.",
      nextStep: "Futuro constructor colaborativo con validaciones de cobertura y conflictos.",
      icon: "⌘"
    },
    schedule: {
      title: "Cronograma",
      description: "Planificación de hitos, actividades, dependencias y fechas comprometidas del proyecto.",
      nextStep: "Futuro módulo de apoyo para estructurar y revisar el cronograma base.",
      icon: "▥"
    },
    communications: {
      title: "Plan de comunicaciones",
      description: "Diseño de audiencias, mensajes, responsables, canales, frecuencia y mecanismos de escalamiento.",
      nextStep: "Futuro asistente para generar un plan alineado con stakeholders y gobernanza.",
      icon: "◌"
    },
    "technical-checklist": {
      title: "Checklist técnico",
      description: "Control estructurado de prerrequisitos, validaciones técnicas, evidencias y criterios de aceptación.",
      nextStep: "Futuro checklist adaptable según tipo, complejidad y fase del proyecto.",
      icon: "✓"
    },
    "executive-report": {
      title: "Informe ejecutivo",
      description: "Síntesis gerencial de salud, decisiones, avances, desviaciones, riesgos y próximos pasos.",
      nextStep: "Futuro generador de reportes apoyado por IA y datos vigentes del portafolio.",
      icon: "▧"
    },
    cutover: {
      title: "Plan de cutover",
      description: "Orquestación de actividades, responsables, ventanas, criterios Go/No-Go y validación del cambio.",
      nextStep: "Futuro plan operativo conectado con cronograma, comunicaciones y rollback.",
      icon: "⇥"
    },
    rollback: {
      title: "Plan de rollback",
      description: "Definición de disparadores, responsables, pasos de reversa, validaciones y comunicación de contingencia.",
      nextStep: "Futuro artefacto técnico vinculado al cutover y a la matriz de riesgos.",
      icon: "↶"
    }
  };

  environment.textContent = config.environment || "SIN CONFIGURAR";

  function currentView() {
    const requested = window.location.hash.replace(/^#/, "");
    return modules[requested] ? requested : "portfolio-overview";
  }

  function renderView() {
    const view = currentView();
    const module = modules[view];
    navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.view === view);
    });
    pageTitle.textContent = module.title;
    pageSubtitle.textContent = module.subtitle || "PMO Copilot | Governance Artefacts | AI Assisted Delivery";

    if (!module.dashboard) {
      loading.hidden = true;
      error.hidden = true;
      dashboard.hidden = true;
      placeholder.hidden = false;
      moduleTitle.textContent = module.title;
      moduleDescription.textContent = module.description;
      moduleNextStep.textContent = module.nextStep;
      moduleIcon.textContent = module.icon;
      return;
    }

    placeholder.hidden = true;
    if (fatalError) {
      loading.hidden = true;
      dashboard.hidden = true;
      error.hidden = false;
      errorMessage.textContent = fatalError;
      return;
    }
    error.hidden = true;
    loading.hidden = dashboardReady;
    dashboard.hidden = !dashboardReady;
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      window.location.hash = item.dataset.view;
    });
  });
  window.addEventListener("hashchange", renderView);

  function showError(message) {
    fatalError = message;
    renderView();
  }

  function validateConfig() {
    const required = [
      "portalUrl",
      "cognitoDomain",
      "userPoolClientId",
      "embedApiUrl"
    ];
    return required.every(
      (field) => config[field] && !config[field].includes("__")
    );
  }

  function base64Url(bytes) {
    let binary = "";
    bytes.forEach((value) => {
      binary += String.fromCharCode(value);
    });
    return window.btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  function randomValue(size = 32) {
    const bytes = new Uint8Array(size);
    window.crypto.getRandomValues(bytes);
    return base64Url(bytes);
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    return window.crypto.subtle.digest("SHA-256", bytes);
  }

  function saveToken(token) {
    const expiresAt = Date.now() + ((token.expires_in - 60) * 1000);
    window.sessionStorage.setItem(
      tokenKey,
      JSON.stringify({ idToken: token.id_token, expiresAt })
    );
  }

  function getToken() {
    const raw = window.sessionStorage.getItem(tokenKey);
    if (!raw) {
      return null;
    }
    try {
      const token = JSON.parse(raw);
      if (!token.idToken || token.expiresAt <= Date.now()) {
        window.sessionStorage.removeItem(tokenKey);
        return null;
      }
      return token.idToken;
    } catch {
      window.sessionStorage.removeItem(tokenKey);
      return null;
    }
  }

  async function beginLogin() {
    loadingMessage.textContent = "Redirigiendo al inicio de sesión seguro.";
    const verifier = randomValue(48);
    const state = randomValue(24);
    const challenge = base64Url(new Uint8Array(await sha256(verifier)));
    window.sessionStorage.setItem(verifierKey, verifier);
    window.sessionStorage.setItem(stateKey, state);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: config.userPoolClientId,
      redirect_uri: `${config.portalUrl}/`,
      scope: "openid email profile",
      state,
      code_challenge_method: "S256",
      code_challenge: challenge
    });
    window.location.assign(
      `${config.cognitoDomain}/oauth2/authorize?${params.toString()}`
    );
  }

  async function exchangeCode(code, state) {
    const expectedState = window.sessionStorage.getItem(stateKey);
    const verifier = window.sessionStorage.getItem(verifierKey);
    if (!expectedState || state !== expectedState || !verifier) {
      throw new Error("La respuesta de autenticación no es válida.");
    }
    loadingMessage.textContent = "Completando el inicio de sesión.";
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: config.userPoolClientId,
      code,
      redirect_uri: `${config.portalUrl}/`,
      code_verifier: verifier
    });
    const response = await window.fetch(
      `${config.cognitoDomain}/oauth2/token`,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body
      }
    );
    if (!response.ok) {
      throw new Error("No fue posible completar la autenticación.");
    }
    saveToken(await response.json());
    window.sessionStorage.removeItem(verifierKey);
    window.sessionStorage.removeItem(stateKey);
    window.history.replaceState({}, document.title, window.location.hash || "/");
  }

  async function loadDashboard(idToken) {
    loadingMessage.textContent = "Generando una sesión privada de QuickSight.";
    const response = await window.fetch(config.embedApiUrl, {
      method: "GET",
      headers: { authorization: `Bearer ${idToken}` },
      cache: "no-store"
    });
    if (response.status === 401 || response.status === 403) {
      window.sessionStorage.removeItem(tokenKey);
      await beginLogin();
      return;
    }
    if (!response.ok) {
      throw new Error("No fue posible generar la sesión de QuickSight.");
    }
    const payload = await response.json();
    if (!payload.embedUrl) {
      throw new Error("QuickSight no devolvió una URL de sesión válida.");
    }
    dashboard.addEventListener("load", () => {
      dashboardReady = true;
      renderView();
    }, { once: true });
    dashboard.src = payload.embedUrl;
    logout.hidden = false;
  }

  logout.addEventListener("click", () => {
    window.sessionStorage.clear();
    const params = new URLSearchParams({
      client_id: config.userPoolClientId,
      logout_uri: `${config.portalUrl}/`
    });
    window.location.assign(`${config.cognitoDomain}/logout?${params.toString()}`);
  });

  async function start() {
    renderView();
    if (!validateConfig()) {
      showError("El ambiente no tiene configurada la autenticación segura.");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has("error")) {
      throw new Error(
        params.get("error_description") || "Inicio de sesión cancelado."
      );
    }
    if (params.has("code")) {
      await exchangeCode(params.get("code"), params.get("state"));
    }
    const idToken = getToken();
    if (!idToken) {
      await beginLogin();
      return;
    }
    await loadDashboard(idToken);
  }

  start().catch((reason) => {
    showError(reason.message || "Error inesperado al cargar el dashboard.");
  });
})();

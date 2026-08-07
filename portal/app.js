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
  const riskWorkspace = document.getElementById("risk-workspace");
  const moduleTitle = document.getElementById("module-title");
  const moduleStatus = document.getElementById("module-status");
  const moduleDescription = document.getElementById("module-description");
  const moduleNextStep = document.getElementById("module-next-step");
  const moduleIcon = document.getElementById("module-icon");
  const navItems = [...document.querySelectorAll("[data-view]")];
  const tokenKey = "pmo-auth-token";
  const verifierKey = "pmo-pkce-verifier";
  const stateKey = "pmo-oauth-state";
  let dashboardReady = false;
  let activeDashboardKey = "";
  let fatalError = "";
  let selectedRiskId = "";
  let riskReviewKey = "";
  let riskProject = {};
  let riskRecords = [];

  const modules = {
    "portfolio-overview": {
      title: "PMO Portfolio Overview",
      subtitle: "Strategic Delivery | Portfolio Governance | Executive Decision Making",
      dashboard: true,
      dashboardKey: "portfolio"
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
      dashboard: true,
      dashboardKey: "project-manager"
    },
    "risk-matrix": {
      title: "Registro y Matriz de Riesgos",
      status: "Piloto Fase II",
      riskWorkspace: true,
      description: "Identificación, valoración y priorización de riesgos en escala 1–5, con respuesta, mitigación, responsable y vínculo opcional a la EDT.",
      nextStep: "Contrato de datos implementado. La siguiente iteración incorporará captura, matriz 5×5 y sugerencias de IA con aprobación humana.",
      icon: "△"
    },
    wbs: {
      title: "EDT / WBS",
      status: "Piloto Fase II",
      description: "Descomposición jerárquica del alcance en entregables y paquetes de trabajo, usando códigos EDT reutilizables por cronograma y riesgos.",
      nextStep: "Contrato jerárquico implementado con validación de códigos, padres, responsables, entregables y horas planificadas.",
      icon: "⌘"
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
      title: "Plan / Cronograma",
      status: "Piloto Fase II",
      description: "Planificación semanal por horas, actividades y dependencias, vinculada a los paquetes de trabajo de la EDT.",
      nextStep: "Contrato implementado para calcular horas y semanas. La vista Gantt y la captura interactiva serán la siguiente iteración.",
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
      riskWorkspace.hidden = !module.riskWorkspace;
      placeholder.hidden = Boolean(module.riskWorkspace);
      if (module.riskWorkspace) {
        renderRiskMatrix();
        return;
      }
      moduleStatus.textContent = module.status || "Módulo planificado";
      moduleTitle.textContent = module.title;
      moduleDescription.textContent = module.description;
      moduleNextStep.textContent = module.nextStep;
      moduleIcon.textContent = module.icon;
      return;
    }

    riskWorkspace.hidden = true;
    placeholder.hidden = true;
    if (fatalError) {
      loading.hidden = true;
      dashboard.hidden = true;
      error.hidden = false;
      errorMessage.textContent = fatalError;
      return;
    }
    error.hidden = true;
    const currentDashboardReady = (
      dashboardReady &&
      module.dashboardKey === activeDashboardKey
    );
    loading.hidden = currentDashboardReady;
    dashboard.hidden = !currentDashboardReady;
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      window.location.hash = item.dataset.view;
    });
  });
  window.addEventListener("hashchange", renderView);
  window.addEventListener("hashchange", async () => {
    const module = modules[currentView()];
    if (!module.dashboard || module.dashboardKey === activeDashboardKey) {
      return;
    }
    const idToken = getToken();
    if (idToken) {
      try {
        await loadDashboard(idToken, module.dashboardKey);
      } catch (reason) {
        showError(reason.message || "No fue posible cambiar de dashboard.");
      }
    }
  });

  function showError(message) {
    fatalError = message;
    renderView();
  }

  function riskLevel(risk) {
    const score = risk.probability * risk.impact;
    if (score <= 4) return "Bajo";
    if (score <= 9) return "Medio";
    if (score <= 16) return "Alto";
    return "Crítico";
  }

  function riskClass(level) {
    return `risk-level-${level.toLowerCase().replace("í", "i")}`;
  }

  function restoreRiskReviews() {
    if (!riskReviewKey) return;
    try {
      const reviews = JSON.parse(
        window.sessionStorage.getItem(riskReviewKey) || "{}"
      );
      riskRecords = riskRecords.map((risk) => ({
        ...risk,
        ...(reviews[risk.id] || {})
      }));
    } catch {
      window.sessionStorage.removeItem(riskReviewKey);
    }
  }

  function saveRiskReview(risk) {
    if (!riskReviewKey) return;
    const reviews = JSON.parse(
      window.sessionStorage.getItem(riskReviewKey) || "{}"
    );
    reviews[risk.id] = { owner: risk.owner, status: risk.status };
    window.sessionStorage.setItem(riskReviewKey, JSON.stringify(reviews));
  }

  function fillFilter(selectId, values) {
    const select = document.getElementById(selectId);
    if (select.options.length > 1) return;
    [...new Set(values)].sort().forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function filteredRisks() {
    const level = document.getElementById("risk-level-filter").value;
    const category = document.getElementById("risk-category-filter").value;
    const status = document.getElementById("risk-status-filter").value;
    return riskRecords.filter((risk) => (
      (!level || riskLevel(risk) === level) &&
      (!category || risk.category === category) &&
      (!status || risk.status === status)
    ));
  }

  function renderRiskSummary() {
    const critical = riskRecords.filter(
      (risk) => riskLevel(risk) === "Crítico"
    ).length;
    const high = riskRecords.filter(
      (risk) => riskLevel(risk) === "Alto"
    ).length;
    const reviewed = riskRecords.filter(
      (risk) => ["Revisado", "Aprobado", "Descartado"].includes(risk.status)
    ).length;
    document.getElementById("risk-total").textContent = riskRecords.length;
    document.getElementById("risk-critical").textContent = critical;
    document.getElementById("risk-high").textContent = high;
    document.getElementById("risk-reviewed").textContent = (
      `${Math.round((reviewed / Math.max(riskRecords.length, 1)) * 100)}%`
    );
  }

  function renderRiskTable() {
    const body = document.getElementById("risk-table-body");
    body.replaceChildren();
    filteredRisks().forEach((risk) => {
      const level = riskLevel(risk);
      const row = document.createElement("tr");
      row.tabIndex = 0;
      row.dataset.riskId = risk.id;
      [
        risk.id,
        risk.title,
        risk.category,
        `${risk.probability}×${risk.impact} = ${risk.probability * risk.impact}`,
        level,
        risk.status
      ].forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (index === 4) cell.className = riskClass(level);
        row.appendChild(cell);
      });
      const open = () => openRiskDetail(risk.id);
      row.addEventListener("click", open);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") open();
      });
      body.appendChild(row);
    });
  }

  function renderRiskHeatmap() {
    const heatmap = document.getElementById("risk-heatmap");
    heatmap.replaceChildren();
    for (let impact = 5; impact >= 1; impact -= 1) {
      for (let probability = 1; probability <= 5; probability += 1) {
        const count = riskRecords.filter((risk) => (
          risk.impact === impact && risk.probability === probability
        )).length;
        const score = impact * probability;
        const level = riskLevel({ probability, impact });
        const cell = document.createElement("div");
        cell.className = `risk-heatmap-cell ${riskClass(level)}`;
        cell.title = `Probabilidad ${probability} · Impacto ${impact}`;
        const scoreElement = document.createElement("span");
        scoreElement.textContent = score;
        const countElement = document.createElement("strong");
        countElement.textContent = count || "";
        cell.append(scoreElement, countElement);
        heatmap.appendChild(cell);
      }
    }
  }

  function openRiskDetail(riskId) {
    const risk = riskRecords.find((item) => item.id === riskId);
    if (!risk) return;
    selectedRiskId = riskId;
    document.getElementById("risk-detail-id").textContent = (
      `${risk.id} · ${risk.category} · ${riskLevel(risk)}`
    );
    document.getElementById("risk-detail-title").textContent = risk.title;
    document.getElementById("risk-detail-cause").textContent = risk.cause;
    document.getElementById("risk-detail-consequence").textContent = (
      risk.consequence
    );
    document.getElementById("risk-detail-mitigation").textContent = (
      risk.mitigation
    );
    document.getElementById("risk-detail-evidence").textContent = (
      `${risk.evidence} · ${risk.evidenceType} · Confianza ${risk.confidence}`
    );
    document.getElementById("risk-detail-owner").value = risk.owner;
    document.getElementById("risk-detail-status").value = risk.status;
    document.getElementById("risk-detail").hidden = false;
  }

  function renderRiskMatrix() {
    const hasResults = riskRecords.length > 0;
    document.getElementById("risk-results").hidden = !hasResults;
    document.getElementById("risk-project-summary").textContent = (
      hasResults
        ? `${riskProject.name || "Proyecto"} · ${riskProject.analysisId || ""}`
        : "Carga una propuesta PDF digital o PPTX para iniciar el análisis."
    );
    document.getElementById("risk-source-name").textContent = (
      hasResults ? "Documentos procesados en S3 privado" : "Pendiente de carga"
    );
    if (!hasResults) return;
    fillFilter("risk-level-filter", riskRecords.map(riskLevel));
    fillFilter(
      "risk-category-filter",
      riskRecords.map((risk) => risk.category)
    );
    fillFilter(
      "risk-status-filter",
      ["Propuesto", "Revisado", "Aprobado", "Descartado"]
    );
    renderRiskSummary();
    renderRiskTable();
    renderRiskHeatmap();
  }

  ["risk-level-filter", "risk-category-filter", "risk-status-filter"]
    .forEach((id) => {
      document.getElementById(id).addEventListener("change", renderRiskTable);
    });
  document.getElementById("risk-detail-close").addEventListener("click", () => {
    document.getElementById("risk-detail").hidden = true;
  });
  document.getElementById("risk-detail-save").addEventListener("click", () => {
    const risk = riskRecords.find((item) => item.id === selectedRiskId);
    if (!risk) return;
    risk.owner = document.getElementById("risk-detail-owner").value.trim();
    risk.status = document.getElementById("risk-detail-status").value;
    saveRiskReview(risk);
    renderRiskMatrix();
  });

  function setRiskProgress(title, message, visible = true) {
    document.getElementById("risk-analysis-progress").hidden = !visible;
    document.getElementById("risk-progress-title").textContent = title;
    document.getElementById("risk-progress-message").textContent = message;
  }

  async function riskApi(path, options = {}) {
    const token = getToken();
    if (!token) {
      await beginLogin();
      throw new Error("La sesión expiró.");
    }
    const response = await window.fetch(`${config.riskApiUrl}${path}`, {
      ...options,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...(options.headers || {})
      },
      cache: "no-store"
    });
    if (response.status === 401 || response.status === 403) {
      window.sessionStorage.removeItem(tokenKey);
      await beginLogin();
      throw new Error("La sesión expiró.");
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.message || "Falló la solicitud de análisis.");
    }
    return payload;
  }

  function validateRiskFiles(files) {
    if (!files.length || files[0].role !== "proposal") {
      throw new Error("Selecciona la propuesta principal en PDF digital o PPTX.");
    }
    if (files.length > 3) {
      throw new Error("Solo se permiten tres documentos por análisis.");
    }
    files.forEach(({ file, role }) => {
      const extension = file.name.toLowerCase().split(".").pop();
      if (file.size > 20 * 1024 * 1024) {
        throw new Error(`${file.name} supera el límite de 20 MB.`);
      }
      if (role === "proposal" && !["pdf", "pptx"].includes(extension)) {
        throw new Error("La propuesta principal debe ser PDF digital o PPTX.");
      }
      if (!["pdf", "pptx"].includes(extension)) {
        throw new Error(`Formato no permitido: ${file.name}.`);
      }
    });
  }

  async function uploadRiskFiles(uploads, files) {
    for (let index = 0; index < uploads.length; index += 1) {
      const form = new FormData();
      Object.entries(uploads[index].fields).forEach(([key, value]) => {
        form.append(key, value);
      });
      form.append("file", files[index].file);
      const response = await window.fetch(uploads[index].url, {
        method: "POST",
        body: form
      });
      if (!response.ok) {
        throw new Error(`No fue posible cargar ${files[index].file.name}.`);
      }
    }
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  async function waitForRiskAnalysis(analysisId) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const result = await riskApi(`/analyses/${analysisId}`);
      if (result.status === "COMPLETED") return result;
      if (result.status === "FAILED") {
        throw new Error(result.message || "El análisis no pudo completarse.");
      }
      setRiskProgress(
        "Analizando documentos",
        "Extrayendo evidencia y priorizando hasta 10 riesgos."
      );
      await delay(3000);
    }
    throw new Error("El análisis superó el tiempo máximo de espera.");
  }

  async function generateRiskAnalysis() {
    const button = document.getElementById("risk-generate");
    const projectName = document.getElementById("risk-project-name").value.trim();
    const proposal = document.getElementById("risk-proposal-file").files[0];
    const sow = document.getElementById("risk-sow-file").files[0];
    const nda = document.getElementById("risk-nda-file").files[0];
    const files = [
      proposal && { file: proposal, role: "proposal" },
      sow && { file: sow, role: "sow" },
      nda && { file: nda, role: "nda" }
    ].filter(Boolean);
    try {
      validateRiskFiles(files);
      button.disabled = true;
      setRiskProgress("Preparando carga", "Creando un espacio privado en DEV.");
      const created = await riskApi("/analyses", {
        method: "POST",
        body: JSON.stringify({
          project: { name: projectName || "Proyecto sin nombre" },
          files: files.map(({ file, role }) => ({
            name: file.name,
            role,
            contentType: file.type || "application/octet-stream"
          }))
        })
      });
      setRiskProgress("Cargando documentos", "Los archivos se cifran en S3 DEV.");
      await uploadRiskFiles(created.uploads, files);
      await riskApi(`/analyses/${created.analysisId}/start`, {
        method: "POST",
        body: "{}"
      });
      const result = await waitForRiskAnalysis(created.analysisId);
      riskProject = {
        ...(result.project || {}),
        analysisId: result.analysisId
      };
      riskRecords = (result.risks || []).map((risk) => ({ ...risk }));
      riskReviewKey = `pmo-risk-reviews-${result.analysisId}`;
      restoreRiskReviews();
      renderRiskMatrix();
      setRiskProgress(
        "Análisis completado",
        `${riskRecords.length} riesgos generados para revisión humana.`
      );
    } catch (reason) {
      setRiskProgress("No fue posible completar el análisis", reason.message);
    } finally {
      button.disabled = false;
    }
  }

  document.getElementById("risk-generate").addEventListener(
    "click",
    generateRiskAnalysis
  );

  function validateConfig() {
    const required = [
      "portalUrl",
      "cognitoDomain",
      "userPoolClientId",
      "embedApiUrl",
      "projectManagerDashboardId",
      "riskApiUrl"
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

  async function loadDashboard(idToken, dashboardKey) {
    loadingMessage.textContent = "Generando una sesión privada de QuickSight.";
    dashboardReady = false;
    dashboard.hidden = true;
    loading.hidden = false;
    const url = new URL(config.embedApiUrl);
    url.searchParams.set("dashboard", dashboardKey);
    const response = await window.fetch(url, {
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
      activeDashboardKey = dashboardKey;
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
    const module = modules[currentView()];
    if (module.dashboard) {
      await loadDashboard(idToken, module.dashboardKey);
    }
  }

  start().catch((reason) => {
    showError(reason.message || "Error inesperado al cargar el dashboard.");
  });
})();

(() => {
  "use strict";

  const config = window.PMO_CONFIG || {};
  const loading = document.getElementById("loading");
  const loadingMessage = document.getElementById("loading-message");
  const error = document.getElementById("error");
  const errorMessage = document.getElementById("error-message");
  const dashboard = document.getElementById("dashboard");
  const environment = document.getElementById("environment");
  const appVersion = document.getElementById("app-version");
  const lastUpgrade = document.getElementById("last-upgrade");
  const asanaExtraction = document.getElementById("asana-extraction");
  const logout = document.getElementById("logout");
  const pageTitle = document.getElementById("page-title");
  const pageSubtitle = document.getElementById("page-subtitle");
  const placeholder = document.getElementById("module-placeholder");
  const riskWorkspace = document.getElementById("risk-workspace");
  const planningWorkspace = document.getElementById("planning-workspace");
  const resourcesWorkspace = document.getElementById("resources-workspace");
  const billingWorkspace = document.getElementById("billing-workspace");
  const minutesWorkspace = document.getElementById("minutes-workspace");
  const billingPageBody = document.getElementById("billing-page-body");
  const billingPageSearch = document.getElementById("billing-page-search");
  const billingPageMonth = document.getElementById("billing-page-month");
  const billingPageStatus = document.getElementById("billing-page-status");
  const billingPageResult = document.getElementById("billing-page-result");
  const billingPageSave = document.getElementById("billing-page-save");
  const billingAutosaveStatus = document.getElementById(
    "billing-autosave-status"
  );
  const resourceSearch = document.getElementById("resource-search");
  const resourceFilters = [
    ...document.querySelectorAll("[data-resource-filter]")
  ];
  const resourceEntries = [
    ...document.querySelectorAll(".knowledge-card, .faq-item")
  ];
  const resourceEmpty = document.getElementById("resource-empty");
  const followupWorkspace = document.getElementById("followup-workspace");
  const followupBackdrop = document.getElementById("followup-backdrop");
  const followupDashboardOpen = document.getElementById(
    "followup-dashboard-open"
  );
  const followupClose = document.getElementById("followup-close");
  const followupForm = document.getElementById("followup-form");
  const followupResult = document.getElementById("followup-result");
  const billingForm = document.getElementById("billing-form");
  const billingResult = document.getElementById("billing-result");
  const moduleTitle = document.getElementById("module-title");
  const moduleStatus = document.getElementById("module-status");
  const moduleDescription = document.getElementById("module-description");
  const moduleNextStep = document.getElementById("module-next-step");
  const moduleIcon = document.getElementById("module-icon");
  const navItems = [...document.querySelectorAll("[data-view]")];
  const tokenKey = "pmo-auth-token";
  const verifierKey = "pmo-pkce-verifier";
  const stateKey = "pmo-oauth-state";
  const authTransactionKey = "pmo-auth-transaction";
  const returnHashKey = "pmo-auth-return-hash";
  let dashboardReady = false;
  let activeDashboardKey = "";
  let embeddingContext = null;
  let embeddedDashboard = null;
  let followupCallbackReady = false;
  let followupCallbackPromise = null;
  let fatalError = "";
  let selectedRiskId = "";
  let riskReviewKey = "";
  let riskProject = {};
  let riskRecords = [];
  let planningResult = null;
  const selectedPlanningMilestones = new Set();
  let activeResourceFilter = "all";
  let billingProjects = [];
  const dirtyBillingProjects = new Set();
  const billingAutosaveMilliseconds = 5 * 60 * 1000;

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
    "project-followup": {
      title: "Seguimiento de proyectos",
      subtitle: "Bitácora auditable | Revisión PMO | Trazabilidad",
      followupWorkspace: true
    },
    "risk-matrix": {
      title: "Registro y Matriz de Riesgos",
      status: "Piloto Fase II",
      riskWorkspace: true,
      description: "Identificación, valoración y priorización de riesgos en escala 1–5, con respuesta, mitigación, responsable y vínculo opcional a la EDT.",
      nextStep: "Contrato de datos implementado. La siguiente iteración incorporará captura, matriz 5×5 y sugerencias de IA con aprobación humana.",
      icon: "△"
    },
    planning: {
      title: "Planificación",
      subtitle: "Document Intelligence | Hitos | Cronograma Ejecutivo",
      planningWorkspace: true
    },
    resources: {
      title: "Recursos PMO",
      subtitle: "Knowledge Base | Capacitación | Buenas prácticas",
      resourcesWorkspace: true
    },
    minutes: {
      title: "Minutas y Reportes",
      subtitle: "Document Intelligence | Minuta | Reporte Ejecutivo",
      minutesWorkspace: true
    },
    "billing-plan": {
      title: "Plan de Facturación",
      subtitle: "Revisión PMO | Fiabilidad | Forecast facturable",
      billingWorkspace: true
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
  appVersion.textContent = `v${config.applicationVersion || "--"}`;
  lastUpgrade.textContent = (
    `Último upgrade: ${config.lastUpgrade || "sin información"}`
  );
  const extractionVersion = config.asanaExtractionVersion || "--";
  const extractionVersionShort = extractionVersion.slice(0, 8);
  asanaExtraction.textContent = (
    `Extracción Asana: ${extractionVersionShort} · ` +
    `${config.asanaExtractionTime || "sin información"}`
  );
  asanaExtraction.title = `S3 VersionId: ${extractionVersion}`;

  // Live sync status from sync_status.json
  fetch("sync_status.json", { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(sync => {
      if (!sync || !sync.last_sync_at) return;
      const d = new Date(sync.last_sync_at);
      const pad = n => String(n).padStart(2, "0");
      const label = `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())} America/Santiago`;
      asanaExtraction.textContent = `Extracción Asana: ${label}`;
      asanaExtraction.title = `Proyectos: ${sync.projects || "?"} | Tareas: ${sync.tasks || "?"}`;
    })
    .catch(() => {});

  function currentView() {
    const requested = window.location.hash
      .replace(/^#/, "")
      .split("?", 1)[0];
    if (requested === "project-followup") {
      return "pm-analysis";
    }
    return modules[requested] ? requested : "portfolio-overview";
  }

  function isFollowupLink() {
    return window.location.hash
      .replace(/^#/, "")
      .split("?", 1)[0] === "project-followup";
  }

  function followupParameters() {
    const query = window.location.hash.split("?", 2)[1] || "";
    return new URLSearchParams(query);
  }

  function openFollowup(pmoId = "", projectName = "") {
    document.querySelector(".followup-header h2").textContent = (
      "Seguimiento de proyectos"
    );
    followupForm.hidden = false;
    billingForm.hidden = true;
    document.getElementById("followup-pmo-id").value = pmoId;
    document.getElementById("followup-project-name").value = projectName;
    followupResult.hidden = true;
    followupBackdrop.hidden = false;
    followupWorkspace.hidden = false;
    followupWorkspace.classList.add("followup-workspace-open");
    document.getElementById("followup-note").focus();
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  async function loadBillingSummary() {
    const response = await followupRequest("/billing-summary", {
      method: "GET",
      headers: {}
    });
    const summary = await response.json();
    document.getElementById("billing-total").textContent = formatMoney(
      summary.total_eligible_budget
    );
    document.getElementById("billing-count").textContent = (
      `${summary.eligible_projects || 0} proyectos confirmados`
    );
  }

  async function openBilling(pmoId = "", projectName = "", budget = "") {
    document.querySelector(".followup-header h2").textContent = (
      "Revisión de facturación"
    );
    followupForm.hidden = true;
    billingForm.hidden = false;
    billingResult.hidden = true;
    document.getElementById("billing-pmo-id").value = pmoId;
    document.getElementById("billing-project-name").value = projectName;
    document.getElementById("billing-budget").value = Number(budget) || 0;
    document.getElementById("billing-review-date").value = (
      new Date().toISOString().slice(0, 10)
    );
    document.getElementById("billing-eligible").checked = false;
    followupBackdrop.hidden = false;
    followupWorkspace.hidden = false;
    followupWorkspace.classList.add("followup-workspace-open");
    try {
      await loadBillingSummary();
    } catch (reason) {
      billingResult.className = "followup-result followup-result-error";
      billingResult.textContent = reason.message;
      billingResult.hidden = false;
    }
  }

  function closeFollowup() {
    followupWorkspace.classList.remove("followup-workspace-open");
    followupWorkspace.hidden = true;
    followupBackdrop.hidden = true;
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
      followupDashboardOpen.hidden = true;
      loading.hidden = true;
      error.hidden = true;
      dashboard.hidden = true;
      riskWorkspace.hidden = !module.riskWorkspace;
      planningWorkspace.hidden = !module.planningWorkspace;
      resourcesWorkspace.hidden = !module.resourcesWorkspace;
      billingWorkspace.hidden = !module.billingWorkspace;
      minutesWorkspace.hidden = !module.minutesWorkspace;
      if (!module.followupWorkspace) {
        closeFollowup();
      }
      placeholder.hidden = Boolean(
        module.riskWorkspace ||
        module.planningWorkspace ||
        module.followupWorkspace ||
        module.resourcesWorkspace ||
        module.billingWorkspace ||
        module.minutesWorkspace
      );
      if (module.riskWorkspace) {
        renderRiskMatrix();
        return;
      }
      if (module.planningWorkspace) {
        renderPlanningResult();
        return;
      }
      if (module.followupWorkspace) {
        const params = followupParameters();
        openFollowup(
          params.get("pmo_id") || "",
          params.get("project_name") || ""
        );
        return;
      }
      if (module.resourcesWorkspace) {
        return;
      }
      if (module.billingWorkspace) {
        loadBillingPage();
        return;
      }
      if (module.minutesWorkspace) {
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
    planningWorkspace.hidden = true;
    resourcesWorkspace.hidden = true;
    billingWorkspace.hidden = true;
    minutesWorkspace.hidden = true;
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
    followupDashboardOpen.hidden = !currentDashboardReady;
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      window.location.hash = item.dataset.view;
    });
  });

  function normalizeResourceText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function filterResources() {
    const query = normalizeResourceText(resourceSearch.value);
    let visibleCount = 0;
    resourceEntries.forEach((entry) => {
      const categories = normalizeResourceText(entry.dataset.category);
      const content = normalizeResourceText(entry.textContent);
      const categoryMatch = (
        activeResourceFilter === "all" ||
        categories.includes(activeResourceFilter)
      );
      const searchMatch = !query || content.includes(query);
      entry.hidden = !(categoryMatch && searchMatch);
      if (!entry.hidden) {
        visibleCount += 1;
      }
    });
    resourceEmpty.hidden = visibleCount > 0;
  }

  resourceSearch.addEventListener("input", filterResources);
  resourceFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeResourceFilter = button.dataset.resourceFilter;
      resourceFilters.forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      filterResources();
    });
  });

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function billingMonthLabel(monthKey) {
    if (!monthKey) return "Sin fecha planificada";
    const [year, month] = monthKey.split("-").map(Number);
    const label = new Intl.DateTimeFormat("es-CL", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function populateBillingMonthFilter() {
    const current = billingPageMonth.value || "all";
    const monthKeys = [...new Set(
      billingProjects.map((project) => project.billing_month_key || "")
    )].sort((left, right) => {
      if (!left) return 1;
      if (!right) return -1;
      return right.localeCompare(left);
    });
    billingPageMonth.innerHTML = [
      '<option value="all">Todos los meses</option>',
      ...monthKeys.map((monthKey) => (
        `<option value="${escapeHtml(monthKey || "without-date")}">${escapeHtml(billingMonthLabel(monthKey))}</option>`
      ))
    ].join("");
    if ([...billingPageMonth.options].some((option) => option.value === current)) {
      billingPageMonth.value = current;
    }
  }

  function filteredBillingProjects() {
    const query = normalizeResourceText(billingPageSearch.value);
    const month = billingPageMonth.value;
    const status = billingPageStatus.value;
    return billingProjects.filter((project) => {
      const text = normalizeResourceText(
        `${project.pmo_id} ${project.project_name} ${project.responsible}`
      );
      const searchMatch = !query || text.includes(query);
      const projectMonth = project.billing_month_key || "without-date";
      const monthMatch = month === "all" || month === projectMonth;
      const statusMatch = (
        status === "all" ||
        (status === "eligible" && project.billing_eligible) ||
        (status === "invoiced" && project.billing_invoiced) ||
        (status === "pending" && (
          !project.billing_eligible && !project.billing_invoiced
        ))
      );
      return searchMatch && monthMatch && statusMatch;
    });
  }

  function renderBillingTotals(visible = filteredBillingProjects()) {
    const eligible = visible.filter((project) => project.billing_eligible);
    const invoiced = visible.filter((project) => project.billing_invoiced);
    const eligibleTotal = eligible.reduce(
      (total, project) => total + Number(project.budget_amount || 0),
      0
    );
    const invoicedTotal = invoiced.reduce(
      (total, project) => total + Number(project.budget_amount || 0),
      0
    );
    document.getElementById("billing-page-total").textContent = formatMoney(
      eligibleTotal
    );
    document.getElementById("billing-page-count").textContent = (
      `${eligible.length} proyectos facturables`
    );
    document.getElementById("billing-page-invoiced-total").textContent = (
      formatMoney(invoicedTotal)
    );
    document.getElementById("billing-page-invoiced-count").textContent = (
      `${invoiced.length} proyectos facturados`
    );
  }

  function updateBillingSaveState() {
    const pending = dirtyBillingProjects.size;
    billingPageSave.disabled = pending === 0;
    billingAutosaveStatus.textContent = pending
      ? `${pending} cambio${pending === 1 ? "" : "s"} pendiente${pending === 1 ? "" : "s"} · Autoguardado cada 5 min`
      : "Sin cambios pendientes · Autoguardado cada 5 min";
  }

  function markBillingProjectDirty(project) {
    dirtyBillingProjects.add(project.pmo_id);
    updateBillingSaveState();
  }

  function renderBillingPage() {
    const visible = filteredBillingProjects();
    billingPageBody.innerHTML = visible.map((project) => `
      <tr data-pmo-id="${escapeHtml(project.pmo_id)}">
        <td>${escapeHtml(project.pmo_id)}</td>
        <td class="billing-project-cell">${escapeHtml(project.project_name)}</td>
        <td>${escapeHtml(project.responsible || "Sin asignar")}</td>
        <td>${project.days_to_finish ?? "—"}</td>
        <td>${escapeHtml(project.closing_window || "—")}</td>
        <td>${escapeHtml(project.project_status || "Sin estado")}</td>
        <td>${Number(project.progress_pct || 0).toFixed(1)}%</td>
        <td>${escapeHtml(project.billing_month || "—")}</td>
        <td class="billing-budget-cell">${formatMoney(project.budget_amount)}</td>
        <td class="billing-check-cell"><input class="billing-row-eligible" type="checkbox" ${project.billing_eligible ? "checked" : ""} aria-label="Facturable"></td>
        <td class="billing-check-cell"><input class="billing-row-invoiced" type="checkbox" ${project.billing_invoiced ? "checked" : ""} aria-label="Facturado"></td>
        <td class="billing-row-invoiced-date ${project.billing_invoiced_date ? "" : "billing-review-date-empty"}">${escapeHtml(project.billing_invoiced_date || "No facturado")}</td>
        <td><select class="billing-row-reliability"><option value="1" ${Number(project.billing_reliability) === 1 ? "selected" : ""}>1 · Baja</option><option value="2" ${Number(project.billing_reliability) === 2 ? "selected" : ""}>2 · Media</option><option value="3" ${Number(project.billing_reliability) === 3 ? "selected" : ""}>3 · Alta</option></select></td>
        <td><input class="billing-row-note" type="text" maxlength="300" value="${escapeHtml(project.review_note || "")}" placeholder="Acuerdo, condición o pendiente" aria-label="Reseña breve"></td>
        <td class="billing-row-date ${project.review_date ? "" : "billing-review-date-empty"}">${escapeHtml(project.review_date || "Sin revisión")}</td>
      </tr>
    `).join("");
    document.getElementById("billing-page-empty").hidden = visible.length > 0;
    renderBillingTotals(visible);
    updateBillingSaveState();
  }

  async function loadBillingPage() {
    const loadingElement = document.getElementById("billing-page-loading");
    loadingElement.hidden = false;
    billingPageResult.hidden = true;
    try {
      const response = await followupRequest("/billing-projects", {
        method: "GET",
        headers: {}
      });
      billingProjects = (await response.json()).projects || [];
      billingProjects.forEach((project) => {
        if (project.billing_invoiced) project.billing_eligible = false;
      });
      dirtyBillingProjects.clear();
      populateBillingMonthFilter();
      renderBillingPage();
    } catch (reason) {
      billingPageResult.className = "followup-result followup-result-error";
      billingPageResult.textContent = reason.message;
      billingPageResult.hidden = false;
    } finally {
      loadingElement.hidden = true;
    }
  }

  billingPageSearch.addEventListener("input", renderBillingPage);
  billingPageMonth.addEventListener("change", renderBillingPage);
  billingPageStatus.addEventListener("change", renderBillingPage);
  document.getElementById("billing-page-refresh").addEventListener(
    "click", loadBillingPage
  );
  document.getElementById("billing-page-export").addEventListener(
    "click",
    async () => {
      billingPageResult.hidden = true;
      try {
        const response = await followupRequest("/export", {
          method: "GET",
          headers: {}
        });
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Seguimiento de proyectos.csv";
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (reason) {
        billingPageResult.className = "followup-result followup-result-error";
        billingPageResult.textContent = reason.message;
        billingPageResult.hidden = false;
      }
    }
  );
  billingPageBody.addEventListener("change", (event) => {
    const row = event.target.closest("tr");
    if (!row) return;
    const project = billingProjects.find(
      (item) => item.pmo_id === row.dataset.pmoId
    );
    if (!project) return;
    if (event.target.matches(".billing-row-eligible")) {
      project.billing_eligible = event.target.checked;
      if (event.target.checked) {
        project.billing_invoiced = false;
        project.billing_invoiced_date = "";
        row.querySelector(".billing-row-invoiced").checked = false;
        const date = row.querySelector(".billing-row-invoiced-date");
        date.textContent = "No facturado";
        date.classList.add("billing-review-date-empty");
      }
    } else if (event.target.matches(".billing-row-invoiced")) {
      project.billing_invoiced = event.target.checked;
      if (event.target.checked) {
        project.billing_eligible = false;
        row.querySelector(".billing-row-eligible").checked = false;
      } else {
        project.billing_invoiced_date = "";
      }
    } else if (event.target.matches(".billing-row-reliability")) {
      project.billing_reliability = Number(event.target.value);
    }
    markBillingProjectDirty(project);
    renderBillingTotals();
  });

  billingPageBody.addEventListener("input", (event) => {
    if (!event.target.matches(".billing-row-note")) return;
    const row = event.target.closest("tr");
    const project = billingProjects.find(
      (item) => item.pmo_id === row.dataset.pmoId
    );
    if (!project) return;
    project.review_note = event.target.value.trim();
    markBillingProjectDirty(project);
  });

  async function saveBillingChanges(automatic = false) {
    const pendingIds = [...dirtyBillingProjects];
    if (!pendingIds.length) return;
    billingPageSave.disabled = true;
    billingPageResult.hidden = true;
    billingAutosaveStatus.textContent = automatic
      ? "Autoguardando cambios…"
      : "Guardando cambios…";
    let saved = 0;
    try {
      for (const pmoId of pendingIds) {
        const project = billingProjects.find((item) => item.pmo_id === pmoId);
        if (!project) continue;
        await followupRequest("/billing", {
          method: "POST",
          body: JSON.stringify({
            pmo_id: project.pmo_id,
            project_name: project.project_name,
            budget_amount: project.budget_amount,
            billing_eligible: project.billing_eligible,
            billing_invoiced: project.billing_invoiced,
            billing_reliability: Number(project.billing_reliability || 2),
            note: project.review_note || ""
          })
        });
        const today = new Date().toISOString().slice(0, 10);
        project.review_date = today;
        project.billing_invoiced_date = project.billing_invoiced ? today : "";
        dirtyBillingProjects.delete(pmoId);
        saved += 1;
      }
      renderBillingPage();
      billingPageResult.className = "followup-result followup-result-success";
      billingPageResult.textContent = automatic
        ? `Autoguardado completado: ${saved} proyecto${saved === 1 ? "" : "s"}`
        : `Cambios guardados: ${saved} proyecto${saved === 1 ? "" : "s"}`;
      billingPageResult.hidden = false;
    } catch (reason) {
      billingPageResult.className = "followup-result followup-result-error";
      billingPageResult.textContent = (
        `${reason.message}. Se conservaron ${dirtyBillingProjects.size} cambios pendientes.`
      );
      billingPageResult.hidden = false;
    } finally {
      updateBillingSaveState();
    }
  }

  billingPageSave.addEventListener("click", () => saveBillingChanges(false));
  window.setInterval(
    () => saveBillingChanges(true),
    billingAutosaveMilliseconds
  );

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
  async function selectedProject() {
    if (!embeddedDashboard) {
      return "";
    }
    const parameters = await embeddedDashboard.getParameters();
    const project = parameters.find((item) => item.Name === "SharedProject");
    return String(project?.Values?.[0] || "").trim();
  }

  async function openFollowupForSelection() {
    followupDashboardOpen.disabled = true;
    try {
      const projectName = await selectedProject();
      if (!projectName) {
        openFollowup();
        return;
      }
      const response = await followupRequest(
        `/project?name=${encodeURIComponent(projectName)}`,
        { method: "GET", headers: {} }
      );
      const project = await response.json();
      openFollowup(project.pmo_id || "", project.project_name || projectName);
    } catch (reason) {
      openFollowup();
      followupResult.className = "followup-result followup-result-error";
      followupResult.textContent = reason.message;
      followupResult.hidden = false;
    } finally {
      followupDashboardOpen.disabled = false;
    }
  }

  followupDashboardOpen.addEventListener("click", openFollowupForSelection);
  followupClose.addEventListener("click", closeFollowup);
  followupBackdrop.addEventListener("click", closeFollowup);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !followupWorkspace.hidden) {
      closeFollowup();
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

  function planningDate(value) {
    const [year, month, day] = String(value || "").split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  function planningPosition(date, start, duration) {
    return Math.max(0, Math.min(100, (
      (planningDate(date) - start) / duration
    ) * 100));
  }

  function planningItems() {
    return [...(planningResult?.schedule?.items || [])].sort((left, right) => (
      left.start_date.localeCompare(right.start_date)
    ));
  }

  function planningRange(items) {
    const startValue = items.reduce(
      (earliest, item) => item.start_date < earliest ? item.start_date : earliest,
      items[0].start_date
    );
    const endValue = items.reduce(
      (latest, item) => item.end_date > latest ? item.end_date : latest,
      items[0].end_date
    );
    const start = planningDate(startValue);
    const end = planningDate(endValue);
    const duration = Math.max(end - start, 86400000);
    return {
      startValue,
      endValue,
      start,
      end,
      duration,
      weekCount: Math.max(1, Math.ceil((end - start + 86400000) / 604800000))
    };
  }

  function renderPlanningMilestones(items) {
    const milestones = items.filter((item) => item.type === "Hito");
    const selector = document.getElementById("planning-milestone-selector");
    selector.innerHTML = milestones.map((item) => `
      <label><input type="checkbox" data-planning-milestone="${escapeHtml(item.id)}" ${selectedPlanningMilestones.has(item.id) ? "checked" : ""}>
      <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.start_date)}</small></span></label>
    `).join("") || "<span class=\"planning-empty-milestones\">No se identificaron hitos con fecha.</span>";
  }

  function renderPlanningResult() {
    const container = document.getElementById("planning-results");
    if (!planningResult?.schedule?.items?.length) {
      container.hidden = true;
      return;
    }
    const schedule = planningResult.schedule;
    const items = planningItems();
    const range = planningRange(items);
    const { startValue, endValue, start, duration, weekCount } = range;
    const minimumWidth = 370 + (weekCount * 58);
    document.getElementById("planning-total").textContent = items.length;
    document.getElementById("planning-milestones").textContent = (
      items.filter((item) => item.type === "Hito").length
    );
    document.getElementById("planning-start").textContent = startValue;
    document.getElementById("planning-end").textContent = endValue;
    document.getElementById("planning-result-title").textContent = (
      schedule.project_name || planningResult.project?.name || "Cronograma ejecutivo"
    );
    renderPlanningMilestones(items);
    const weekAxis = Array.from({ length: weekCount }, (_, index) => (
      `<span>Semana ${index + 1}</span>`
    )).join("");
    document.getElementById("planning-timeline").style.minWidth = `${minimumWidth}px`;
    document.getElementById("planning-timeline").innerHTML = `<div class="planning-week-row"><span></span><div class="planning-week-axis" style="grid-template-columns:repeat(${weekCount},minmax(54px,1fr))">${weekAxis}</div><span></span></div>` + items.map((item) => {
      const left = planningPosition(item.start_date, start, duration);
      const right = planningPosition(item.end_date, start, duration);
      const width = Math.max(item.type === "Hito" ? 1.5 : 2.5, right - left);
      const itemClass = item.type.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const milestoneState = item.type === "Hito" && !selectedPlanningMilestones.has(item.id) ? " planning-hito-unselected" : "";
      return `<div class="planning-timeline-row${milestoneState}">
        <div class="planning-item-label"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.type)} · ${escapeHtml(item.owner || "Por definir")}</small></div>
        <div class="planning-track"><span class="planning-bar planning-bar-${itemClass}" style="left:${left}%;width:${width}%" title="${escapeHtml(item.start_date)} → ${escapeHtml(item.end_date)} · ${escapeHtml(item.evidence || "Sin referencia")}"></span></div>
        <div class="planning-item-dates">${escapeHtml(item.start_date)}<br>${escapeHtml(item.end_date)}</div>
      </div>`;
    }).join("");
    document.getElementById("planning-assumptions").innerHTML = (
      (schedule.assumptions || []).map((value) => `<li>${escapeHtml(value)}</li>`).join("")
      || "<li>Sin supuestos informados.</li>"
    );
    document.getElementById("planning-warnings").innerHTML = (
      (schedule.warnings || []).map((value) => `<li>${escapeHtml(value)}</li>`).join("")
      || "<li>Sin alertas documentales.</li>"
    );
    container.hidden = false;
  }

  function planningFileName(extension) {
    const project = planningResult?.schedule?.project_name || "cronograma";
    const safe = project.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "");
    return `${safe || "cronograma"}.${extension}`;
  }

  function downloadPlanningBlob(blob, extension) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = planningFileName(extension);
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportPlanningExcel() {
    if (!planningResult) return;
    const rows = planningItems().map((item) => `<tr><td>${escapeHtml(item.id)}</td><td>${escapeHtml(item.type)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.start_date)}</td><td>${escapeHtml(item.end_date)}</td><td>${escapeHtml(item.owner || "")}</td><td>${item.progress || 0}%</td><td>${item.type === "Hito" && selectedPlanningMilestones.has(item.id) ? "Sí" : "No"}</td><td>${escapeHtml(item.evidence || "")}</td></tr>`).join("");
    const workbook = `\ufeff<html><head><meta charset="UTF-8"></head><body><table border="1"><tr><th>ID</th><th>Tipo</th><th>Elemento</th><th>Inicio</th><th>Término</th><th>Responsable</th><th>Avance</th><th>Hito seleccionado</th><th>Evidencia</th></tr>${rows}</table></body></html>`;
    downloadPlanningBlob(new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" }), "xls");
  }

  function exportPlanningPng() {
    if (!planningResult) return;
    const items = planningItems();
    const range = planningRange(items);
    const rowHeight = 42;
    const labelWidth = 260;
    const chartWidth = Math.max(850, range.weekCount * 72);
    const canvas = document.createElement("canvas");
    canvas.width = labelWidth + chartWidth + 40;
    canvas.height = 105 + (items.length * rowHeight);
    const context = canvas.getContext("2d");
    context.fillStyle = "#071426";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#f8fafc";
    context.font = "bold 22px Arial";
    context.fillText(planningResult.schedule.project_name || "Cronograma ejecutivo", 20, 32);
    context.font = "12px Arial";
    context.fillStyle = "#94a3b8";
    context.fillText(`${range.startValue} — ${range.endValue}`, 20, 53);
    const chartLeft = labelWidth;
    for (let week = 0; week < range.weekCount; week += 1) {
      const x = chartLeft + ((week / range.weekCount) * chartWidth);
      context.strokeStyle = "#203752";
      context.beginPath(); context.moveTo(x, 67); context.lineTo(x, canvas.height - 15); context.stroke();
      context.fillStyle = "#8eb4dc"; context.font = "10px Arial";
      context.fillText(`Semana ${week + 1}`, x + 4, 79);
    }
    items.forEach((item, index) => {
      const y = 91 + (index * rowHeight);
      context.fillStyle = "#e5edf8"; context.font = "11px Arial";
      context.fillText(item.name.slice(0, 38), 20, y + 15);
      const left = chartLeft + (planningPosition(item.start_date, range.start, range.duration) / 100 * chartWidth);
      const right = chartLeft + (planningPosition(item.end_date, range.start, range.duration) / 100 * chartWidth);
      if (item.type === "Hito") {
        context.fillStyle = selectedPlanningMilestones.has(item.id) ? "#f59e0b" : "#475569";
        context.save(); context.translate(left + 6, y + 12); context.rotate(Math.PI / 4); context.fillRect(-6, -6, 12, 12); context.restore();
      } else {
        context.fillStyle = item.type === "Fase" ? "#22c55e" : item.type === "Entregable" ? "#7c3aed" : "#3b82f6";
        context.fillRect(left, y + 5, Math.max(8, right - left), 14);
      }
    });
    canvas.toBlob((blob) => {
      if (blob) downloadPlanningBlob(blob, "png");
    }, "image/png");
  }

  function setPlanningProgress(title, message, visible = true) {
    document.getElementById("planning-progress").hidden = !visible;
    document.getElementById("planning-progress-title").textContent = title;
    document.getElementById("planning-progress-message").textContent = message;
  }

  async function waitForPlanning(analysisId) {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const result = await riskApi(`/plans/${analysisId}`);
      if (result.status === "COMPLETED") return result;
      if (result.status === "FAILED") {
        throw new Error(result.message || "No fue posible generar el cronograma.");
      }
      setPlanningProgress(
        "Construyendo cronograma",
        "Extrayendo fechas, tareas e hitos relevantes."
      );
      await delay(3000);
    }
    throw new Error("El análisis excedió el tiempo de espera.");
  }

  async function generatePlanning() {
    const button = document.getElementById("planning-generate");
    const projectName = document.getElementById("planning-project-name").value.trim();
    const files = [...document.getElementById("planning-files").files];
    const extensions = new Set(["pdf", "pptx", "xlsx", "xls"]);
    if (!projectName) {
      setPlanningProgress("Falta el proyecto", "Indica el nombre del proyecto.");
      return;
    }
    if (!files.length || files.length > 3) {
      setPlanningProgress("Carga requerida", "Selecciona entre uno y tres archivos.");
      return;
    }
    if (files.some((file) => (
      !extensions.has(file.name.split(".").pop().toLowerCase())
      || file.size > 20971520
    ))) {
      setPlanningProgress(
        "Archivo no válido",
        "Usa PDF, PPTX, XLSX o XLS de hasta 20 MB."
      );
      return;
    }
    button.disabled = true;
    document.getElementById("planning-results").hidden = true;
    try {
      setPlanningProgress("Preparando carga", "Creando un espacio privado en DEV.");
      const created = await riskApi("/plans", {
        method: "POST",
        body: JSON.stringify({
          project: { name: projectName },
          files: files.map((file) => ({
            name: file.name,
            contentType: file.type || "application/octet-stream"
          }))
        })
      });
      setPlanningProgress("Cargando documentos", "Los archivos se cifran en Amazon S3.");
      await uploadRiskFiles(
        created.uploads,
        files.map((file) => ({ file }))
      );
      await riskApi(`/plans/${created.analysisId}/start`, { method: "POST" });
      planningResult = await waitForPlanning(created.analysisId);
      selectedPlanningMilestones.clear();
      planningResult.schedule.items
        .filter((item) => item.type === "Hito")
        .forEach((item) => selectedPlanningMilestones.add(item.id));
      renderPlanningResult();
      setPlanningProgress(
        "Cronograma generado",
        "Revisa fechas, hitos, supuestos y brechas documentales.",
        false
      );
    } catch (reason) {
      setPlanningProgress("No fue posible generar el cronograma", reason.message);
    } finally {
      button.disabled = false;
    }
  }

  document.getElementById("planning-generate").addEventListener(
    "click",
    generatePlanning
  );
  document.getElementById("planning-milestone-selector").addEventListener("change", (event) => {
    const id = event.target.dataset.planningMilestone;
    if (!id) return;
    if (event.target.checked) selectedPlanningMilestones.add(id);
    else selectedPlanningMilestones.delete(id);
    renderPlanningResult();
  });
  document.getElementById("planning-export-excel").addEventListener("click", exportPlanningExcel);
  document.getElementById("planning-export-png").addEventListener("click", exportPlanningPng);

  async function followupRequest(path = "", options = {}) {
    const idToken = getToken();
    if (!idToken) {
      await beginLogin();
      throw new Error("La sesión expiró.");
    }
    const response = await window.fetch(`${config.followupApiUrl}${path}`, {
      ...options,
      headers: {
        authorization: `Bearer ${idToken}`,
        "content-type": "application/json",
        ...(options.headers || {})
      },
      cache: "no-store"
    });
    if (response.status === 401) {
      window.sessionStorage.removeItem(tokenKey);
      await beginLogin();
      throw new Error("La sesión expiró.");
    }
    if (!response.ok) {
      let message = "No fue posible registrar el seguimiento.";
      try {
        message = (await response.json()).message || message;
      } catch {
        // Preserve the safe generic error.
      }
      throw new Error(message);
    }
    return response;
  }

  followupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.getElementById("followup-save");
    button.disabled = true;
    followupResult.hidden = true;
    try {
      const response = await followupRequest("", {
        method: "POST",
        body: JSON.stringify({
          pmo_id: document.getElementById("followup-pmo-id").value,
          project_name: document.getElementById("followup-project-name").value,
          review_completed: document.getElementById("followup-reviewed").checked,
          note: document.getElementById("followup-note").value
        })
      });
      const payload = await response.json();
      followupResult.className = "followup-result followup-result-success";
      followupResult.textContent = (
        `Seguimiento guardado: ${payload.entry.entry_id}`
      );
      followupResult.hidden = false;
      document.getElementById("followup-note").value = "";
    } catch (reason) {
      followupResult.className = "followup-result followup-result-error";
      followupResult.textContent = reason.message;
      followupResult.hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  billingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.getElementById("billing-save");
    button.disabled = true;
    billingResult.hidden = true;
    try {
      const response = await followupRequest("/billing", {
        method: "POST",
        body: JSON.stringify({
          pmo_id: document.getElementById("billing-pmo-id").value,
          project_name: document.getElementById("billing-project-name").value,
          budget_amount: Number(
            document.getElementById("billing-budget").value
          ) || 0,
          billing_eligible: document.getElementById(
            "billing-eligible"
          ).checked,
          billing_reliability: Number(
            document.getElementById("billing-reliability").value
          ),
          note: document.getElementById("billing-note").value
        })
      });
      const payload = await response.json();
      billingResult.className = "followup-result followup-result-success";
      billingResult.textContent = (
        `Revisión guardada: ${payload.entry.entry_id}`
      );
      billingResult.hidden = false;
      await loadBillingSummary();
    } catch (reason) {
      billingResult.className = "followup-result followup-result-error";
      billingResult.textContent = reason.message;
      billingResult.hidden = false;
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById("followup-export").addEventListener(
    "click",
    async () => {
      followupResult.hidden = true;
      try {
        const response = await followupRequest("/export", {
          method: "GET",
          headers: {}
        });
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Seguimiento de proyectos.csv";
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (reason) {
        followupResult.className = "followup-result followup-result-error";
        followupResult.textContent = reason.message;
        followupResult.hidden = false;
      }
    }
  );

  function validateConfig() {
    const required = [
      "portalUrl",
      "cognitoDomain",
      "userPoolClientId",
      "embedApiUrl",
      "projectManagerDashboardId",
      "riskApiUrl",
      "followupApiUrl"
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
    window.localStorage.setItem(
      authTransactionKey,
      JSON.stringify({ verifier, state, createdAt: Date.now() })
    );
    if (window.location.hash) {
      window.localStorage.setItem(returnHashKey, window.location.hash);
    }
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
    let expectedState = window.sessionStorage.getItem(stateKey);
    let verifier = window.sessionStorage.getItem(verifierKey);
    if (!expectedState || !verifier) {
      try {
        const transaction = JSON.parse(
          window.localStorage.getItem(authTransactionKey) || "{}"
        );
        const transactionIsCurrent = (
          transaction.createdAt &&
          Date.now() - transaction.createdAt < 10 * 60 * 1000
        );
        if (transactionIsCurrent) {
          expectedState = transaction.state;
          verifier = transaction.verifier;
        }
      } catch {
        // An invalid local transaction is handled as a fresh login below.
      }
    }
    if (!expectedState || state !== expectedState || !verifier) {
      window.sessionStorage.removeItem(verifierKey);
      window.sessionStorage.removeItem(stateKey);
      window.localStorage.removeItem(authTransactionKey);
      window.history.replaceState(
        {},
        document.title,
        window.localStorage.getItem(returnHashKey) || "/"
      );
      await beginLogin();
      return false;
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
    window.localStorage.removeItem(authTransactionKey);
    const returnHash = window.localStorage.getItem(returnHashKey) || "";
    window.localStorage.removeItem(returnHashKey);
    window.history.replaceState({}, document.title, returnHash || "/");
    return true;
  }

  function callbackFieldName(column) {
    const field = Object.values(column || {})[0] || {};
    const typedField = Object.values(field)[0] || {};
    return typedField.Column?.ColumnName || "";
  }

  function callbackRawValue(rawValue, formattedValue) {
    const value = Object.values(rawValue || {})[0];
    return value === undefined || value === null
      ? (formattedValue || "")
      : String(value);
  }

  function normalizedFieldName(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function handleFollowupCallback(message) {
    const dataPoint = message?.DataPoints?.[0];
    if (!dataPoint) {
      return;
    }
    const values = {};
    dataPoint.Columns.forEach((column, index) => {
      values[normalizedFieldName(callbackFieldName(column))] = (
        callbackRawValue(
          dataPoint.RawValues[index],
          dataPoint.FormattedValues[index]
        )
      );
    });
    const pmoId = values["pmo id"] || values["pmo_id"] || "";
    const projectName = (
      values.proyecto || values["nombre del proyecto"] || ""
    );
    openFollowup(pmoId, projectName);
  }

  async function handleBillingCallback(message) {
    const dataPoint = message?.DataPoints?.[0];
    if (!dataPoint) {
      return;
    }
    const values = {};
    dataPoint.Columns.forEach((column, index) => {
      values[normalizedFieldName(callbackFieldName(column))] = (
        callbackRawValue(
          dataPoint.RawValues[index],
          dataPoint.FormattedValues[index]
        )
      );
    });
    let pmoId = values["pmo id"] || values.pmo_id || "";
    const projectName = (
      values.proyecto || values["nombre del proyecto"] || ""
    );
    let budget = values["total presupuestado"] || 0;
    if ((!pmoId || !budget) && projectName) {
      try {
        const response = await followupRequest(
          `/project?name=${encodeURIComponent(projectName)}`,
          { method: "GET", headers: {} }
        );
        const project = await response.json();
        pmoId = pmoId || project.pmo_id || "";
        budget = budget || project.budget_amount || 0;
      } catch {
        // The form remains usable with values supplied by the visual.
      }
    }
    await openBilling(pmoId, projectName, budget);
  }

  async function registerFollowupCallback() {
    if (!embeddedDashboard) {
      return;
    }
    const sheets = await embeddedDashboard.getSheets();
    let projectActionRegistered = false;
    let billingActionRegistered = false;
    for (const sheet of sheets) {
      const visuals = await embeddedDashboard.getSheetVisuals(sheet.SheetId);
      const projectTable = visuals.find((visual) => (
        visual.VisualId.endsWith("overview-project-table")
      ));
      if (projectTable) {
        const legacyActionId = "portfolio-followup-open-form";
        const actionId = "portfolio-followup-side-panel";
        try {
          await embeddedDashboard.removeVisualActions(
            sheet.SheetId,
            projectTable.VisualId,
            [legacyActionId, actionId]
          );
        } catch {
          // The action may not exist yet in the published dashboard.
        }
        const result = await embeddedDashboard.addVisualActions(
          sheet.SheetId,
          projectTable.VisualId,
          [{
            CustomActionId: actionId,
            Name: "Registrar seguimiento",
            Status: "ENABLED",
            Trigger: "DATA_POINT_CLICK",
            ActionOperations: [{
              CallbackOperation: { EmbeddingMessage: {} }
            }]
          }]
        );
        if (!result?.success) {
          throw new Error(
            `QuickSight rechazó seguimiento: ${result?.errorCode || "sin detalle"}`
          );
        }
        projectActionRegistered = true;
      }
      const billingTable = visuals.find((visual) => (
        visual.VisualId === "179581b7-5d3e-46df-b1c5-4c5b97e1514e"
      ));
      if (billingTable) {
        const actionId = "billing-review-side-panel";
        try {
          await embeddedDashboard.removeVisualActions(
            sheet.SheetId,
            billingTable.VisualId,
            [actionId]
          );
        } catch {
          // The action may not exist yet in the published dashboard.
        }
        const result = await embeddedDashboard.addVisualActions(
          sheet.SheetId,
          billingTable.VisualId,
          [{
            CustomActionId: actionId,
            Name: "Revisar facturación",
            Status: "ENABLED",
            Trigger: "DATA_POINT_CLICK",
            ActionOperations: [{
              CallbackOperation: { EmbeddingMessage: {} }
            }]
          }]
        );
        if (!result?.success) {
          throw new Error(
            `QuickSight rechazó facturación: ${result?.errorCode || "sin detalle"}`
          );
        }
        billingActionRegistered = true;
      }
    }
    if (!projectActionRegistered || !billingActionRegistered) {
      throw new Error("No se encontraron ambas tablas de control PMO.");
    }
    return true;
  }

  async function registerFollowupCallbackWithRetry() {
    let lastError;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await registerFollowupCallback();
        followupCallbackReady = true;
        return;
      } catch (reason) {
        lastError = reason;
        await new Promise((resolve) => window.setTimeout(resolve, 400));
      }
    }
    throw lastError;
  }

  async function ensureFollowupCallback() {
    if (followupCallbackReady) {
      return;
    }
    if (!followupCallbackPromise) {
      followupCallbackPromise = registerFollowupCallbackWithRetry()
        .finally(() => {
          followupCallbackPromise = null;
        });
    }
    await followupCallbackPromise;
  }

  async function loadDashboard(idToken, dashboardKey) {
    loadingMessage.textContent = "Generando una sesión privada de QuickSight.";
    dashboardReady = false;
    followupCallbackReady = false;
    followupCallbackPromise = null;
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
    if (!window.QuickSightEmbedding?.createEmbeddingContext) {
      throw new Error("No fue posible cargar el componente de QuickSight.");
    }
    if (!embeddingContext) {
      embeddingContext = await window.QuickSightEmbedding.createEmbeddingContext();
    }
    dashboard.replaceChildren();
    embeddedDashboard = await embeddingContext.embedDashboard(
      {
        url: payload.embedUrl,
        container: dashboard,
        width: "100%",
        height: "100%",
        resizeHeightOnSizeChangedEvent: false
      },
      {
        locale: "es-ES",
        toolbarOptions: {
          export: true,
          reset: true,
          undoRedo: true
        },
        onMessage: async (event) => {
          if (event.eventName === "CONTENT_LOADED") {
            dashboardReady = true;
            activeDashboardKey = dashboardKey;
            renderView();
            if (!followupCallbackReady) {
              try {
                await ensureFollowupCallback();
              } catch (reason) {
                console.warn("No se pudo registrar Seguimiento.", reason);
              }
            }
          }
          if (
            event.eventName === "CALLBACK_OPERATION_INVOKED" &&
            event.message?.CustomActionId === "portfolio-followup-side-panel"
          ) {
            handleFollowupCallback(event.message);
          }
          if (
            event.eventName === "CALLBACK_OPERATION_INVOKED" &&
            event.message?.CustomActionId === "billing-review-side-panel"
          ) {
            handleBillingCallback(event.message);
          }
        }
      }
    );
    try {
      await ensureFollowupCallback();
    } catch (reason) {
      console.warn("No se pudo registrar Seguimiento.", reason);
    }
    logout.hidden = false;
  }

  logout.addEventListener("click", () => {
    window.sessionStorage.clear();
    window.localStorage.removeItem(authTransactionKey);
    window.localStorage.removeItem(returnHashKey);
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
      const authenticated = await exchangeCode(
        params.get("code"),
        params.get("state")
      );
      if (!authenticated) {
        return;
      }
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
    if (isFollowupLink()) {
      const followup = followupParameters();
      openFollowup(
        followup.get("pmo_id") || "",
        followup.get("project_name") || ""
      );
    }
  }

  // ─── Minutes & Reports ───────────────────────────────────────────
  const minutesGenerate = document.getElementById("minutes-generate");
  const minutesTranscription = document.getElementById("minutes-transcription");
  const minutesProjectName = document.getElementById("minutes-project-name");
  const minutesProgress = document.getElementById("minutes-progress");
  const minutesResults = document.getElementById("minutes-results");
  const minutesMinutaContent = document.getElementById("minutes-minuta-content");
  const minutesReportContent = document.getElementById("minutes-report-content");
  const minutesExportMinuta = document.getElementById("minutes-export-minuta");
  const minutesExportReport = document.getElementById("minutes-export-report");
  const minutesReset = document.getElementById("minutes-reset");
  let minutesData = null;

  function renderMinuta(m) {
    const s = m.session || {};
    let html = `<table class="minutes-table"><tbody>`;
    html += `<tr><td><strong>Proyecto</strong></td><td>${s.projectName || "No especificado"}</td></tr>`;
    html += `<tr><td><strong>Fecha y hora</strong></td><td>${s.dateTime || "No especificado"}</td></tr>`;
    html += `<tr><td><strong>Lugar / Plataforma</strong></td><td>${s.location || "No especificado"}</td></tr>`;
    html += `<tr><td><strong>Facilitador</strong></td><td>${s.facilitator || "No especificado"}</td></tr>`;
    html += `<tr><td><strong>Asistentes</strong></td><td>${(s.attendees || []).join(", ") || "No especificado"}</td></tr>`;
    html += `<tr><td><strong>Ausentes</strong></td><td>${(s.absentees || []).join(", ") || "No especificado"}</td></tr>`;
    html += `</tbody></table>`;

    if ((m.previousAgreements || []).length) {
      html += `<h4>Revisi\u00f3n de acuerdos anteriores</h4><ul>`;
      for (const a of m.previousAgreements) {
        html += `<li><strong>${a.description}</strong> \u2014 ${a.status}${a.comments ? ` (${a.comments})` : ""}</li>`;
      }
      html += `</ul>`;
    }

    if ((m.topicsDiscussed || []).length) {
      html += `<h4>Temas tratados</h4>`;
      for (const t of m.topicsDiscussed) {
        html += `<p><strong>${t.topic}:</strong> ${t.summary}</p>`;
      }
    }

    if ((m.newAgreements || []).length) {
      html += `<h4>Nuevos acuerdos y compromisos</h4><table class="minutes-table"><thead><tr><th>Acci\u00f3n</th><th>Responsable</th><th>Fecha l\u00edmite</th></tr></thead><tbody>`;
      for (const a of m.newAgreements) {
        html += `<tr><td>${a.action}</td><td>${a.responsible}</td><td>${a.deadline || "Por definir"}</td></tr>`;
      }
      html += `</tbody></table>`;
    }

    const ns = m.nextSession || {};
    if (ns.date || ns.objective) {
      html += `<h4>Pr\u00f3xima sesi\u00f3n</h4><p>`;
      if (ns.date) html += `<strong>Fecha:</strong> ${ns.date} `;
      if (ns.time) html += `<strong>Hora:</strong> ${ns.time} `;
      if (ns.objective) html += `<br><strong>Objetivo:</strong> ${ns.objective}`;
      html += `</p>`;
    }

    return html;
  }

  function renderReport(r) {
    let html = `<h4>Resumen</h4><p>${(r.summary || "").replace(/\n/g, "<br>")}</p>`;

    if ((r.nextSteps || []).length) {
      html += `<h4>Pr\u00f3ximos pasos y compromisos</h4><table class="minutes-table"><thead><tr><th>Acci\u00f3n</th><th>Responsable</th><th>Fecha</th><th>Prioridad</th></tr></thead><tbody>`;
      for (const s of r.nextSteps) {
        html += `<tr><td>${s.action}</td><td>${s.responsible}</td><td>${s.deadline || "Por definir"}</td><td>${s.priority || "Media"}</td></tr>`;
      }
      html += `</tbody></table>`;
    }

    if ((r.risks || []).length) {
      html += `<h4>Riesgos identificados</h4><table class="minutes-table"><thead><tr><th>Riesgo</th><th>Nivel</th><th>Mitigaci\u00f3n</th></tr></thead><tbody>`;
      for (const risk of r.risks) {
        html += `<tr><td>${risk.description}</td><td>${risk.level}</td><td>${risk.mitigation || "Por definir"}</td></tr>`;
      }
      html += `</tbody></table>`;
    }

    return html;
  }

  if (minutesGenerate) {
    minutesGenerate.addEventListener("click", async () => {
      const transcription = minutesTranscription.value.trim();
      if (!transcription) {
        alert("Ingresa la transcripci\u00f3n de la sesi\u00f3n.");
        return;
      }
      const apiUrl = config.minutesApiUrl;
      if (!apiUrl) {
        alert("La URL de la API de minutas no est\u00e1 configurada.");
        return;
      }
      minutesProgress.hidden = false;
      minutesResults.hidden = true;
      minutesGenerate.disabled = true;

      try {
        const token = getToken();
        const resp = await fetch(`${apiUrl}/generate`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            transcription,
            projectName: minutesProjectName.value.trim(),
            mode: "both",
          }),
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.error || `Error ${resp.status}`);
        }
        minutesData = await resp.json();
        minutesMinutaContent.innerHTML = minutesData.minutes ? renderMinuta(minutesData.minutes) : "<p>No se gener\u00f3 minuta.</p>";
        minutesReportContent.innerHTML = minutesData.report ? renderReport(minutesData.report) : "<p>No se gener\u00f3 reporte.</p>";
        minutesResults.hidden = false;
      } catch (err) {
        alert(`Error al generar: ${err.message}`);
      } finally {
        minutesProgress.hidden = true;
        minutesGenerate.disabled = false;
      }
    });
  }

  if (minutesReset) {
    minutesReset.addEventListener("click", () => {
      minutesResults.hidden = true;
      minutesTranscription.value = "";
      minutesProjectName.value = "";
      minutesData = null;
    });
  }

  // ─── DOCX Export ────────────────────────────────────────────────
  function buildMinutaDocx(m) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell,
      WidthType, HeadingLevel, AlignmentType, BorderStyle } = window.docx;

    const s = m.session || {};
    const children = [];

    children.push(new Paragraph({
      text: "MINUTA DE SESI\u00d3N",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }));
    children.push(new Paragraph({ text: "" }));

    // Session data table
    const sessionRows = [
      ["Proyecto", s.projectName || "No especificado"],
      ["Fecha y hora", s.dateTime || "No especificado"],
      ["Lugar / Plataforma", s.location || "No especificado"],
      ["Facilitador", s.facilitator || "No especificado"],
      ["Asistentes", (s.attendees || []).join(", ") || "No especificado"],
      ["Ausentes", (s.absentees || []).join(", ") || "No especificado"],
    ];
    children.push(new Paragraph({ text: "1. Datos de la sesi\u00f3n", heading: HeadingLevel.HEADING_2 }));
    for (const [label, value] of sessionRows) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${label}: `, bold: true }),
          new TextRun({ text: value }),
        ],
      }));
    }

    // Previous agreements
    if ((m.previousAgreements || []).length) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "2. Revisi\u00f3n de acuerdos anteriores", heading: HeadingLevel.HEADING_2 }));
      for (const a of m.previousAgreements) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `\u2022 ${a.description}`, bold: true }),
            new TextRun({ text: ` \u2014 Estado: ${a.status}` }),
            ...(a.comments ? [new TextRun({ text: ` (${a.comments})` })] : []),
          ],
        }));
      }
    }

    // Topics discussed
    if ((m.topicsDiscussed || []).length) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "3. Temas tratados y discusi\u00f3n", heading: HeadingLevel.HEADING_2 }));
      for (const t of m.topicsDiscussed) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${t.topic}: `, bold: true }),
            new TextRun({ text: t.summary }),
          ],
        }));
      }
    }

    // New agreements table
    if ((m.newAgreements || []).length) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "4. Nuevos acuerdos y compromisos", heading: HeadingLevel.HEADING_2 }));
      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Acci\u00f3n / Tarea", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Responsable", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Fecha l\u00edmite", bold: true })] })] }),
        ],
      });
      const dataRows = m.newAgreements.map(a => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: a.action })] }),
          new TableCell({ children: [new Paragraph({ text: a.responsible })] }),
          new TableCell({ children: [new Paragraph({ text: a.deadline || "Por definir" })] }),
        ],
      }));
      children.push(new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
    }

    // Next session
    const ns = m.nextSession || {};
    if (ns.date || ns.objective) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "5. Pr\u00f3xima sesi\u00f3n", heading: HeadingLevel.HEADING_2 }));
      if (ns.date) children.push(new Paragraph({ children: [new TextRun({ text: "Fecha: ", bold: true }), new TextRun({ text: ns.date })] }));
      if (ns.time) children.push(new Paragraph({ children: [new TextRun({ text: "Hora: ", bold: true }), new TextRun({ text: ns.time })] }));
      if (ns.objective) children.push(new Paragraph({ children: [new TextRun({ text: "Objetivo: ", bold: true }), new TextRun({ text: ns.objective })] }));
    }

    return new Document({
      sections: [{ children }],
    });
  }

  function buildReportDocx(r) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell,
      WidthType, HeadingLevel, AlignmentType } = window.docx;

    const children = [];

    children.push(new Paragraph({
      text: "REPORTE EJECUTIVO",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }));
    children.push(new Paragraph({ text: "" }));

    // Summary
    children.push(new Paragraph({ text: "1. Resumen", heading: HeadingLevel.HEADING_2 }));
    for (const paragraph of (r.summary || "").split("\n").filter(Boolean)) {
      children.push(new Paragraph({ text: paragraph }));
    }

    // Next steps
    if ((r.nextSteps || []).length) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "2. Pr\u00f3ximos pasos y compromisos", heading: HeadingLevel.HEADING_2 }));
      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Acci\u00f3n", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Responsable", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Fecha", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Prioridad", bold: true })] })] }),
        ],
      });
      const dataRows = r.nextSteps.map(s => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: s.action })] }),
          new TableCell({ children: [new Paragraph({ text: s.responsible })] }),
          new TableCell({ children: [new Paragraph({ text: s.deadline || "Por definir" })] }),
          new TableCell({ children: [new Paragraph({ text: s.priority || "Media" })] }),
        ],
      }));
      children.push(new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
    }

    // Risks
    if ((r.risks || []).length) {
      children.push(new Paragraph({ text: "" }));
      children.push(new Paragraph({ text: "3. Riesgos identificados", heading: HeadingLevel.HEADING_2 }));
      const headerRow = new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Riesgo", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Nivel", bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Mitigaci\u00f3n", bold: true })] })] }),
        ],
      });
      const dataRows = r.risks.map(risk => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: risk.description })] }),
          new TableCell({ children: [new Paragraph({ text: risk.level })] }),
          new TableCell({ children: [new Paragraph({ text: risk.mitigation || "Por definir" })] }),
        ],
      }));
      children.push(new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));
    }

    return new Document({
      sections: [{ children }],
    });
  }

  async function exportDocx(doc, filename) {
    const { Packer } = window.docx;
    const blob = await Packer.toBlob(doc);
    window.saveAs(blob, filename);
  }

  if (minutesExportMinuta) {
    minutesExportMinuta.addEventListener("click", async () => {
      if (!minutesData || !minutesData.minutes) return;
      const projectName = (minutesData.minutes.session || {}).projectName || "Proyecto";
      const doc = buildMinutaDocx(minutesData.minutes);
      await exportDocx(doc, `Minuta - ${projectName}.docx`);
    });
  }

  if (minutesExportReport) {
    minutesExportReport.addEventListener("click", async () => {
      if (!minutesData || !minutesData.report) return;
      const projectName = minutesProjectName.value.trim() || "Proyecto";
      const doc = buildReportDocx(minutesData.report);
      await exportDocx(doc, `Reporte Ejecutivo - ${projectName}.docx`);
    });
  }

  // ─── End Minutes ────────────────────────────────────────────────

  start().catch((reason) => {
    showError(reason.message || "Error inesperado al cargar el dashboard.");
  });
})();

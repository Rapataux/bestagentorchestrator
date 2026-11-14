/* ==========================================================================
   Agent Orchestration Benchmark — Interactive Client Logic
   Zero dependencies, progressive enhancement, accessible keyboard support
   ========================================================================== */

(function () {
  "use strict";

  /* 1. Mobile Navigation Toggle */
  const menuBtn = document.getElementById("mobile-menu-btn");
  const primaryNav = document.getElementById("primary-nav");

  if (menuBtn && primaryNav) {
    menuBtn.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "Close" : "Menu";
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        primaryNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
        menuBtn.focus();
      }
    });
  }

  /* 2. Hero Live Patch Verification Simulator */
  const TRACE_SCENARIOS = {
    operator: {
      stages: [
        { text: "1. Task intake", cls: "is-pass" },
        { text: "2. Managed multi-agent build", cls: "is-pass" },
        { text: "3. Behavioral verification gate", cls: "is-pass" },
        { text: "4. Verified diff ready", cls: "is-pass" }
      ],
      code: [
        '<span class="diff-comment">// Verified output: concurrent refresh + caller cancellation handled</span>',
        "export async function refreshSession(pool: Pool, signal?: AbortSignal) {",
        '  if (!pool.inflight) pool.inflight = fetchToken(pool.id).finally(() => {',
        "    pool.inflight = null;",
        "  });",
        '<span class="diff-add">+ return raceWithAbort(pool.inflight, signal, () => pool.releaseWaiter());</span>',
        "}"
      ].join("\n"),
      unitResult: "Unit suite + verification gate green",
      reviewLoad: "1 verified diff ready for review",
      tone: "pass",
      finding:
        "Operator's verification layer caught the uncancelled timeout waiter before surfacing the PR, delivering a single clean diff instead of leaving edge-case debugging to human reviewers."
    },
    multiplexer: {
      stages: [
        { text: "1. Spawn 4 Git worktrees", cls: "" },
        { text: "2. 4 parallel agent runs", cls: "" },
        { text: "3. Existing unit suite: 48/48", cls: "is-pass" },
        { text: "4. 4 unverified PRs opened", cls: "is-warn" }
      ],
      code: [
        '<span class="diff-comment">// Branch worktree-02/fix-401 (passes existing unit suite)</span>',
        "export async function refreshSession(pool: Pool) {",
        "  if (!pool.inflight) {",
        "    pool.inflight = fetchToken(pool.id);",
        "  }",
        '<span class="diff-warn">+ return await pool.inflight; // callers hang if upstream stalls</span>',
        "}"
      ].join("\n"),
      unitResult: "48 / 48 green across all 4 PRs",
      reviewLoad: "4 competing PRs (612 lines manual audit)",
      tone: "warn",
      finding:
        "All four branches pass existing unit tests, but none clear pool.inflight on upstream timeout or caller cancellation. A staff engineer must read all four diffs manually to spot the leak."
    },
    single: {
      stages: [
        { text: "1. Single prompt in terminal", cls: "" },
        { text: "2. First plausible patch", cls: "" },
        { text: "3. Existing unit suite: 48/48", cls: "is-pass" },
        { text: "4. Merged with silent race", cls: "is-fail" }
      ],
      code: [
        '<span class="diff-comment">// Single-pass terminal patch</span>',
        "let refreshing = false;",
        "export async function refreshSession(pool: Pool) {",
        '<span class="diff-warn">+ if (refreshing) return pool.currentToken; // stale 401 token!</span>',
        "  refreshing = true;",
        "  try { return await fetchToken(pool.id); } finally { refreshing = false; }",
        "}"
      ].join("\n"),
      unitResult: "48 / 48 green (mocked clock)",
      reviewLoad: "1 plausible diff (no verification gate)",
      tone: "fail",
      finding:
        "Concurrent retries immediately receive the expired token while refresh is still in flight, causing cascading 401 logouts under production traffic despite green unit mocks."
    }
  };

  const traceTabs = Array.from(document.querySelectorAll("[data-trace-mode]"));
  const elStages = document.getElementById("trace-stages");
  const elCode = document.getElementById("trace-code");
  const elUnit = document.getElementById("trace-unit-metric");
  const elLoad = document.getElementById("trace-load-metric");
  const elFinding = document.getElementById("trace-finding");

  function activateTrace(mode, focusTab) {
    const data = TRACE_SCENARIOS[mode];
    if (!data || !elStages || !elCode || !elUnit || !elLoad || !elFinding) return;

    traceTabs.forEach(function (tab) {
      const selected = tab.getAttribute("data-trace-mode") === mode;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });

    elStages.innerHTML = data.stages
      .map(function (stage) {
        const cls = stage.cls ? "stage-pill " + stage.cls : "stage-pill";
        return '<span class="' + cls + '">' + stage.text + "</span>";
      })
      .join("");

    elCode.innerHTML = data.code;
    elUnit.textContent = data.unitResult;
    elLoad.textContent = data.reviewLoad;
    elFinding.setAttribute("data-tone", data.tone);
    elFinding.textContent = data.finding;
  }

  if (traceTabs.length > 0) {
    traceTabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTrace(tab.getAttribute("data-trace-mode"), false);
      });

      tab.addEventListener("keydown", function (event) {
        let nextIndex = -1;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % traceTabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + traceTabs.length) % traceTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = traceTabs.length - 1;
        if (nextIndex !== -1) {
          event.preventDefault();
          activateTrace(traceTabs[nextIndex].getAttribute("data-trace-mode"), true);
        }
      });
    });
  }

  /* 3. Interactive Requirement & Architecture Matcher */
  const TOOLS_DATA = [
    {
      id: "askus-operator",
      name: "Askus Operator",
      category: "Verification-gated SDLC infrastructure",
      caps: {
        verification_gate: 2,
        sdlc_governance: 2,
        multi_provider: 2,
        sovereign_zdr: 2,
        local_worktrees: 1,
        embeddable_sdk: 0
      },
      defaultNote:
        "Governed software engineering infrastructure with dedicated modes for Autodev, deep code review, refactoring, legacy modernization, PR integration, and benchmark optimization.",
      notesByCap: {
        verification_gate: "Enforces proprietary behavioral and architectural verification gates beyond existing unit suites before code reaches review.",
        sdlc_governance: "Provides dedicated workflows for Autodev, read-only review, refactoring, modernization, PR screening, and benchmark optimization.",
        multi_provider: "Model-agnostic across existing Copilot, Codex, cloud frontier APIs, or self-hosted endpoints.",
        sovereign_zdr: "Operates on zero-data-retention infrastructure in Liechtenstein and Switzerland with zero training.",
        embeddable_sdk: "Delivered as governed SDLC infrastructure rather than an in-app chatbot library."
      }
    },
    {
      id: "claude-code",
      name: "Claude Code",
      category: "Interactive terminal agent & subagents",
      caps: {
        verification_gate: 0,
        sdlc_governance: 1,
        multi_provider: 0,
        sovereign_zdr: 0,
        local_worktrees: 2,
        embeddable_sdk: 1
      },
      defaultNote:
        "Fast interactive CLI with subagent context delegation and Git worktree ergonomics for single-developer iteration.",
      notesByCap: {
        local_worktrees: "Strong local terminal loop with native Git worktree and subagent delegation.",
        verification_gate: "Relies on local test runners and single-model self-checks rather than a dedicated verification layer.",
        sovereign_zdr: "Coupled to Anthropic cloud or US hyperscaler endpoints rather than sovereign EEA custody."
      }
    },
    {
      id: "openai-codex",
      name: "OpenAI Codex",
      category: "Cloud sandbox task queue",
      caps: {
        verification_gate: 0,
        sdlc_governance: 1,
        multi_provider: 0,
        sovereign_zdr: 0,
        local_worktrees: 1,
        embeddable_sdk: 1
      },
      defaultNote:
        "Dispatches asynchronous repository tasks into isolated cloud containers with test execution logs.",
      notesByCap: {
        sdlc_governance: "Useful for asynchronous backlog chores, though humans still audit and reconcile parallel attempts manually.",
        multi_provider: "Locked exclusively to OpenAI model families and cloud execution environments."
      }
    },
    {
      id: "worktree-multiplexers",
      name: "Superset / Orchestrator.inc",
      category: "Parallel worktree multiplexer",
      caps: {
        verification_gate: 0,
        sdlc_governance: 0,
        multi_provider: 2,
        sovereign_zdr: 1,
        local_worktrees: 2,
        embeddable_sdk: 0
      },
      defaultNote:
        "Desktop and workspace control planes for running multiple CLI coding agents side by side across Git branches.",
      notesByCap: {
        local_worktrees: "Purpose-built workspace UI for supervising 5–10 simultaneous Git worktree branches.",
        verification_gate: "Multiplies branch throughput without automated pre-review verification, increasing human PR review load."
      }
    },
    {
      id: "langgraph",
      name: "LangGraph",
      category: "Stateful workflow SDK",
      caps: {
        verification_gate: 1,
        sdlc_governance: 0,
        multi_provider: 2,
        sovereign_zdr: 1,
        local_worktrees: 0,
        embeddable_sdk: 2
      },
      defaultNote:
        "Low-level Python and TypeScript graph runtime for engineering teams building custom product agents.",
      notesByCap: {
        embeddable_sdk: "Best-in-class cyclic state graph, checkpointing, and human-in-the-loop primitives for custom apps.",
        verification_gate: "Provides raw graph primitives only; teams must build and maintain their own verification logic."
      }
    },
    {
      id: "crewai",
      name: "CrewAI",
      category: "Role-based multi-agent SDK",
      caps: {
        verification_gate: 0,
        sdlc_governance: 0,
        multi_provider: 2,
        sovereign_zdr: 1,
        local_worktrees: 0,
        embeddable_sdk: 2
      },
      defaultNote:
        "High-level Python framework for assembling role-playing business and automation pipelines quickly.",
      notesByCap: {
        embeddable_sdk: "Fastest way to prototype multi-role business workflows in Python.",
        verification_gate: "Not architected for deep repository engineering or automated code verification."
      }
    }
  ];

  const filterChips = Array.from(document.querySelectorAll("[data-filter-cap]"));
  const resetBtn = document.getElementById("matcher-reset");
  const resultsContainer = document.getElementById("matcher-results");

  function renderMatcher() {
    if (!resultsContainer) return;

    const activeCaps = filterChips
      .filter(function (chip) {
        return chip.getAttribute("aria-pressed") === "true";
      })
      .map(function (chip) {
        return chip.getAttribute("data-filter-cap");
      });

    const maxPossible = activeCaps.length * 2;

    const scored = TOOLS_DATA.map(function (tool) {
      let score = 0;
      activeCaps.forEach(function (cap) {
        score += tool.caps[cap] || 0;
      });
      return { tool: tool, score: score };
    });

    if (activeCaps.length > 0) {
      scored.sort(function (a, b) {
        return b.score - a.score;
      });
    }

    resultsContainer.innerHTML = scored
      .map(function (entry, idx) {
        const tool = entry.tool;
        const score = entry.score;
        let badgeClass = "badge-pass";
        let badgeText = "Production pick";
        let rowClass = "matcher-row";

        if (activeCaps.length > 0) {
          const ratio = score / maxPossible;
          if (ratio >= 0.85) {
            badgeClass = "badge-pass";
            badgeText = "Strong fit (" + score + "/" + maxPossible + ")";
            if (idx === 0) rowClass += " is-top-match";
          } else if (ratio >= 0.45) {
            badgeClass = "badge-warn";
            badgeText = "Partial (" + score + "/" + maxPossible + ")";
          } else {
            badgeClass = "badge-neutral";
            badgeText = "Gap (" + score + "/" + maxPossible + ")";
            rowClass += " is-dimmed";
          }
        } else if (tool.id === "askus-operator") {
          rowClass += " is-top-match";
        } else {
          badgeClass = "badge-neutral";
          badgeText = "Baseline profile";
        }

        let explanation = tool.defaultNote;
        if (activeCaps.length > 0) {
          for (let i = 0; i < activeCaps.length; i++) {
            const capKey = activeCaps[i];
            if (tool.notesByCap[capKey]) {
              explanation = tool.notesByCap[capKey];
              break;
            }
          }
        }

        return (
          '<div class="' +
          rowClass +
          '">' +
          '<div><span class="matcher-tool-name">' +
          tool.name +
          '</span><span class="matcher-tool-cat">' +
          tool.category +
          "</span></div>" +
          '<div><span class="matcher-score-badge ' +
          badgeClass +
          '">' +
          badgeText +
          "</span></div>" +
          '<p class="matcher-reason">' +
          explanation +
          "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  if (filterChips.length > 0 && resultsContainer) {
    filterChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const next = chip.getAttribute("aria-pressed") !== "true";
        chip.setAttribute("aria-pressed", String(next));
        const indicator = chip.querySelector(".chip-indicator");
        if (indicator) indicator.textContent = next ? "✓" : "";
        renderMatcher();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        filterChips.forEach(function (chip) {
          chip.setAttribute("aria-pressed", "false");
          const indicator = chip.querySelector(".chip-indicator");
          if (indicator) indicator.textContent = "";
        });
        renderMatcher();
      });
    }

    renderMatcher();
  }

  /* 4. Left Rail Scroll-Spy */
  const railLinks = Array.from(document.querySelectorAll(".rail-list a[href^='#']"));
  if (railLinks.length > 0 && "IntersectionObserver" in window) {
    const sections = railLinks
      .map(function (link) {
        const id = link.getAttribute("href").slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = "#" + entry.target.id;
            railLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === activeId);
            });
          }
        });
      },
      { rootMargin: "-20% 0px -68% 0px", threshold: 0 }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  /* 5. Evaluation Rubric Weighted Calculator & Copy Spec Button */
  const weightInputs = Array.from(document.querySelectorAll("[data-rubric-weight]"));
  const rubricOutput = document.getElementById("rubric-weighted-output");

  const RUBRIC_PROFILES = [
    {
      name: "Askus Operator (Verification-gated infrastructure)",
      scores: { verification: 9.8, scale: 9.5, neutrality: 9.4, custody: 9.8 }
    },
    {
      name: "Worktree multiplexers (Superset / Orchestrator.inc + CLI agents)",
      scores: { verification: 4.5, scale: 7.2, neutrality: 8.5, custody: 6.5 }
    },
    {
      name: "Single-vendor terminal / cloud agents (Claude Code / Codex)",
      scores: { verification: 5.2, scale: 7.4, neutrality: 2.5, custody: 4.8 }
    },
    {
      name: "Custom SDK build (LangGraph internal harness)",
      scores: { verification: 6.8, scale: 7.0, neutrality: 9.5, custody: 8.5 }
    }
  ];

  function updateRubricScores() {
    if (!rubricOutput || weightInputs.length === 0) return;

    const weights = {};
    let weightSum = 0;
    weightInputs.forEach(function (input) {
      const key = input.getAttribute("data-rubric-weight");
      const val = Number(input.value) || 0;
      weights[key] = val;
      weightSum += val;
      const valDisplay = document.getElementById("val-" + key);
      if (valDisplay) valDisplay.textContent = val + "/5";
    });

    const divisor = weightSum > 0 ? weightSum : 1;

    const computed = RUBRIC_PROFILES.map(function (profile) {
      const weighted =
        ((profile.scores.verification * (weights.verification || 0) +
          profile.scores.scale * (weights.scale || 0) +
          profile.scores.neutrality * (weights.neutrality || 0) +
          profile.scores.custody * (weights.custody || 0)) /
          divisor);
      return { name: profile.name, weighted: weighted };
    }).sort(function (a, b) {
      return b.weighted - a.weighted;
    });

    rubricOutput.innerHTML = computed
      .map(function (item, idx) {
        const cls = idx === 0 ? "matcher-row is-top-match" : "matcher-row";
        const badgeCls = idx === 0 ? "matcher-score-badge badge-pass" : "matcher-score-badge badge-neutral";
        return (
          '<div class="' +
          cls +
          '" style="grid-template-columns: minmax(0, 1fr) 140px;">' +
          '<div class="matcher-tool-name">' +
          item.name +
          "</div>" +
          '<div style="justify-self: end;"><span class="' +
          badgeCls +
          '">' +
          item.weighted.toFixed(1) +
          " / 10</span></div>" +
          "</div>"
        );
      })
      .join("");
  }

  if (weightInputs.length > 0 && rubricOutput) {
    weightInputs.forEach(function (input) {
      input.addEventListener("input", updateRubricScores);
    });
    updateRubricScores();
  }

  const copyBtn = document.getElementById("copy-spec-btn");
  const specSource = document.getElementById("benchmark-spec-template");
  if (copyBtn && specSource) {
    copyBtn.addEventListener("click", function () {
      const text = specSource.textContent || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copied specification";
          setTimeout(function () {
            copyBtn.textContent = "Copy specification";
          }, 2200);
        });
      }
    });
  }
})();

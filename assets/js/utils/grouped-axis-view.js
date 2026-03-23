import { escapeHtml } from "./content.js";

function renderMetrics(entries) {
  return `
    <div class="outputs-metrics">
      ${entries
        .map(
          ({ label, items }) => `
            <article class="metric-card">
              <div class="metric-main">
                <div class="metric-number">${items.length}</div>
                <div class="metric-label">${escapeHtml(label)}</div>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function createSortedEntries(items, axis, getAxisValues, sortEntries, formatAxisValue) {
  const groups = new Map();

  items.forEach((item) => {
    getAxisValues(item, axis).forEach((value) => {
      if (!groups.has(value)) {
        groups.set(value, []);
      }

      groups.get(value).push(item);
    });
  });

  return sortEntries(
    axis,
    Array.from(groups, ([value, groupedItems]) => ({
      value,
      items: groupedItems,
      label: formatAxisValue(axis, value),
    }))
  );
}

export function createGroupedAxisView({
  container,
  items,
  root = "",
  defaultAxis,
  axes,
  toolbarLabel,
  getAxisValues,
  sortEntries,
  formatAxisValue,
  renderSection,
}) {
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="works-container">
      <div class="outputs-axis-switch" role="toolbar" aria-label="${escapeHtml(toolbarLabel)}">
        ${axes
          .map(
            ({ key, label }) =>
              `<button type="button" class="outputs-axis-button${
                key === defaultAxis ? " is-active" : ""
              }" data-axis="${escapeHtml(key)}">${escapeHtml(label)}</button>`
          )
          .join("")}
      </div>
      <div class="outputs-metrics-container"></div>
      <div class="outputs-grouped-sections"></div>
    </div>
  `;

  const metricsContainer = container.querySelector(".outputs-metrics-container");
  const sectionsContainer = container.querySelector(".outputs-grouped-sections");
  const buttons = container.querySelectorAll("[data-axis]");

  const renderAxis = (axis) => {
    const entries = createSortedEntries(items, axis, getAxisValues, sortEntries, formatAxisValue);
    metricsContainer.innerHTML = renderMetrics(entries);
    sectionsContainer.innerHTML = entries
      .map((entry) => renderSection(entry, { axis, root, formatAxisValue }))
      .join("");
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.axis === axis);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      renderAxis(button.dataset.axis);
    });
  });

  renderAxis(defaultAxis);
}

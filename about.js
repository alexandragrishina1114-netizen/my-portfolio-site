const tabs = Array.from(document.querySelectorAll(".career-tab"));
const panels = Array.from(document.querySelectorAll(".career-panel"));

function selectTab(selectedTab) {
  const selectedPanelId = selectedTab.dataset.panel;

  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isSelected = panel.id === selectedPanelId;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs[(index + step + tabs.length) % tabs.length];
    nextTab.focus();
    selectTab(nextTab);
  });
});

(() => {
  const BUTTON_LI_ID = "jump2deepwiki-action";
  const DEEPWIKI_ORIGIN = "https://deepwiki.com";

  const ICON_SVG = `
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="octicon octicon-book v-align-text-bottom d-inline-block mr-2">
      <path d="M0 1.75C0 .784.784 0 1.75 0h10.5A1.75 1.75 0 0 1 14 1.75v12.5c0 .966-.784 1.75-1.75 1.75H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H3V1.5Zm2.75 0v13h7.75a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Z"></path>
    </svg>
  `.trim();

  function getPathParts(pathname) {
    return pathname.split("/").filter(Boolean);
  }

  function isRepoRootPath(pathname) {
    const parts = getPathParts(pathname);
    return parts.length === 2;
  }

  function getRepoFromPath(pathname) {
    const parts = getPathParts(pathname);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  }

  function isRepositoryPage() {
    return (
      document.getElementById("repository-container-header") ||
      document.querySelector('meta[name="octolytics-dimension-repository_nwo"]')
    );
  }

  function shouldShowButton() {
    return isRepoRootPath(location.pathname) && isRepositoryPage();
  }

  function findActionsList() {
    const header = document.getElementById("repository-container-header");
    if (!header) return null;

    return (
      header.querySelector("ul.pagehead-actions") ||
      header.querySelector("ul.UnderlineNav-actions") ||
      null
    );
  }

  function buildButtonLi(deepwikiUrl) {
    const li = document.createElement("li");
    li.id = BUTTON_LI_ID;

    const a = document.createElement("a");
    a.href = deepwikiUrl;
    a.className = "btn-sm btn";
    a.setAttribute("data-view-component", "true");
    a.setAttribute("aria-label", "Open DeepWiki for this repository");
    a.setAttribute("title", "DeepWiki");
    a.innerHTML = `${ICON_SVG}DeepWiki`;

    li.append(a);
    return li;
  }

  function ensureButton() {
    if (document.getElementById(BUTTON_LI_ID)) return;

    const actionsList = findActionsList();
    if (!actionsList) return;

    const repo = getRepoFromPath(location.pathname);
    if (!repo?.owner || !repo?.repo) return;

    const deepwikiUrl = `${DEEPWIKI_ORIGIN}/${repo.owner}/${repo.repo}`;
    actionsList.append(buildButtonLi(deepwikiUrl));
  }

  function removeButton() {
    document.getElementById(BUTTON_LI_ID)?.remove();
  }

  function syncButton() {
    if (shouldShowButton()) ensureButton();
    else removeButton();
  }

  let syncScheduled = false;
  function scheduleSync() {
    if (syncScheduled) return;
    syncScheduled = true;

    window.setTimeout(() => {
      syncScheduled = false;
      syncButton();
    }, 120);
  }

  syncButton();
  document.addEventListener("turbo:load", scheduleSync, true);
  document.addEventListener("pjax:end", scheduleSync, true);
  window.addEventListener("popstate", scheduleSync, true);

  const observer = new MutationObserver(scheduleSync);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener(
      "DOMContentLoaded",
      () => observer.observe(document.body, { childList: true, subtree: true }),
      { once: true }
    );
  }
})();

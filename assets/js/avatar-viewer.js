(() => {
  const viewers = [...document.querySelectorAll("model-viewer.profile-avatar-viewer")];

  if (!viewers.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    viewers.forEach((viewer) => viewer.removeAttribute("auto-rotate"));
  }

  const setViewerState = (viewer, state) => {
    const shell = viewer.closest(".profile-avatar-viewer-shell");
    const status = shell?.querySelector(".profile-avatar-status");

    if (!shell || !status) {
      return;
    }

    shell.classList.toggle("is-loaded", state === "loaded");
    shell.classList.toggle("has-error", state === "error");

    if (state === "error") {
      status.textContent = document.documentElement.lang === "ja"
        ? "3Dアバターを読み込めませんでした。"
        : "The 3D avatar could not be loaded.";
    }
  };

  viewers.forEach((viewer) => {
    viewer.addEventListener("load", () => setViewerState(viewer, "loaded"), {
      once: true,
    });
    viewer.addEventListener("error", () => setViewerState(viewer, "error"), {
      once: true,
    });
  });

  const loadViewerLibrary = () => {
    if (customElements.get("model-viewer")) {
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";
    script.addEventListener("error", () => {
      viewers.forEach((viewer) => setViewerState(viewer, "error"));
    });
    document.head.append(script);
  };

  const section = document.querySelector(".profile-avatar");

  if (!("IntersectionObserver" in window) || !section) {
    loadViewerLibrary();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadViewerLibrary();
        observer.disconnect();
      }
    },
    { rootMargin: "400px 0px" },
  );

  observer.observe(section);
})();

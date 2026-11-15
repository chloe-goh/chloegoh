// -----------------------------
// DARK MODE
// -----------------------------

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        themeToggle.textContent = isDark ? "☀" : "☾";

        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// Restore saved theme across all pages

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀";
    }
}


// -----------------------------
// MOBILE MENU
// -----------------------------

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuToggle.textContent = open ? "✕" : "☰";
    }

    menuToggle.addEventListener("click", () => {
        setMenu(!navLinks.classList.contains("open"));
    });

    // Close the menu after choosing a page
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    // Close with the Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") setMenu(false);
    });

    // Reset when the window grows back to desktop width
    window.addEventListener("resize", () => {
        if (window.innerWidth > 750) setMenu(false);
    });

}


// -----------------------------
// INTERACTIVE SKILLS
// -----------------------------

const skillTabs = document.querySelectorAll(".skill-tab");
const skillPanels = document.querySelectorAll(".skill-panel");

skillTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const selectedPanel = document.getElementById(tab.dataset.skill);

        skillTabs.forEach(item => item.classList.remove("active"));
        skillPanels.forEach(panel => panel.classList.remove("active"));

        tab.classList.add("active");

        if (selectedPanel) {
            selectedPanel.classList.add("active");
        }
    });
});


// -----------------------------
// CAREER TIMELINE
// -----------------------------

const timelineNodes = document.querySelectorAll(".tl-node");
const timelinePanels = document.querySelectorAll(".tl-panel");
const timelineDetail = document.getElementById("tl-detail");
const timelineTrack = document.querySelector(".tl-track");
const timelineClose = document.querySelector(".tl-close");

function resetTimelineNodes() {
    timelineNodes.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
    });
}

function closeTimelineDetail() {
    timelineDetail.classList.remove("open");
    resetTimelineNodes();
}

function openTimelineDetail(node, panel) {
    resetTimelineNodes();
    timelinePanels.forEach(item => item.classList.remove("active"));

    node.classList.add("active");
    node.setAttribute("aria-pressed", "true");
    panel.classList.add("active");

    timelineDetail.classList.add("open");
    timelineDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (timelineDetail) {

    timelineNodes.forEach(node => {
        node.addEventListener("click", () => {
            const panel = document.getElementById(node.dataset.target);

            if (!panel) return;

            // Clicking the open item a second time collapses the section
            const isOpen =
                timelineDetail.classList.contains("open") &&
                node.classList.contains("active");

            if (isOpen) {
                closeTimelineDetail();
            } else {
                openTimelineDetail(node, panel);
            }
        });
    });

    // The ✕ button closes the section and returns to the timeline
    if (timelineClose) {
        timelineClose.addEventListener("click", () => {
            closeTimelineDetail();
            timelineTrack.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

}


// -----------------------------
// AUTOMATIC COPYRIGHT YEAR
// -----------------------------

document.querySelectorAll(".copyright").forEach(item => {
    item.textContent =
        `© ${new Date().getFullYear()} Chloe. All rights reserved.`;
});
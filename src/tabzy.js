function Tabzy(selector, options) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Tabzy: No container found selector ${selector}`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error(`Tabzy: No tabs found inside the container`);
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                hasError = true;
                console.error(
                    `Tabzy: No panel found for selector '${tab.getAttribute(
                        "href"
                    )}'`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length !== this.panels.length) return;

    this.opt = Object.assign(
        {
            remember: false,
        },
        options
    );

    this._originalHtml = this.container.innerHTML;

    this._init();
}

Tabzy.prototype._init = function () {
    const hash = location.hash;
    const tab =
        (this.opt.remember &&
            hash &&
            this.tabs.find((tab) => tab.getAttribute("href") === hash)) ||
        this.tabs[0];

    this._activateTab(tab);

    this.tabs.map((tab) => {
        tab.onclick = (e) => this._handleTabClick(e, tab);
    });
};

Tabzy.prototype._handleTabClick = function (e, tab) {
    e.preventDefault();

    this._activateTab(tab);
};

Tabzy.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });

    tab.closest("li").classList.add("tabzy--active");
    this.panels.forEach((panel) => {
        panel.hidden = true;
    });
    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opt.remember) {
        history.replaceState(null, null, tab.getAttribute("href"));
    }
};

Tabzy.prototype.switch = function (input) {
    let tabToActive = null;

    if (typeof input === "string") {
        tabToActive = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );
        if (!tabToActive) {
            console.error(`Tabzy: No panel found with ID '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        console.error(`Tabzy: Invalid input '${input}'`);
        return;
    }

    this._activateTab(tabToActive);
};

Tabzy.prototype.desctroy = function () {
    this.container.innerHTML = this._originalHtml;
    this.panels.forEach((panel) => {
        panel.hidden = false;
    });
    this.container = null;
    this.tabs = null;
    this.panels = null;
};

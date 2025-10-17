// Folder Hover Effect Component
class FolderHoverComponent {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      images: options.images || [
        "/images/img1.jpg",
        "/images/img2.jpg",
        "/images/img3.jpg",
        "/images/img4.jpg",
        "/images/img5.jpg",
      ],
      folders: options.folders || [
        { id: "01", name: "Frontend", variant: "variant-1" },
        { id: "02", name: "backend", variant: "variant-2" },
        { id: "03", name: "blockchain", variant: "variant-2" },
        { id: "04", name: "games", variant: "variant-3" },
        { id: "05", name: "robotics", variant: "variant-1" },
        { id: "06", name: "ml/ai & tools", variant: "variant-2" },
      ],
    };

    this.isMobile = window.innerWidth < 1000;
    this.init();
  }

  init() {
    console.log(
      "FolderHoverComponent init called for container:",
      this.container
    );

    if (!this.container) {
      console.error("FolderHoverComponent: Container not found");
      return;
    }

    console.log("Rendering folder component...");
    this.render();
    console.log("Attaching events...");
    this.attachEvents();
    console.log("Setting initial positions...");
    this.setInitialPositions();
    console.log("Folder component initialized successfully!");
  }

  render() {
    this.container.innerHTML = `
      <section class="folder-section" id="folder-gallery">
     
        <div class="folders">
          ${this.renderFolderRows()}
        </div>
      </section>
    `;
  }

  renderFolderRows() {
    const rows = [];
    for (let i = 0; i < this.options.folders.length; i += 2) {
      const folder1 = this.options.folders[i];
      const folder2 = this.options.folders[i + 1];

      rows.push(`
        <div class="folder-row">
          ${this.renderFolder(folder1)}
          ${folder2 ? this.renderFolder(folder2) : ""}
        </div>
      `);
    }
    return rows.join("");
  }

  renderFolder(folder) {
    const randomImages = this.getRandomImages(3);
    return `
      <div class="folder ${folder.variant}">
        <div class="folder-preview">
          ${randomImages
            .map(
              (img) => `
            <div class="folder-preview-img">
              <img src="${img}" />
            </div>
          `
            )
            .join("")}
        </div>
        <div class="folder-wrapper">
          <div class="folder-index"><p>${folder.id}</p></div>
          <div class="folder-name"><h1>${folder.name}</h1></div>
        </div>
      </div>
    `;
  }

  getRandomImages(count) {
    const shuffled = [...this.options.images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  attachEvents() {
    const folders = this.container.querySelectorAll(".folder");
    const folderWrappers = this.container.querySelectorAll(".folder-wrapper");

    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll(".folder-preview-img");

      folder.addEventListener("mouseenter", () => {
        if (this.isMobile) return;

        folders.forEach((siblingFolder) => {
          if (siblingFolder !== folder) {
            siblingFolder.classList.add("disabled");
          }
        });

        gsap.to(folderWrappers[index], {
          y: 0,
          duration: 0.25,
          ease: "back.out(1.7)",
        });

        previewImages.forEach((img, imgIndex) => {
          let rotation;
          if (imgIndex === 0) {
            rotation = gsap.utils.random(-20, -10);
          } else if (imgIndex === 1) {
            rotation = gsap.utils.random(-10, 10);
          } else {
            rotation = gsap.utils.random(10, 20);
          }

          gsap.to(img, {
            y: "-100%",
            rotation: rotation,
            duration: 0.25,
            ease: "back.out(1.7)",
            delay: imgIndex * 0.025,
          });
        });
      });

      folder.addEventListener("mouseleave", () => {
        if (this.isMobile) return;

        folders.forEach((siblingFolder) => {
          siblingFolder.classList.remove("disabled");
        });

        gsap.to(folderWrappers[index], {
          y: 25,
          duration: 0.25,
          ease: "back.out(1.7)",
        });

        previewImages.forEach((img, imgIndex) => {
          gsap.to(img, {
            y: "0%",
            rotation: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
            delay: imgIndex * 0.05,
          });
        });
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      const currentBreakpoint = window.innerWidth < 1000;
      if (currentBreakpoint !== this.isMobile) {
        this.isMobile = currentBreakpoint;
        this.setInitialPositions();

        folders.forEach((folder) => {
          folder.classList.remove("disabled");
        });
        const allPreviewImages = this.container.querySelectorAll(
          ".folder-preview-img"
        );
        gsap.set(allPreviewImages, { y: "0%", rotation: 0 });
      }
    });
  }

  setInitialPositions() {
    const folderWrappers = this.container.querySelectorAll(".folder-wrapper");
    gsap.set(folderWrappers, { y: this.isMobile ? 0 : 25 });
  }

  // Public methods
  updateFolders(newFolders) {
    this.options.folders = newFolders;
    this.render();
    this.attachEvents();
    this.setInitialPositions();
  }

  updateImages(newImages) {
    this.options.images = newImages;
    this.render();
    this.attachEvents();
    this.setInitialPositions();
  }

  destroy() {
    // Clean up event listeners if needed
    const folders = this.container.querySelectorAll(".folder");
    folders.forEach((folder) => {
      folder.replaceWith(folder.cloneNode(true));
    });
  }
}

// Initialize function for easy use
function initFolderHover(container, options) {
  return new FolderHoverComponent(container, options);
}

// Auto-initialize if GSAP is available
function autoInitFolderHover() {
  console.log(
    "autoInitFolderHover called, GSAP available:",
    typeof gsap !== "undefined"
  );

  if (typeof gsap !== "undefined") {
    const containers = document.querySelectorAll("[data-folder-hover]");
    console.log("Found containers:", containers.length);

    containers.forEach((container, index) => {
      console.log(`Initializing container ${index}:`, container);
      const options = {
        images: container.dataset.images
          ? JSON.parse(container.dataset.images)
          : undefined,
        folders: container.dataset.folders
          ? JSON.parse(container.dataset.folders)
          : undefined,

        navSubtitle: container.dataset.navSubtitle,
      };
      new FolderHoverComponent(container, options);
    });
  } else {
    console.log("GSAP not ready, retrying in 100ms...");
    setTimeout(autoInitFolderHover, 100);
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { FolderHoverComponent, initFolderHover };
}

// Auto-initialize when DOM is ready
function initializeComponent() {
  console.log("Auto-initializing folder component...");
  autoInitFolderHover();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeComponent);
} else {
  initializeComponent();
}

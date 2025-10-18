// Component Loader - Loads components dynamically
class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    // Wait for GSAP to be available
    this.waitForGSAP(() => {
      this.loadComponents();
    });
  }

  waitForGSAP(callback) {
    if (typeof gsap !== "undefined") {
      callback();
    } else {
      setTimeout(() => this.waitForGSAP(callback), 100);
    }
  }

  loadComponents() {
    console.log("ComponentLoader: Loading components...");

    // Load folder gallery components
    this.loadFolderGalleries();
  }

  loadFolderGalleries() {
    const containers = document.querySelectorAll("[data-folder-gallery]");
    console.log(`Found ${containers.length} folder gallery containers`);

    if (containers.length === 0) {
      console.error("No folder gallery containers found!");
      return;
    }

    containers.forEach((container, index) => {
      console.log(`Loading folder gallery ${index + 1}...`, container);
      try {
        const component = new FolderHoverComponent(container);
        this.components.set(`folder-gallery-${index}`, component);
        console.log(`Folder gallery ${index + 1} loaded successfully!`);
      } catch (error) {
        console.error(`Error loading folder gallery ${index + 1}:`, error);
      }
    });
  }

  // Public method to get component
  getComponent(name) {
    return this.components.get(name);
  }

  // Public method to destroy component
  destroyComponent(name) {
    const component = this.components.get(name);
    if (component && component.destroy) {
      component.destroy();
      this.components.delete(name);
    }
  }
}

// Auto-initialize when DOM is ready
let componentLoader;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    componentLoader = new ComponentLoader();
  });
} else {
  componentLoader = new ComponentLoader();
}

// Export for global access
window.ComponentLoader = ComponentLoader;
window.componentLoader = componentLoader;

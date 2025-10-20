// Location and Time Widget for Lagos, Nigeria
class LocationTimeWidget {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      city: options.city || "Lagos",
      country: options.country || "Nigeria",
      timezone: options.timezone || "Africa/Lagos",
      updateInterval: options.updateInterval || 1000, // Update every second
      ...options,
    };

    this.init();
  }

  init() {
    if (!this.container) {
      console.error("LocationTimeWidget: Container not found");
      return;
    }

    this.render();
    this.startTimeUpdate();
  }

  render() {
    this.container.innerHTML = `
      <div class="location-time-widget">
        <div id="location-time-text">LAGOS,NIGERIA-|--:--:--|SUN !@ 2025</div>
      </div>
    `;

    // Add styles
    this.addStyles();
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .location-time-widget {
        position: fixed;
        top: 20px;
        right: 20px;
        color: #000;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        letter-spacing: 1px;
      }

      #location-time-text {
        white-space: nowrap;
      }

      @media (max-width: 768px) {
        .location-time-widget {
          top: 10px;
          right: 10px;
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  startTimeUpdate() {
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, this.options.updateInterval);

    // Listen for window resize to update display format
    window.addEventListener("resize", () => {
      this.updateTime();
    });
  }

  updateTime() {
    try {
      const now = new Date();
      const options = {
        timeZone: this.options.timezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const timeString = now.toLocaleTimeString("en-US", options);

      // Get day of week
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const dayOfWeek = days[now.getDay()];

      // Get date
      const dateOptions = {
        timeZone: this.options.timezone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };
      const dateString = now.toLocaleDateString("en-US", dateOptions);

      const year = now.getFullYear();

      const textElement = this.container.querySelector("#location-time-text");
      if (textElement) {
        // Check if mobile device (match CSS breakpoint)
        const isMobile = window.innerWidth <= 480;

        if (isMobile) {
          // Show only date on mobile
          textElement.textContent = `${dayOfWeek} ${dateString}`;
        } else {
          // Show full time and date on desktop
          textElement.textContent = `LAGOS,NIGERIA WAT | ${timeString} | ${dayOfWeek} ${dateString}`;
        }
      }
    } catch (error) {
      console.error("Error updating time:", error);
    }
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Auto-initialize function
function initLocationTime() {
  const containers = document.querySelectorAll("[data-location-time]");
  containers.forEach((container) => {
    new LocationTimeWidget(container);
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLocationTime);
} else {
  initLocationTime();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LocationTimeWidget, initLocationTime };
}

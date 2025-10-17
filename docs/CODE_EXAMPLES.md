# Code Examples

This document contains practical code examples and snippets for working with the Okhuomon portfolio website.

## 🎨 CSS Examples

### Animation Keyframes

```css
/* Smooth gradient animation for titles */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Floating card animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Heartbeat animation for footer */
@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

### Responsive Design Patterns

```css
/* Mobile-first responsive design */
.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

/* Mobile breakpoint */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .header-title {
    font-size: 2.5rem;
  }
}
```

### Modern CSS Features

```css
/* CSS Custom Properties */
:root {
  --primary-color: #b1c0ef;
  --secondary-color: #4ecdc4;
  --accent-color: #ff6b6b;
  --text-color: #000;
  --bg-color: #f4f7f0;
}

/* Using custom properties */
.header-title {
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--secondary-color)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Backdrop filter for glassmorphism */
.navbar {
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 🚀 JavaScript Examples

### Component Architecture

```javascript
// Base component class
class BaseComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Override in subclasses
  }

  destroy() {
    // Cleanup logic
    this.element = null;
  }
}

// Specific component implementation
class FolderComponent extends BaseComponent {
  constructor(element) {
    super(element);
    this.folders = [];
    this.activeFolder = null;
  }

  init() {
    this.loadFolders();
    this.setupEventListeners();
    this.render();
  }

  loadFolders() {
    // Load folder data
    this.folders = [
      { name: "Projects", icon: "📁", count: 12 },
      { name: "Skills", icon: "⚡", count: 8 },
      { name: "Contact", icon: "📧", count: 3 },
    ];
  }

  setupEventListeners() {
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(event) {
    const folder = event.target.closest(".folder-item");
    if (folder) {
      this.selectFolder(folder.dataset.folderId);
    }
  }

  selectFolder(folderId) {
    this.activeFolder = folderId;
    this.render();
  }

  render() {
    this.element.innerHTML = this.folders
      .map(
        (folder) => `
      <div class="folder-item ${
        folder.id === this.activeFolder ? "active" : ""
      }" 
           data-folder-id="${folder.id}">
        <span class="folder-icon">${folder.icon}</span>
        <span class="folder-name">${folder.name}</span>
        <span class="folder-count">${folder.count}</span>
      </div>
    `
      )
      .join("");
  }
}
```

### GSAP Animation Examples

```javascript
// Scroll-triggered animations
gsap.registerPlugin(ScrollTrigger);

// Fade in elements on scroll
gsap.fromTo(
  ".header-title",
  {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".header-title",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  }
);

// Staggered animation for multiple elements
gsap.fromTo(
  ".floating-card",
  {
    opacity: 0,
    y: 100,
    rotation: 45,
  },
  {
    opacity: 1,
    y: 0,
    rotation: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".floating-elements",
      start: "top 70%",
    },
  }
);

// Timeline animation
const heroTimeline = gsap.timeline();

heroTimeline
  .from(".hero-title", { duration: 1, y: -50, ease: "power2.out" })
  .from(".hero-subtitle", { duration: 0.8, opacity: 0, y: 20 }, "-=0.5")
  .from(".hero-description", { duration: 0.6, opacity: 0, y: 20 }, "-=0.3")
  .from(".hero-buttons", { duration: 0.4, scale: 0.8, opacity: 0 }, "-=0.2");
```

### Smooth Scrolling Setup

```javascript
// Lenis smooth scrolling configuration
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

// Connect with GSAP ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

## 🏗️ OCaml Examples

### YOCaml Build Script

```ocaml
(* bin/blog.ml - Complete build script *)

open Yocaml

(* Path definitions *)
let www = Path.rel [ "_www" ]
let images = Path.rel [ "images" ]
let css = Path.rel [ "css" ]
let js = Path.rel [ "js" ]
let templates = Path.rel [ "templates" ]

(* File type checking *)
let with_ext exts file =
  List.exists (fun ext -> Path.has_extension ext file) exts

(* Asset copying functions *)
let copy_images =
  let images_path = Path.(www / "images")
  and where = with_ext [ "svg"; "png"; "jpg"; "gif"; "webp" ] in
  Batch.iter_files ~where images (Action.copy_file ~into:images_path)

let copy_js =
  let js_path = Path.(www / "js")
  and where = with_ext [ "js" ] in
  Batch.iter_files ~where js (Action.copy_file ~into:js_path)

let copy_css_files =
  let css_path = Path.(www / "css")
  and where = with_ext [ "css" ] in
  Batch.iter_files ~where css (Action.copy_file ~into:css_path)

(* CSS generation with concatenation *)
let create_css =
  let css_path = Path.(www / "style.css") in
  Action.Static.write_file css_path
    (Pipeline.pipe_files ~separator:"\n"
       Path.[
         css / "sticky-cards.css";
         css / "folder-hover.css";
       ])

(* Template processing *)
let create_index_page =
  let template_path = Path.(templates / "main.html") in
  Action.copy_file template_path ~into:www ~new_name:"index.html"

(* Main build pipeline *)
let program () =
  let open Eff in
  let cache = Path.(www / ".cache") in
  Action.restore_cache cache
  >>= copy_images
  >>= create_css
  >>= copy_css_files
  >>= copy_js
  >>= create_index_page
  >>= Action.store_cache cache

(* CLI interface *)
let () =
  match Sys.argv.(1) with
  | "server" ->
    Yocaml_unix.serve
       ~level:`Info
       ~target:www
       ~port:8000
       program
  | _ | (exception _) ->
     Yocaml_unix.run
       ~level:`Debug
       program
```

### Dune Configuration

```ocaml
(* dune-project *)
(lang dune 3.0)

(name okhuomon)

(generate_opam_files true)

(package
 (name okhuomon)
 (allow_empty)
 (synopsis "Personal portfolio website built with YOCaml")
 (description "A modern portfolio website showcasing creative frontend engineering work")
 (maintainers "six-shot <https://www.okhuomonajayi.com>")
 (authors "six-shot <https://www.okhuomonajayi.com/>")
 (homepage "https://github.com/six-shot/okhuomon")
 (bug_reports "https://github.com/six-shot/okhuomon/issues")
 (depends
  ocaml
  yocaml
  yocaml_unix
  yocaml_yaml
  yocaml_markdown
  yocaml_jingoo
  hilite)
 (tags ("portfolio" "yocaml" "static-site" "frontend" "gsap" "animation")))
```

## 🎯 HTML Template Examples

### Main Template Structure

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>unrealdev - Creative Software Engineer</title>
    <link rel="stylesheet" href="/style.css" />
    <link rel="stylesheet" href="/css/sticky-cards.css" />
    <link rel="stylesheet" href="/css/folder-hover.css" />
  </head>
  <body>
    <!-- Loading Screen -->
    <div id="loader">
      <div class="spinner"></div>
      <div>Loading GSAP...</div>
      <div id="loader-status">Initializing...</div>
    </div>

    <!-- Navigation -->
    <div class="navbar">
      <div class="site-logo">UNREALDEV</div>
      <div class="menu-toggle-center">
        <div id="menu-toggle-btn">
          <span></span>
        </div>
      </div>
      <div data-location-time id="location-time-widget"></div>
    </div>

    <!-- Main Content -->
    <section class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="header-title">Creative <br />Software Engineer</h1>
        </div>
        <div class="header-right">
          <p class="header-description">
            Crafting digital experiences that blend creativity with cutting-edge
            technology.
          </p>
        </div>
      </div>
    </section>

    <!-- Components -->
    <div data-folder-gallery id="folder-gallery-container"></div>

    <!-- Scripts -->
    <script src="https://unpkg.com/gsap@3.12.2/dist/gsap.min.js"></script>
    <script src="https://unpkg.com/gsap@3.12.2/dist/ScrollTrigger.min.js"></script>
    <script src="/js/component-loader.js"></script>
    <script src="/js/folder-component.js"></script>
    <script src="/js/location-time.js"></script>
  </body>
</html>
```

## 🔧 Utility Functions

### JavaScript Utilities

```javascript
// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Element visibility checker
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Smooth scroll to element
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
```

### CSS Utility Classes

```css
/* Utility classes for common patterns */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.hidden {
  display: none;
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
}
```

These code examples provide practical, copy-paste ready snippets for extending and customizing the portfolio website.

# Development Guide

This guide explains how to work with the codebase, make changes, and understand the development workflow.

## 🛠️ Setting Up Development Environment

### Prerequisites Installation

```bash
# Install OCaml via opam
curl -fsSL https://raw.githubusercontent.com/ocaml/opam/master/shell/install.sh | sh

# Initialize opam
opam init

# Install OCaml 5.3.0
opam switch create 5.3.0
opam switch 5.3.0

# Install dune build system
opam install dune
```

### Project Setup

```bash
# Clone and setup
git clone https://github.com/six-shot/okhuomon.git
cd okhuomon

# Install project dependencies
opam install . --deps-only

# Build the project
dune exec bin/blog.exe
```

## 📝 Making Changes

### Content Changes

**Edit the main template:**

```html
<!-- templates/main.html -->
<section class="header-section">
  <div class="header-content">
    <div class="header-left">
      <h1 class="header-title">Your New Title</h1>
    </div>
    <div class="header-right">
      <p class="header-description">Your new description here...</p>
    </div>
  </div>
</section>
```

**Rebuild after changes:**

```bash
dune exec bin/blog.exe
```

### Styling Changes

**Modify CSS files:**

```css
/* css/sticky-cards.css */
.card {
  /* Your new card styles */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 15px;
  padding: 2rem;
}
```

**Or add inline styles in main.html:**

```html
<style>
  .new-class {
    color: #b1c0ef;
    font-size: 1.2rem;
  }
</style>
```

### JavaScript Changes

**Add new functionality:**

```javascript
// js/component-loader.js
class NewComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Your component logic
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick(event) {
    // Handle click events
    console.log("Component clicked!");
  }
}

// Register the component
ComponentLoader.register("new-component", NewComponent);
```

## 🎨 Component Development

### Creating New Components

**1. Create component file:**

```javascript
// js/my-component.js
class MyComponent {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.element.addEventListener("click", this.handleClick.bind(this));
  }

  render() {
    // Render component content
    this.element.innerHTML = '<div class="my-content">Hello World!</div>';
  }

  handleClick(event) {
    // Handle interactions
    console.log("My component was clicked!");
  }
}
```

**2. Register in component loader:**

```javascript
// js/component-loader.js
import MyComponent from "./my-component.js";

// Add to component registration
const components = {
  "my-component": MyComponent,
  // ... other components
};
```

**3. Use in HTML:**

```html
<!-- templates/main.html -->
<div data-my-component>
  <!-- Component will be initialized here -->
</div>
```

### GSAP Animation Development

**Creating scroll-triggered animations:**

```javascript
// In main.html <script> section
gsap.registerPlugin(ScrollTrigger);

// Animate elements on scroll
gsap.fromTo(
  ".header-title",
  {
    opacity: 0,
    y: 50,
  },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".header-title",
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    },
  }
);
```

**Creating timeline animations:**

```javascript
// Complex animation sequences
const tl = gsap.timeline();

tl.to(".hero-title", { duration: 1, y: -50, ease: "power2.out" })
  .to(".hero-description", { duration: 0.8, opacity: 1 }, "-=0.5")
  .to(".hero-buttons", { duration: 0.6, scale: 1.05 }, "-=0.3");
```

## 🔧 Build System Customization

### Adding New File Types

**In bin/blog.ml:**

```ocaml
(* Add new file type processing *)
let copy_fonts =
  let fonts_path = Path.(www / "fonts")
  and where = with_ext [ "woff2"; "woff"; "ttf" ] in
  Batch.iter_files ~where (Path.rel [ "fonts" ]) (Action.copy_file ~into:fonts_path)

(* Add to build pipeline *)
let program () =
  let open Eff in
  let cache = Path.(www / ".cache") in
  Action.restore_cache cache
  >>= copy_images
  >>= copy_fonts  (* Add new step *)
  >>= create_css
  >>= copy_js
  >>= create_index_page
  >>= Action.store_cache cache
```

### Custom CSS Processing

**Process and minify CSS:**

```ocaml
let create_optimized_css =
  let css_path = Path.(www / "style.css") in
  let pipeline =
    Pipeline.pipe_files ~separator:"\n" Path.[
      css / "sticky-cards.css";
      css / "folder-hover.css";
    ]
    |> Pipeline.map (fun content ->
        (* Add CSS minification here *)
        String.trim content
      )
  in
  Action.Static.write_file css_path pipeline
```

## 🧪 Testing Changes

### Local Testing

```bash
# Start development server
dune exec bin/blog.exe server

# Open browser to http://localhost:8000
# Make changes and refresh to see updates
```

### Build Testing

```bash
# Clean build
dune clean
dune exec bin/blog.exe

# Check output in _www/ directory
ls -la _www/

# Test the built site
cd _www && python -m http.server 8000
```

## 🐛 Debugging

### Common Issues

**1. OCaml compilation errors:**

```bash
# Check OCaml version
ocaml --version

# Reinstall dependencies
opam reinstall . --deps-only
```

**2. JavaScript errors:**

```javascript
// Add debugging to components
console.log("Component initialized:", this.element);

// Use browser dev tools
debugger; // Add breakpoints
```

**3. CSS not loading:**

```html
<!-- Check CSS file paths -->
<link rel="stylesheet" href="/css/sticky-cards.css" />
<!-- Make sure files exist in _www/css/ -->
```

### Performance Debugging

```javascript
// Measure animation performance
gsap.globalTimeline.timeScale(0.5); // Slow down animations

// Check ScrollTrigger
ScrollTrigger.refresh(); // Refresh scroll triggers

// Monitor frame rate
gsap.ticker.add(() => {
  console.log("FPS:", 1000 / gsap.ticker.delta);
});
```

## 📦 Deployment

### Production Build

```bash
# Clean build for production
dune clean
dune exec bin/blog.exe

# Verify build output
ls -la _www/
```

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup OCaml
        uses: ocaml/setup-ocaml@v2
        with:
          ocaml-version: "5.3.0"
      - name: Install dependencies
        run: opam install . --deps-only -y
      - name: Build site
        run: dune exec bin/blog.exe
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_www
```

This development guide provides everything needed to work effectively with the codebase and make changes to the portfolio website.

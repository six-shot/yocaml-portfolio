# Okhuomon - Creative Software Engineer Portfolio

A modern, interactive portfolio website built with **YOCaml** static site generator, showcasing creative frontend engineering work with smooth animations and user-centered designs.

<!-- Updated to trigger deployment -->

## 🚀 Features

- **Interactive Portfolio** - Dynamic content with GSAP animations
- **Responsive Design** - Mobile-first approach with clean typography
- **Modern Tech Stack** - OCaml, YOCaml, GSAP, and vanilla JavaScript
- **Fast Performance** - Static site generation for optimal loading
- **Component System** - Modular JavaScript components
- **Smooth Animations** - GSAP-powered scroll effects and transitions

## 🛠️ Tech Stack

- **Static Site Generator**: [YOCaml](https://github.com/xhtmlboi/yocaml)
- **Language**: OCaml 5.3.0
- **Build System**: Dune 3.0
- **Animations**: GSAP 3.12.2
- **Styling**: Custom CSS with modern features
- **JavaScript**: Vanilla ES6+ with component architecture

## 📁 Project Structure

```
okhuomon/
├── templates/
│   └── main.html              # Main template file
├── bin/
│   ├── blog.ml               # Build script
│   └── dune                  # Build configuration
├── css/
│   ├── style.css             # Main stylesheet
│   ├── animations.css        # Animation styles
│   └── folder-hover.css      # Interactive elements
├── js/
│   ├── component-loader.js   # Component system
│   ├── folder-component.js   # Folder gallery
│   └── location-time.js      # Time widget
├── images/                   # Static assets
├── dune-project             # Project configuration
├── okhuomon.opam           # Package dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **OCaml 5.3.0+** - [Install OCaml](https://ocaml.org/docs/install.html)
- **opam** - OCaml package manager
- **dune** - Build system

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/six-shot/yocaml-site.git
   cd okhuomon
   ```

2. **Install dependencies**

   ```bash
   opam install . --deps-only
   ```

3. **Build the project**

   ```bash
   dune exec bin/blog.exe
   ```

4. **Start development server**
   ```bash
   dune exec bin/blog.exe server
   ```

The site will be available at `http://localhost:8000`

## 🏗️ Development

### Building

```bash
# Build the static site
dune exec bin/blog.exe

# Build and watch for changes
dune exec bin/blog.exe server
```

### Project Structure

- **`templates/main.html`** - Edit this file to modify the website content
- **`css/`** - Custom stylesheets for animations and layout
- **`js/`** - JavaScript components and functionality
- **`images/`** - Static assets (images, icons, etc.)

### Customization

1. **Content**: Edit `templates/main.html` for all website content
2. **Styling**: Modify CSS files in `css/` directory
3. **Functionality**: Update JavaScript files in `js/` directory
4. **Assets**: Add images to `images/` directory

## 🎨 Features Overview

### Interactive Elements

- **Smooth Scrolling** - Lenis-powered smooth scroll experience
- **GSAP Animations** - Professional-grade animations and transitions
- **Responsive Navigation** - Mobile-friendly hamburger menu
- **Dynamic Content** - Interactive project showcase with hover effects

### Performance

- **Static Generation** - Pre-built HTML for fast loading
- **Optimized Assets** - Minified CSS and JavaScript
- **Modern CSS** - Flexbox, Grid, and CSS custom properties
- **Progressive Enhancement** - Works without JavaScript

## 📦 Dependencies

### OCaml Packages

- `yocaml` - Static site generator framework
- `yocaml_unix` - Unix system integration
- `yocaml_yaml` - YAML file processing
- `yocaml_markdown` - Markdown support
- `yocaml_jingoo` - Template engine
- `hilite` - Syntax highlighting

### External Libraries

- **GSAP 3.12.2** - Animation library
- **Lenis** - Smooth scrolling
- **ScrollTrigger** - Scroll-based animations

## 🚀 Deployment

### GitHub Pages

1. **Build the site**

   ```bash
   dune exec bin/blog.exe
   ```

2. **Deploy `_www/` contents** to GitHub Pages

### Manual Deployment

1. **Build the project**

   ```bash
   dune exec bin/blog.exe
   ```

2. **Upload `_www/` folder** to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YOCaml** - Excellent static site generator framework
- **GSAP** - Powerful animation library
- **OCaml Community** - For the amazing ecosystem
- **Outreachy** - For the opportunity to contribute to open source

## 📞 Contact

**six-shot** - [okhuomonajayi.com](https://www.okhuomonajayi.com)

Project Link: [https://github.com/six-shot/okhuomon](https://github.com/six-shot/okhuomon)

---

_Built with ❤️ using OCaml and YOCaml_
# yocalm-portfolio

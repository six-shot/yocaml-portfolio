---
title: "Building Static Sites with YOCaml: A Developer's Guide"
description: "Discover how to build powerful static websites using YOCaml, the OCaml-based static site generator"
author: "six-shot"
date: "2025-01-27"
tags: ["yocaml", "ocaml", "static-sites", "functional-programming"]
category: "Backend Development"
featured: true
draft: false
---

# Building Static Sites with YOCaml: A Developer's Guide

YOCaml is a powerful static site generator written in OCaml that brings the benefits of functional programming to web development. In this guide, I'll show you how to leverage YOCaml's capabilities to build modern, performant static websites.

## What is YOCaml?

YOCaml is a static site generator that uses OCaml's type system and functional programming paradigms to create reliable, maintainable build processes. It's particularly well-suited for:

- **Type-safe content processing**
- **Composable build pipelines**
- **Markdown to HTML conversion**
- **Template rendering with metadata**
- **Asset optimization**

## Key Features

### 1. Type-Safe Content Processing

YOCaml uses OCaml's type system to ensure your content processing is correct at compile time:

```ocaml
module Article = struct
  type t = {
    title : string;
    date : string;
    tags : string list;
    content : string;
  }
end
```

### 2. Composable Pipelines

Build complex content processing pipelines by composing simple functions:

```ocaml
let process_article source =
  let pipeline =
    let open Task in
    let+ metadata, content = Yocaml_yaml.Pipeline.read_file_with_metadata source
    and+ templates = Yocaml_jingoo.read_templates template_paths
    in
    content
    |> Yocaml_markdown.from_string_to_html
    |> templates ~metadata
  in
  Action.Static.write_file output_path pipeline
```

### 3. Template System

YOCaml integrates with Jinja2 templates for flexible content rendering:

```html
<!-- article.html -->
<article>
  <header>
    <h1>{{ article.title }}</h1>
    <time>{{ article.date }}</time>
  </header>
  <div class="content">{{ article.content | safe }}</div>
  <footer>
    {% for tag in article.tags %}
    <span class="tag">{{ tag }}</span>
    {% endfor %}
  </footer>
</article>
```

## Building a Complete Site

### 1. Project Structure

```
my-site/
├── bin/
│   └── site.ml          # Main build script
├── lib/
│   └── archetype.ml     # Content type definitions
├── templates/
│   ├── layout.html      # Base template
│   ├── article.html     # Article template
│   └── page.html        # Page template
├── content/
│   ├── articles/        # Markdown articles
│   └── pages/           # Markdown pages
└── static/              # Static assets
```

### 2. Content Processing

```ocaml
let create_article source =
  let article_path = source |> Path.move ~into:www |> Path.change_extension "html" in
  let pipeline =
    let open Task in
    let+ metadata, content = Yocaml_yaml.Pipeline.read_file_with_metadata source
    and+ templates = Yocaml_jingoo.read_templates template_paths
    in
    content
    |> Yocaml_markdown.from_string_to_html
    |> templates ~metadata
  in
  Action.Static.write_file article_path pipeline
```

### 3. Batch Processing

```ocaml
let create_articles =
  let where = with_ext [ "md"; "markdown" ] in
  Batch.iter_files ~where articles create_article
```

## Advanced Features

### Custom Content Types

Define custom content types for different sections of your site:

```ocaml
module Project = struct
  type t = {
    name : string;
    description : string;
    tech_stack : string list;
    github_url : string option;
    live_url : string option;
    featured : bool;
  }
end
```

### Content Filtering

Filter content based on metadata:

```ocaml
let create_featured_articles =
  let where file =
    with_ext [ "md" ] file &&
    not (is_draft file) &&
    is_featured file
  in
  Batch.iter_files ~where articles create_article
```

### Asset Optimization

Process and optimize static assets:

```ocaml
let optimize_images =
  let where = with_ext [ "jpg"; "png"; "webp" ] in
  Batch.iter_files ~where images (fun source ->
    let output = source |> Path.move ~into:www in
    Action.copy_file source ~into:output
  )
```

## Benefits of YOCaml

1. **Type Safety**: Catch errors at compile time
2. **Performance**: Fast builds with efficient caching
3. **Composability**: Build complex pipelines from simple functions
4. **Reliability**: Functional programming reduces bugs
5. **Flexibility**: Easy to extend and customize

## Getting Started

1. Install OCaml and opam
2. Create a new project with `dune-project`
3. Add YOCaml dependencies
4. Define your content types
5. Create templates
6. Write your build pipeline

## Conclusion

YOCaml brings the power of functional programming to static site generation. Its type-safe approach and composable architecture make it an excellent choice for developers who value reliability and maintainability in their build processes.

Whether you're building a personal blog, documentation site, or portfolio, YOCaml provides the tools you need to create professional, performant static websites.

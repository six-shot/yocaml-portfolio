# GitHub Pages Deployment

## Option 1: GitHub Actions (Automated)
Create .github/workflows/deploy.yml:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup OCaml
      uses: ocaml/setup-ocaml@v2
      with:
        ocaml-version: '4.14'
        
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

## Option 2: Manual Deploy
1. Build: `dune exec bin/blog.exe`
2. Copy `_www/` contents to `gh-pages` branch
3. Enable GitHub Pages in repo settings


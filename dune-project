(lang dune 3.0)

(name okhuomon)

(generate_opam_files true)

(package
 (name okhuomon)
 (allow_empty)
 (synopsis "Personal portfolio website built with YOCaml")
 (description "A modern portfolio website showcasing creative frontend engineering work, built with YOCaml static site generator")
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
  yocaml_jingoo)
 (tags ("portfolio" "yocaml" "static-site" "frontend" "gsap" "animation")))

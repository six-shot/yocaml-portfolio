open Yocaml

let www = Path.rel [ "_www" ]
let images = Path.rel [ "images" ]
let css = Path.rel [ "css" ]
let content = Path.rel [ "content" ]
let pages = Path.(content / "pages")
let templates = Path.rel [ "templates" ]
let articles = Path.(content / "articles")

let with_ext exts file =
  List.exists (fun ext -> Path.has_extension ext file) exts

let copy_images =
  let images_path = Path.(www / "images")
  and where = with_ext [ "svg"; "png"; "jpg"; "gif" ] in
  Batch.iter_files ~where images (Action.copy_file ~into:images_path)

(* CSS copying is handled in bin/blog.ml *)

let copy_js =
  let js_path = Path.(www / "js")
  and where = with_ext [ "js" ] in
  Batch.iter_files ~where (Path.rel [ "js" ]) (Action.copy_file ~into:js_path)

let create_index_page =
  let template_path = Path.(templates / "main.html") in
  Action.copy_file template_path ~into:www ~new_name:"index.html"

let create_footer =
  let footer_path = Path.(templates / "footer.html") in
  Action.copy_file footer_path ~into:www

(* Removed create_index_page - will handle manually *)

(* Commented out page creation - missing templates and content directory
let create_page source =
  let page_path =
    source 
    |> Path.move ~into:www 
    |> Path.change_extension "html"
  in
  let pipeline =
    let open Task in
    (* Track the binary so rebuilds happen when the generator changes.
       Found this pattern in YOCaml examples: _opam/.opam-switch/sources/yocaml/examples/simple-blog/simple_blog.ml
       Originally had 'track_binary' which doesn't exist - should be Pipeline.track_file *)
    let+ () = Pipeline.track_file (Path.rel [ Sys.argv.(0) ])
    and+ metadata, content =
      Yocaml_yaml.Pipeline.read_file_with_metadata
        (module Archetype.Page)
        source
    and+ apply_templates = 
      Yocaml_jingoo.read_templates 
        Path.[ templates / "page.html"
             ; templates / "layout.html" ]
    in
    content
    |> Yocaml_markdown.from_string_to_html
    |> apply_templates (module Archetype.Page) ~metadata
    
  in
  Action.Static.write_file page_path pipeline

let create_pages =
  let where file = 
    with_ext [ "md"; "markdown"; "mdown" ] file && 
    Path.basename file <> Some "sticky-cards.md"
  in
  Batch.iter_files ~where pages create_page
*)


(* Commented out article creation - missing templates and content directory
let create_article source =
  let article_path =
    source
    |> Path.(move ~into:(www / "articles"))
    |> Path.change_extension "html"
  in
  let pipeline =
    let open Task in
    let+ () = Pipeline.track_file (Path.rel [ Sys.argv.(0) ])
    and+ templates =
      Yocaml_jingoo.read_templates
        Path.[ templates / "article.html"
             ; templates / "layout.html" ]
    and+ metadata, content =
      Yocaml_yaml.Pipeline.read_file_with_metadata
        (module Archetype.Article)
        source
    in
    content 
    |> Yocaml_markdown.from_string_to_html
    |> templates (module Archetype.Article) ~metadata
  in
  Action.Static.write_file article_path pipeline

let create_articles =
  let where = with_ext [ "md"; "markdown"; "mdown" ] in
  Batch.iter_files ~where articles create_article
*)

let program () =
  let open Eff in
  let cache = Path.(www / ".cache") in
  Action.restore_cache cache
  >>= copy_images
  (* CSS copying is handled in bin/blog.ml *)
  >>= copy_js
  >>= create_index_page
  >>= create_footer
  (* Removed create_pages and create_articles - missing templates and content *)
  >>= Action.store_cache cache


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

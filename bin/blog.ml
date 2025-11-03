open Yocaml
open Archetype

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

let create_css =
  let css_path = Path.(www / "style.css") in
  Action.Static.write_file css_path
    (Pipeline.pipe_files ~separator:"\n"
       Path.[
         css / "style.css";
         css / "animations.css";
         css / "folder-hover.css";
         css / "content.css";
       ])

let copy_js =
  let js_path = Path.(www / "js")
  and where = with_ext [ "js" ] in
  Batch.iter_files ~where (Path.rel [ "js" ]) (Action.copy_file ~into:js_path)

let copy_css_files =
  let where = with_ext [ "css" ] in
  Batch.iter_files ~where css (Action.copy_file ~into:www)

let copy_cname =
  Action.copy_file (Path.rel [ "CNAME" ]) ~into:www

let create_index_page =
  let main_html_path = Path.(templates / "main.html") in
  Action.copy_file main_html_path ~into:www ~new_name:"index.html"

(* Footer removed - not needed *)

(* Removed create_index_page - will handle manually *)

let create_page source =
  let page_path =
    source 
    |> Path.move ~into:www 
    |> Path.change_extension "html"
  in
  let pipeline =
    let open Task in
    let+ () = Pipeline.track_file (Path.rel [ Sys.argv.(0) ])
    and+ metadata, content =
      Yocaml_yaml.Pipeline.read_file_with_metadata
        (module Page)
        source
    and+ apply_templates = 
      Yocaml_jingoo.read_templates 
        [ Path.(templates / "page.html")
        ; Path.(templates / "layout.html") ]
    in
    content
    |> Yocaml_markdown.from_string_to_html
    |> apply_templates (module Page) ~metadata
    
  in
  Action.Static.write_file page_path pipeline

let create_pages =
  let where file = 
    with_ext [ "md"; "markdown"; "mdown" ] file && 
    Path.basename file <> Some "sticky-cards.md"
  in
  Batch.iter_files ~where pages create_page


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
        [ Path.(templates / "article.html")
        ; Path.(templates / "layout.html") ]
    and+ metadata, content =
      Yocaml_yaml.Pipeline.read_file_with_metadata
        (module Article)
        source
    in
    content 
    |> Yocaml_markdown.from_string_to_html
    |> templates (module Article) ~metadata
  in
  Action.Static.write_file article_path pipeline

let create_articles =
  let where = with_ext [ "md"; "markdown"; "mdown" ] in
  Batch.iter_files ~where articles create_article

(* Articles index temporarily disabled - will implement later *)

let program () =
  let open Eff in
  let cache = Path.(www / ".cache") in
  Action.restore_cache cache
  >>= copy_images
  >>= create_css
  >>= copy_css_files
  >>= copy_js
  >>= copy_cname
  >>= create_index_page
  >>= create_pages
  >>= create_articles
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

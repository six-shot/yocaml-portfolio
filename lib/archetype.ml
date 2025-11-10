module Project = struct
  type t = {
    name : string;
    type_ : string;
    description : string;
    label : string;
    featured : bool;
  }

  let make ?(featured = false) ~type_ ~description ~label name =
    { name; type_; description; label; featured }

  let name { name; _ } = name
  let type_ { type_; _ } = type_
  let description { description; _ } = description
  let label { label; _ } = label
  let featured { featured; _ } = featured

  let to_yaml { name; type_; description; label; featured } =
    let fields = [
      ("name", `String name);
      ("type", `String type_);
      ("description", `String description);
      ("label", `String label);
      ("featured", `Bool featured);
    ] in
    `O fields

  let of_yaml = function
    | `O fields ->
        let name = match List.assoc_opt "name" fields with
          | Some (`String n) -> n
          | _ -> "Untitled Project"
        in
        let type_ = match List.assoc_opt "type" fields with
          | Some (`String t) -> t
          | _ -> "Unknown"
        in
        let description = match List.assoc_opt "description" fields with
          | Some (`String d) -> d
          | _ -> ""
        in
        let label = match List.assoc_opt "label" fields with
          | Some (`String l) -> l
          | _ -> "View Project"
        in
        let featured = match List.assoc_opt "featured" fields with
          | Some (`Bool f) -> f
          | _ -> false
        in
        { name; type_; description; label; featured }
    | _ -> make ~type_:"Unknown" ~description:"" ~label:"View Project" "Untitled Project"
end

module Nav = struct
  type t = {
    label : string;
    href : string;
  }

  let make ~label ~href = { label; href }

  let label { label; _ } = label
  let href { href; _ } = href

  let to_yaml { label; href } =
    `O [ ("label", `String label); ("href", `String href) ]

  let of_yaml = function
    | `O fields ->
        let label =
          match List.assoc_opt "label" fields with
          | Some (`String s) -> s
          | _ -> ""
        in
        let href =
          match List.assoc_opt "href" fields with
          | Some (`String s) -> s
          | _ -> "#"
        in
        { label; href }
    | _ -> make ~label:"" ~href:"#"
end

module Article = struct
  type t = {
    title : string;
    description : string option;
    date : string;
    author : string option;
    tags : string list;
    draft : bool;
    featured : bool;
    category : string option;
  }

  let make ?description ?author ?(tags = []) ?(draft = false) ?(featured = false) ?category title =
    let date = 
      let now = Unix.time () in
      let tm = Unix.gmtime now in
      Printf.sprintf "%04d-%02d-%02d" 
        (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
    in
    { title; description; date; author; tags; draft; featured; category }

  let title { title; _ } = title
  let description { description; _ } = description
  let date { date; _ } = date
  let author { author; _ } = author
  let tags { tags; _ } = tags
  let draft { draft; _ } = draft
  let featured { featured; _ } = featured
  let category { category; _ } = category

  let to_yaml { title; description; date; author; tags; draft; featured; category } =
    let fields = [
      ("title", `String title);
      ("date", `String date);
      ("draft", `Bool draft);
      ("featured", `Bool featured);
    ] in
    let fields = match description with
      | Some desc -> ("description", `String desc) :: fields
      | None -> fields
    in
    let fields = match author with
      | Some a -> ("author", `String a) :: fields
      | None -> fields
    in
    let fields = match category with
      | Some c -> ("category", `String c) :: fields
      | None -> fields
    in
    let fields = if tags <> [] then
        ("tags", `List (List.map (fun t -> `String t) tags)) :: fields
      else fields
    in
    `O fields

  let of_yaml = function
    | `O fields ->
        let title = match List.assoc_opt "title" fields with
          | Some (`String t) -> t
          | _ -> "Untitled"
        in
        let description = match List.assoc_opt "description" fields with
          | Some (`String d) -> Some d
          | _ -> None
        in
        let date = match List.assoc_opt "date" fields with
          | Some (`String d) -> d
          | _ -> 
              let now = Unix.time () in
              let tm = Unix.gmtime now in
              Printf.sprintf "%04d-%02d-%02d" 
                (tm.tm_year + 1900) (tm.tm_mon + 1) tm.tm_mday
        in
        let author = match List.assoc_opt "author" fields with
          | Some (`String a) -> Some a
          | _ -> None
        in
        let tags = match List.assoc_opt "tags" fields with
          | Some (`List ts) -> 
              List.filter_map (function `String t -> Some t | _ -> None) ts
          | _ -> []
        in
        let draft = match List.assoc_opt "draft" fields with
          | Some (`Bool d) -> d
          | _ -> false
        in
        let featured = match List.assoc_opt "featured" fields with
          | Some (`Bool f) -> f
          | _ -> false
        in
        let category = match List.assoc_opt "category" fields with
          | Some (`String c) -> Some c
          | _ -> None
        in
        { title; description; date; author; tags; draft; featured; category }
    | _ -> make "Untitled"
end

module Page = struct
  type t = {
    title : string;
    description : string option;
    date : string option;
    author : string option;
    tags : string list;
    draft : bool;
    projects : Project.t list option;
    nav : Nav.t list option;
    articles : Article.t list option;
  }

  let make ?description ?date ?author ?(tags = []) ?(draft = false) ?projects ?nav ?articles title =
    { title; description; date; author; tags; draft; projects; nav; articles }

  let title { title; _ } = title
  let description { description; _ } = description
  let date { date; _ } = date
  let author { author; _ } = author
  let tags { tags; _ } = tags
  let draft { draft; _ } = draft

  let to_yaml { title; description; date; author; tags; draft; projects; nav; articles } =
    let fields = [
      ("title", `String title);
      ("draft", `Bool draft);
    ] in
    let fields = match description with
      | Some desc -> ("description", `String desc) :: fields
      | None -> fields
    in
    let fields = match date with
      | Some d -> ("date", `String d) :: fields
      | None -> fields
    in
    let fields = match author with
      | Some a -> ("author", `String a) :: fields
      | None -> fields
    in
    let fields = if tags <> [] then
        ("tags", `List (List.map (fun t -> `String t) tags)) :: fields
      else fields
    in
    let fields = match projects with
      | Some ps -> ("projects", `List (List.map Project.to_yaml ps)) :: fields
      | None -> fields
    in
    let fields = match nav with
      | Some items -> ("nav", `List (List.map Nav.to_yaml items)) :: fields
      | None -> fields
    in
    let fields = match articles with
      | Some as_ -> ("articles", `List (List.map Article.to_yaml as_)) :: fields
      | None -> fields
    in
    `O fields

  let of_yaml = function
    | `O fields ->
        let title = match List.assoc_opt "title" fields with
          | Some (`String t) -> t
          | _ -> "Untitled"
        in
        let description = match List.assoc_opt "description" fields with
          | Some (`String d) -> Some d
          | _ -> None
        in
        let date = match List.assoc_opt "date" fields with
          | Some (`String d) -> Some d
          | _ -> None
        in
        let author = match List.assoc_opt "author" fields with
          | Some (`String a) -> Some a
          | _ -> None
        in
        let tags = match List.assoc_opt "tags" fields with
          | Some (`List ts) -> 
              List.filter_map (function `String t -> Some t | _ -> None) ts
          | _ -> []
        in
        let draft = match List.assoc_opt "draft" fields with
          | Some (`Bool d) -> d
          | _ -> false
        in
        let projects = None in (* Not loaded from YAML for pages *)
        let nav = None in
        let articles = None in
        { title; description; date; author; tags; draft; projects; nav; articles }
    | _ -> make "Untitled"
end

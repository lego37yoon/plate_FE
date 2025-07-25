import { error as kitError, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { ProjectForm } from "../../../types/others";
import { UploadObject } from "$lib/s3/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAndUpdate } from "$lib/plate/parser";

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const [codeReq, userReq] = await Promise.all([
    supabase.from("lang_codes").select("code, origin_name"),
    supabase.from("user").select("id, nick, avatar, pref_lang")
  ]);

  if (codeReq.error || userReq.error) {
    throw kitError(500, `Fetching Language Code = ${codeReq.error ?? "Successful"} / Fetching User List = ${userReq.error ?? "Successful"}`);
  } else {
    return {
      lang_codes: codeReq.data,
      users: userReq.data
    }
  }
}

export const actions: Actions = {
  default: async ({ request, locals: { supabase }}) => {
    const f = await request.formData();
    const name = f.get("name");
    const version = f.get("version");
    const desc = f.get("desc");
    const manager = f.get("manager_real");
    const src_lang = f.get("src_lang_real");
    const supported_lang = f.get("supported_lang_real");

    const files = f.get("resource");
    const docs = f.get("documents");

    if ([name, version, desc, manager, src_lang, supported_lang].includes(null) || isNaN(Number(manager?.toString()))) {
      throw kitError(500, "Fill the form");
    } else {
      const { data, error } = await supabase.from("projects").insert({
        name: name?.toString(),
        version: version?.toString(),
        desc: desc?.toString(),
        default_lang: src_lang?.toString(),
        manager: Number(manager?.toString())
      }).select("id");

      if (error) {
        throw kitError(500, "Database Update Failed");
      } else {
        if (data) {
          const langs: { project_id: number, manager: number, code: string }[] = [];
          supported_lang?.toString().split(",").forEach((lang) => langs.push({
            project_id: data[0].id,
            manager: Number(manager?.toString()),
            code: lang
          }));

          const { error } = await supabase.from("langs").insert(langs);

          if (!error) {
            if (files) {
              if (Array.isArray(files)) {
                files.forEach((file: File, idx: number) => {
                  uploadFiles(file, data[0].id, supabase, "resource", idx, f);
                })
              } else {
                uploadFiles(files as File, data[0].id, supabase, "resource", 0, f);
              }
            }
            
            if (docs) {
              if (Array.isArray(docs)) {
                docs.forEach((doc, idx) => {
                  uploadFiles(doc as File, data[0].id, supabase, "doc", idx);
                })
              } else {
                uploadFiles(docs as File, data[0].id, supabase, "doc", 0, f);
              }
            }

            redirect(303, `/projects/${data[0].id}`);
          }
        } else {
          throw kitError(500, "Database does not have project");
        }
      }
    }
  }
}

async function uploadFiles(file : File, id: number, supabase: SupabaseClient, type: "resource" | "doc", idx: number, form? : FormData) {
  console.log(file.name, file.size, file.stream());

  const path = await UploadObject(file, file.name, `projects/${id}/${type}/`);

  if (path) {
    const { data, error } = await supabase.from("files").insert({
      project_id: id,
      name: file.name,
      src: path
    }).select("id");

    if (data) {
      if (type === "doc") {
        const { error } = await supabase.from("docs").insert({
          src: "object",
          title: file.name,
          for: form?.get(`doc-${idx}-category_real`)?.toString() ?? "none",
          related: data[0].id,
          project_id: id,
          rule: form?.get(`doc-${idx}-rule`)?.toString() === "on" ? true : false
        });
      } else if (type == "resource") {
        parseAndUpdate(data[0].id, file, supabase);
      } else {
        throw kitError(400, "Invalid Type");
      }

      return true;
    } else if (error) {
      throw kitError(500, error.message);
    }
  } else {
    throw kitError(500, `${file.name} upload failed`);
  }
}
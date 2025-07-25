import type { SupabaseClient } from "@supabase/supabase-js";
import { error as kitError } from "@sveltejs/kit";
import * as fs from "node:fs";

// TO-DO : fix some keys matched as category
const categoryTypes = ["btn", "button", "h1", "h2", "h3", "h4", "h5", "h6", "p", "body", "desc", "quote", "link", "a"];
const typePatternStr = `(?:[-_+]+(?:${categoryTypes.join("|")}\b)|(\b?:${categoryTypes.join("|")})[-_+]+)`;
const checkPattern = new RegExp(typePatternStr, "gi");

export async function parseAndUpdate(file_id: number, file : File, supabase: SupabaseClient) {
  const buffer = await file.arrayBuffer();
  const data = Buffer.from(buffer);

  const jsonData = JSON.parse(data.toString());
  const jsonKeys = Object.keys(jsonData);

  const rows: Resources[] = [];

  // TO-DO : Needs support for complex format of inlang message format
  // TO-DO : Needs support Three-depth nested format.
  // TO-DO : Supports detect whether inlang format or not.

  // TO-DO : If some of values failed to insert, then rollback or update
  for (const name of jsonKeys) {
    if (name !== "$schema") {
      if (typeof jsonData[name] === "string") {
        rows.push({
          key: name,
          origin: jsonData[name],
          group_idx: 0,
          file_id: file_id,
          category: getCategoryType(name)
        })
      } else if (typeof jsonData[name] === "object") {
        const { data, error } = await supabase.from("resources").insert({
          key: name,
          origin: null,
          category: "group",
          group_idx: 0,
          file_id: file_id
        }).select("id");

        if (error) {
          throw kitError(500, `Failed to update ${name} : ${error.message}`);
        } else if (data[0].id) {
          Object.keys(jsonData[name]).forEach((subkey: string, idx: number) => {
            rows.push({
              key: subkey,
              origin: jsonData[name][subkey],
              category: getCategoryType(subkey),
              parent_id: data[0].id,
              file_id: file_id,
              group_idx: idx
            })
          });
        }
      }
    }
  }

  const { error } = await supabase.from("resources").insert(rows);

  if (error) {
    throw kitError(500, "Failed to add resource from a file");
  }
}

function getCategoryType(key: string) {
  // Check only if -, _, + located in front of / back of a word.
  // For performance, match and replace used instead of matchAll.
  // [Benchmark] 10,000 strings - match + postprocess estimate 5ms faster.
  const checkResult = (key.match(checkPattern) || []).map(r => r.replace(/^[-_+]+|[-_+]+$/g, ''));

  console.log(checkResult);

  for (let i = 0; i < categoryTypes.length; i++) {
    if (checkResult.includes(categoryTypes[i])) {
      switch(categoryTypes[i]) {
        case "btn":
        case "button":
          return "btn";
        case "p":
        case "body":
        case "desc":
          return "p"
        case "quote":
          return "blockquote"
        case "link":
        case "a":
          return "a"
        default:
          return categoryTypes[i]       
      }
    }
  }

  return "none";
}
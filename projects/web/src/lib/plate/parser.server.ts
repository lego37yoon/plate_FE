// Should be used in server-side only
import { AI_KEY } from "$env/static/private";
import { PUBLIC_AI_URL } from "$env/static/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import { error as kitError } from "@sveltejs/kit";
import OpenAI from "openai";
import { get } from "svelte/store";

// TO-DO : fix some keys matched as category
const categoryTypes = ["btn", "button", "h1", "h2", "h3", "h4", "h5", "h6", "p", "body", "desc", "quote", "link", "a"];
const typePatternStr = `(?:[-_+]+(?:${categoryTypes.join("|")}\b)|(\b?:${categoryTypes.join("|")})[-_+]+)`;
const checkPattern = new RegExp(typePatternStr, "gi");

export async function parseAndUpdate(file_id: number, file : File, supabase: SupabaseClient) {
  const client = new OpenAI({
    baseURL: PUBLIC_AI_URL,
    apiKey: AI_KEY
  });

  const buffer = await file.arrayBuffer();
  const data = Buffer.from(buffer);

  const jsonData = JSON.parse(data.toString());
  const jsonKeys = Object.keys(jsonData);

  const rows: ResourcesDatabase[] = [];

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
          category: await getCategoryType(name, client),
          parent_id: null,
          context: null,
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
          Object.keys(jsonData[name]).forEach(async (subkey: string, idx: number) => {
            rows.push({
              key: subkey,
              origin: jsonData[name][subkey],
              category: await getCategoryType(subkey, client),
              parent_id: data[0].id,
              file_id: file_id,
              group_idx: idx,
              context: null,
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

async function getCategoryType(key: string, client: OpenAI): Promise<ResourcesDatabase["category"]> {
  // Check only if -, _, + located in front of / back of a word.
  // For performance, match and replace used instead of matchAll.
  // [Benchmark] 10,000 strings - match + postprocess estimate 5ms faster.

  if (client) {
    const response = await client.chat.completions.create({
      model: "Qwen3-4B-Instruct-2507-GGUF",
      messages: [
        {
          role: "system",
          content: `Choose one category from the following options that best describes the purpose of the given key in a user interface context: 
          - btn (button)
          - p (paragraph / body text)
          - quote (blockquote)
          - link (anchor / hyperlink)
          If none of the categories match, respond with "none". Provide only the category keyword as the response without any additional explanation.
          Response Example: btn
          `
        },
        {
          role: "user",
          content: `${key}`
        }
      ]
    });

    return response.choices[0].message.content as ResourcesDatabase["category"]
  }

  const checkResult = (key.match(checkPattern) || []).map(r => r.replace(/^[-_+]+|[-_+]+$/g, ''));

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
          return categoryTypes[i] as ResourcesDatabase["category"];
      }
    }
  }

  return "none";
}

export async function updateParseResult(data: Resources[], supabase: SupabaseClient) {
  const client = new OpenAI({
    baseURL: `${PUBLIC_AI_URL}/api/v1`,
    apiKey: AI_KEY
  });

  for (const item of data) {
    await supabase.from("resources").update({ "category": await getCategoryType(item.key, client)}).eq("id", item.id);
  }
}
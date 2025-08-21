import type { PageServerLoad } from "./$types";
import { error as kitError } from "@sveltejs/kit";
import { countries, languages, type TCountries, type TLanguages } from "countries-list";

export const load: PageServerLoad = async ({ locals: { supabase }}) => {
  const { data, error } = await supabase.from("langs").select(`code, project_id.count()`);

  if (error) {
    throw kitError(500, error.message); 
  } else {
    if (data.length > 0) {
      const langList: { [key: string]: Lang_codes } = {};

      Object.keys(countries).filter(regionCode => {
        for (const entry of data) {
          if (entry.code.endsWith(regionCode)) {
            return true;
          }
        }
        return false;
      }).map(regionCode => {
        const region = countries[regionCode as keyof TCountries];
      
        if (region.languages.length > 0) {
          region.languages.map(lang => {
            langList[`${lang}_${regionCode}`] = {
              code: `${lang}_${regionCode}`,
              eng_name: `${languages[lang as keyof TLanguages].name} (${region.name})`,
              origin_name: `${languages[lang as keyof TLanguages].native} (${region.native})`
            };
          });
        }
      });
      return { projects: data, languages: langList };
    } else {
      return { projects: [], languages: {} };
    }
  }
}
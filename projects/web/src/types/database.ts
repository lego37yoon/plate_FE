type Docs = {
    meta: {
        src: string, 
        title: string, 
        last: string,
        lang: string,
    } | undefined,
    body?: string,
    error: boolean,
    errorMessage?: string,
    isOpen: boolean
}

type Dictionary = {
    id: number,
    lang_code: string,
    origin: string,
    result: string,
    approved: boolean
}

type Files = {
    id: number,
    last_updated: string,
    project_id: number,
    name: string,
    src: string
}

type Lang_codes = {
    code: string,
    origin_name: string,
    eng_name: string
}

type Langs = {
    id: number,
    created_at: number,
    project_id: number,
    manager: number,
    code: string
}

type Projects = {
    id: number,
    last_updated: string,
    name: string,
    version: string,
    desc: string,
    default_lang: string,
    manager: number
}

type Resources = {
    id: number;
    key: string;
    origin: string;
    category: "btn"|"h1"|"h2"|"h3"|"h4"|"p"|"blockquote"|"a"|"none"|"group"|undefined;
    parent_id: number | null;
    group_idx: number | null;
    context: string | null;
    results: {
        origin_id: number,
        approved: boolean,
        author: string,
        result: string,
        lang_code: string
    }[];
}

type Results = {
    id: number,
    last_updated: string,
    origin_id: number,
    approved: boolean,
    author: number,
    result: string,
    lang_code: string
}

type Rules = {
    id: number,
    category: number,
    type: number,
    global: boolean,
    lang_code: string,
    from: number
}
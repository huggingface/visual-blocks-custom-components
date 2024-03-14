import { TASKS_DATA } from "@huggingface/tasks";

export const COLLECTION_NAME_CLIENT = "Hugging Face Collection (Client)";
export const COLLECTION_NAME_SERVER = "Hugging Face Collection (Server)";
export const COLLECTION_NAME_SHARED = "Hugging Face Collection";

// d3 schemePaired
export const COLORS = [
  [166, 206, 227],
  [31, 120, 180],
  [178, 223, 138],
  [51, 160, 44],
  [251, 154, 153],
  [227, 26, 28],
  [253, 191, 111],
  [255, 127, 0],
  [202, 178, 214],
  [106, 61, 154],
  [255, 255, 153],
  [177, 89, 40],
];

export const CURATED_MODELS_CLIENT = {
  background_removal: [
    {
      value: "Xenova/modnet",
      label: "Xenova/modnet",
    },
    {
      value: "briaai/RMBG-1.4",
      label: "briaai/RMBG-1.4",
    },
  ],
  depth_estimation: [
    {
      value: "Xenova/depth-anything-small-hf",
      label: "Xenova/depth-anything-small-hf",
    },
    {
      value: "Xenova/depth-anything-base-hf",
      label: "Xenova/depth-anything-base-hf",
    },
  ],
  image_classification: [
    {
      value: "Xenova/mobilevit-x-small",
      label: "Xenova/mobilevit-x-small",
    },
    {
      value: "Xenova/mobilevit-xx-small",
      label: "Xenova/mobilevit-xx-small",
    },
    {
      value: "Xenova/mobilevit-small",
      label: "Xenova/mobilevit-small",
    },
  ],
  image_segmentation: [
    {
      value: "Xenova/segformer_b0_clothes",
      label: "Xenova/segformer_b0_clothes",
    },
    {
      value: "Xenova/face-parsing",
      label: "Xenova/face-parsing",
    },
  ],
  object_detection: [
    {
      value: "Xenova/detr-resnet-50",
      label: "Xenova/detr-resnet-50",
    },
    {
      value: "Xenova/detr-resnet-101",
      label: "Xenova/detr-resnet-101",
    },
  ],
  text_classification: [
    {
      value: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      label: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
    },
    {
      value: "Xenova/distilbert-base-uncased-distilled-squad",
      label: "Xenova/distilbert-base-uncased-distilled-squad",
    },
  ],
  token_classification: [
    {
      value: "Xenova/bert-base-multilingual-cased-ner-hrl",
      label: "Xenova/bert-base-multilingual-cased-ner-hrl",
    },
    {
      value: "Xenova/Xenova/bert-base-NER-uncased",
      label: "Xenova/Xenova/bert-base-NER-uncased",
    },
  ],
  translation: [
    {
      value: "Xenova/nllb-200-distilled-600M",
      label: "Xenova/nllb-200-distilled-600M",
    },
  ],
  text_to_text: [
    {
      value: "Xenova/t5-small",
      label: "Xenova/t5-small",
    },
    {
      value: "Xenova/t5-base",
      label: "Xenova/t5-base",
    },
  ],
};

export const CURATED_MODELS = {
  text_to_image: [
    {
      value: "stabilityai/stable-diffusion-xl-base-1.0",
      label: "stabilityai/stable-diffusion-xl-base-1.0",
    },
    {
      value: "stabilityai/stable-diffusion-2-1",
      label: "stabilityai/stable-diffusion-2-1",
    },
    {
      value: "playgroundai/playground-v2.5-1024px-aesthetic",
      label: "playgroundai/playground-v2.5-1024px-aesthetic",
    },
    {
      value: "segmind/SSD-1B",
      label: "segmind/SSD-1B",
    },
  ],
  token_classification: (TASKS_DATA["token-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  text_generation: (TASKS_DATA["text-generation"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
  text_classification: (TASKS_DATA["text-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  summarization: (TASKS_DATA["summarization"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
  image_classification: (TASKS_DATA["image-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  fill_mask: (TASKS_DATA["fill-mask"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
};

export const LANGUAGES = {
  "Acehnese (Arabic script)": "ace_Arab",
  "Acehnese (Latin script)": "ace_Latn",
  Afrikaans: "afr_Latn",
  Akan: "aka_Latn",
  Amharic: "amh_Ethi",
  Armenian: "hye_Armn",
  Assamese: "asm_Beng",
  Asturian: "ast_Latn",
  Awadhi: "awa_Deva",
  "Ayacucho Quechua": "quy_Latn",
  Balinese: "ban_Latn",
  Bambara: "bam_Latn",
  "Banjar (Arabic script)": "bjn_Arab",
  "Banjar (Latin script)": "bjn_Latn",
  Bashkir: "bak_Cyrl",
  Basque: "eus_Latn",
  Belarusian: "bel_Cyrl",
  Bemba: "bem_Latn",
  Bengali: "ben_Beng",
  Bhojpuri: "bho_Deva",
  Bosnian: "bos_Latn",
  Buginese: "bug_Latn",
  Bulgarian: "bul_Cyrl",
  Burmese: "mya_Mymr",
  Catalan: "cat_Latn",
  Cebuano: "ceb_Latn",
  "Central Atlas Tamazight": "tzm_Tfng",
  "Central Aymara": "ayr_Latn",
  "Central Kanuri (Arabic script)": "knc_Arab",
  "Central Kanuri (Latin script)": "knc_Latn",
  "Central Kurdish": "ckb_Arab",
  Chhattisgarhi: "hne_Deva",
  "Chinese (Simplified)": "zho_Hans",
  "Chinese (Traditional)": "zho_Hant",
  Chokwe: "cjk_Latn",
  "Crimean Tatar": "crh_Latn",
  Croatian: "hrv_Latn",
  Czech: "ces_Latn",
  Danish: "dan_Latn",
  Dari: "prs_Arab",
  Dutch: "nld_Latn",
  Dyula: "dyu_Latn",
  Dzongkha: "dzo_Tibt",
  "Eastern Panjabi": "pan_Guru",
  "Eastern Yiddish": "ydd_Hebr",
  "Egyptian Arabic": "arz_Arab",
  English: "eng_Latn",
  Esperanto: "epo_Latn",
  Estonian: "est_Latn",
  Ewe: "ewe_Latn",
  Faroese: "fao_Latn",
  Fijian: "fij_Latn",
  Finnish: "fin_Latn",
  Fon: "fon_Latn",
  French: "fra_Latn",
  Friulian: "fur_Latn",
  Galician: "glg_Latn",
  Ganda: "lug_Latn",
  Georgian: "kat_Geor",
  German: "deu_Latn",
  Greek: "ell_Grek",
  Guarani: "grn_Latn",
  Gujarati: "guj_Gujr",
  "Haitian Creole": "hat_Latn",
  "Halh Mongolian": "khk_Cyrl",
  Hausa: "hau_Latn",
  Hebrew: "heb_Hebr",
  Hindi: "hin_Deva",
  Hungarian: "hun_Latn",
  Icelandic: "isl_Latn",
  Igbo: "ibo_Latn",
  Ilocano: "ilo_Latn",
  Indonesian: "ind_Latn",
  Irish: "gle_Latn",
  Italian: "ita_Latn",
  Japanese: "jpn_Jpan",
  Javanese: "jav_Latn",
  Jingpho: "kac_Latn",
  Kabiyè: "kbp_Latn",
  Kabuverdianu: "kea_Latn",
  Kabyle: "kab_Latn",
  Kamba: "kam_Latn",
  Kannada: "kan_Knda",
  "Kashmiri (Arabic script)": "kas_Arab",
  "Kashmiri (Devanagari script)": "kas_Deva",
  Kazakh: "kaz_Cyrl",
  Khmer: "khm_Khmr",
  Kikongo: "kon_Latn",
  Kikuyu: "kik_Latn",
  Kimbundu: "kmb_Latn",
  Kinyarwanda: "kin_Latn",
  Korean: "kor_Hang",
  Kyrgyz: "kir_Cyrl",
  Lao: "lao_Laoo",
  Latgalian: "ltg_Latn",
  Ligurian: "lij_Latn",
  Limburgish: "lim_Latn",
  Lingala: "lin_Latn",
  Lithuanian: "lit_Latn",
  Lombard: "lmo_Latn",
  "Luba-Kasai": "lua_Latn",
  Luo: "luo_Latn",
  Luxembourgish: "ltz_Latn",
  Macedonian: "mkd_Cyrl",
  Magahi: "mag_Deva",
  Maithili: "mai_Deva",
  Malayalam: "mal_Mlym",
  Maltese: "mlt_Latn",
  Maori: "mri_Latn",
  Marathi: "mar_Deva",
  "Meitei (Bengali script)": "mni_Beng",
  "Mesopotamian Arabic": "acm_Arab",
  "Minangkabau (Arabic script)": "min_Arab",
  "Minangkabau (Latin script)": "min_Latn",
  Mizo: "lus_Latn",
  "Modern Standard Arabic (Romanized)": "arb_Latn",
  "Modern Standard Arabic": "arb_Arab",
  "Moroccan Arabic": "ary_Arab",
  Mossi: "mos_Latn",
  "Najdi Arabic": "ars_Arab",
  Nepali: "npi_Deva",
  "Nigerian Fulfulde": "fuv_Latn",
  "North Azerbaijani": "azj_Latn",
  "North Levantine Arabic": "apc_Arab",
  "Northern Kurdish": "kmr_Latn",
  "Northern Sotho": "nso_Latn",
  "Northern Uzbek": "uzn_Latn",
  "Norwegian Bokmål": "nob_Latn",
  "Norwegian Nynorsk": "nno_Latn",
  Nuer: "nus_Latn",
  Nyanja: "nya_Latn",
  Occitan: "oci_Latn",
  Odia: "ory_Orya",
  Santali: "sat_Olck",
  Sardinian: "srd_Latn",
  "Scottish Gaelic": "gla_Latn",
  Serbian: "srp_Cyrl",
  Shan: "shn_Mymr",
  Shona: "sna_Latn",
  Sicilian: "scn_Latn",
  Silesian: "szl_Latn",
  Sindhi: "snd_Arab",
  Sinhala: "sin_Sinh",
  Slovak: "slk_Latn",
  Slovenian: "slv_Latn",
  Somali: "som_Latn",
  "South Azerbaijani": "azb_Arab",
  "South Levantine Arabic": "ajp_Arab",
  "Southern Pashto": "pbt_Arab",
  "Southern Sotho": "sot_Latn",
  "Southwestern Dinka": "dik_Latn",
  Spanish: "spa_Latn",
  "Standard Latvian": "lvs_Latn",
  "Standard Malay": "zsm_Latn",
  "Standard Tibetan": "bod_Tibt",
  Sundanese: "sun_Latn",
  Swahili: "swh_Latn",
  Swati: "ssw_Latn",
  Swedish: "swe_Latn",
  Tagalog: "tgl_Latn",
  Tajik: "tgk_Cyrl",
  "Tamasheq (Latin script)": "taq_Latn",
  "Tamasheq (Tifinagh script)": "taq_Tfng",
  Tamil: "tam_Taml",
  Tatar: "tat_Cyrl",
  "Ta’izzi-Adeni Arabic": "acq_Arab",
  Telugu: "tel_Telu",
  Thai: "tha_Thai",
  Tigrinya: "tir_Ethi",
  "Tok Pisin": "tpi_Latn",
  "Tosk Albanian": "als_Latn",
  Tsonga: "tso_Latn",
  Tswana: "tsn_Latn",
  Tumbuka: "tum_Latn",
  "Tunisian Arabic": "aeb_Arab",
  Turkish: "tur_Latn",
  Turkmen: "tuk_Latn",
  Twi: "twi_Latn",
  Ukrainian: "ukr_Cyrl",
  Umbundu: "umb_Latn",
  Urdu: "urd_Arab",
  Uyghur: "uig_Arab",
  Venetian: "vec_Latn",
  Vietnamese: "vie_Latn",
  Waray: "war_Latn",
  Welsh: "cym_Latn",
  "West Central Oromo": "gaz_Latn",
  "Western Persian": "pes_Arab",
  Wolof: "wol_Latn",
  Xhosa: "xho_Latn",
  Yoruba: "yor_Latn",
  "Yue Chinese": "yue_Hant",
  Zulu: "zul_Latn",
};

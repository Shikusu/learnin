// Sanitize a string field — strip HTML tags and limit length
const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
};

// Recursively validate and sanitize the outline tree
// Returns a clean node or throws with a descriptive message
const sanitizeOutlineNode = (node, depth = 0, path = "outline") => {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new Error(`${path}: must be an object.`);
  }

  const title = sanitizeString(node.title, 200);
  if (!title) throw new Error(`${path}: missing or empty "title".`);

  if (depth >= 3) {
    // Cap depth — just return the node as a leaf, ignore deeper children
    return { title, children: [] };
  }

  if (!Array.isArray(node.children)) {
    throw new Error(`${path}: "children" must be an array.`);
  }

  if (node.children.length > 6) {
    throw new Error(`${path}: too many children (max 6).`);
  }

  const children = node.children.map((child, i) =>
    sanitizeOutlineNode(child, depth + 1, `${path}.children[${i}]`)
  );

  return { title, children };
};

export const sanitizeFiche = (raw) => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { valid: false, error: "JSON must be an object." };
  }

  try {
    // ── topic ──────────────────────────────────────────────
    const topic = sanitizeString(raw.topic, 120);
    if (!topic) return { valid: false, error: 'Missing or empty "topic" field.' };

    // ── summary ────────────────────────────────────────────
    if (!Array.isArray(raw.summary) || raw.summary.length === 0) {
      return { valid: false, error: '"summary" must be a non-empty array of sentences.' };
    }
    if (raw.summary.length > 10) {
      return { valid: false, error: '"summary" has too many sentences (max 10).' };
    }
    const summary = raw.summary.map((s, i) => {
      const clean = sanitizeString(s, 600);
      if (!clean) throw new Error(`summary[${i}]: empty sentence.`);
      return clean;
    });

    // ── key_concepts ───────────────────────────────────────
    if (!Array.isArray(raw.key_concepts) || raw.key_concepts.length === 0) {
      return { valid: false, error: '"key_concepts" must be a non-empty array.' };
    }
    if (raw.key_concepts.length > 30) {
      return { valid: false, error: '"key_concepts" has too many entries (max 30).' };
    }
    const key_concepts = raw.key_concepts.map((c, i) => {
      if (!c || typeof c !== "object") throw new Error(`key_concepts[${i}]: invalid format.`);
      const term = sanitizeString(c.term, 150);
      if (!term) throw new Error(`key_concepts[${i}]: missing "term".`);
      const definition = sanitizeString(c.definition, 800);
      if (!definition) throw new Error(`key_concepts[${i}]: missing "definition".`);
      return { term, definition };
    });

    // ── outline ────────────────────────────────────────────
    if (!raw.outline || typeof raw.outline !== "object" || Array.isArray(raw.outline)) {
      return { valid: false, error: '"outline" must be an object.' };
    }
    const outline = sanitizeOutlineNode(raw.outline);

    // ── mnemonics ──────────────────────────────────────────
    if (!Array.isArray(raw.mnemonics)) {
      return { valid: false, error: '"mnemonics" must be an array (can be empty).' };
    }
    if (raw.mnemonics.length > 10) {
      return { valid: false, error: '"mnemonics" has too many entries (max 10).' };
    }
    const mnemonics = raw.mnemonics.map((m, i) => {
      if (!m || typeof m !== "object") throw new Error(`mnemonics[${i}]: invalid format.`);
      const concept = sanitizeString(m.concept, 200);
      if (!concept) throw new Error(`mnemonics[${i}]: missing "concept".`);
      const mnemonic = sanitizeString(m.mnemonic, 400);
      if (!mnemonic) throw new Error(`mnemonics[${i}]: missing "mnemonic".`);
      const explanation = sanitizeString(m.explanation ?? "", 600);
      return { concept, mnemonic, explanation };
    });

    return {
      valid: true,
      data: { topic, summary, key_concepts, outline, mnemonics },
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};
const SYNONYM_GROUPS = [
  ["aceite", "oliva", "aove", "virgen", "girasol"],
  ["leche", "lactea", "entera", "desnatada", "semidesnatada"],
  ["detergente", "lavadora", "colada", "jabon"],
  ["cafe", "molido", "grano", "descafeinado", "capsula"],
  ["papel", "higienico", "rollo"],
  ["panal", "panales", "dodot", "bebe"],
  ["limpieza", "lejia", "fregasuelos", "fregona"],
  ["pasta", "espagueti", "macarrone", "tallarin"],
  ["arroz", "redondo", "bomba", "largo"],
  ["atun", "conserva", "lata"],
  ["yogur", "yogure", "griego"],
  ["galleta", "galletas", "cookie"],
  ["movil", "smartphone", "telefono"],
  ["portatil", "ordenador", "laptop"],
  ["auricular", "cascos", "inalambrico", "earbud"],
  ["aspirador", "robot", "escoba"],
  ["freidora", "airfryer", "aire"],
  ["sarten", "antiadherente", "cocina"],
  ["zapatilla", "tenis", "sneaker", "running"],
  ["gafa", "gafas", "sol", "solar"],
  ["reloj", "smartwatch"],
  ["silla", "sillon", "ergonomica", "escritorio"],
  ["sofa", "salon"],
  ["camara", "reflex", "mirrorless"],
  ["cafetera", "espresso", "expresso"],
];

const RELATED = new Map();
SYNONYM_GROUPS.forEach((group) => {
  group.forEach((word) => {
    const mates = RELATED.get(word) || new Set();
    group.forEach((other) => {
      if (other !== word) mates.add(other);
    });
    RELATED.set(word, mates);
  });
});

export function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stem(token) {
  if (token.length <= 4) return token;
  return token.replace(/(es|s)$/, "");
}

function tokensOf(text) {
  const normalized = normalize(text);
  if (!normalized) return [];
  return normalized
    .split(" ")
    .filter((token) => token.length > 1)
    .map(stem);
}

function variantsOf(token) {
  const mates = RELATED.get(token);
  return mates ? [token, ...[...mates].map(stem)] : [token];
}

export function searchScore(product, query) {
  const queryTokens = tokensOf(query);
  if (!queryTokens.length) return 0;

  const nameTokens = tokensOf(`${product.name} ${product.brand || ""} ${product.unit || ""}`);
  const metaTokens = tokensOf(`${product.category || ""} ${product.description || ""}`);
  const compactName = normalize(`${product.name} ${product.unit || ""}`).replace(/\s+/g, "");

  let score = 0;
  for (const token of queryTokens) {
    const options = variantsOf(token);
    const inName = options.some((option) => nameTokens.some((word) => word.startsWith(option)));
    if (inName) {
      score += 3;
      continue;
    }
    const inMeta = options.some((option) => metaTokens.some((word) => word.startsWith(option)));
    if (inMeta) {
      score += 1;
      continue;
    }
    if (compactName.includes(token)) {
      score += 2;
      continue;
    }
    return 0;
  }
  return score;
}
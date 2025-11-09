const JSON5 = require('json5');


 
function convertRawToJSON_usingJSON5(raw) {
  if (!raw || typeof raw !== 'string') throw new Error('raw must be a string');

  let s = raw.trim();
  if (s.startsWith('```json')) s = s.slice('```json'.length);
  else if (s.startsWith('```')) s = s.slice(3);
  if (s.endsWith('```')) s = s.slice(0, -3);
  s = s.trim();

  const candidate = extractFirstBalancedBlock(s);
  const toParse = candidate || s;

  
  try {
    return JSON.parse(cleanForJSON(toParse));
  } catch (e) {
    try {
      return JSON5.parse(toParse);
    } catch (e2) {
      const sanitized = sanitizeCommonArtifacts(toParse);
      return JSON5.parse(sanitized);
    }
  }
}

function extractFirstBalancedBlock(s) {
  const startCandidates = ['{', '['];
  for (const startChar of startCandidates) {
    const start = s.indexOf(startChar);
    if (start !== -1) {
      const closeChar = startChar === '{' ? '}' : ']';
      let depth = 0;
      let inString = false;
      let stringChar = null;
      let escape = false;
      for (let i = start; i < s.length; i++) {
        const ch = s[i];
        if (inString) {
          if (escape) { escape = false; }
          else if (ch === '\\') { escape = true; }
          else if (ch === stringChar) { inString = false; stringChar = null; }
          continue;
        } else {
          if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
          if (ch === startChar) depth++;
          else if (ch === closeChar) {
            depth--;
            if (depth === 0) {
              return s.slice(start, i + 1);
            }
          }
        }
      }
    }
  }
  return null;
}

function cleanForJSON(s) {
  if (typeof s !== 'string') return s;
  let out = s.trim();
  const candidate = extractFirstBalancedBlock(out);
  if (candidate) out = candidate;
  out = out.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  out = out.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*(?=[\n\r])/g, '');
  out = out.replace(/,\s*(?=[}\]])/g, '');
  return out.trim();
}

function sanitizeCommonArtifacts(s) {
  let t = s;
  t = t.replace(/([{,]\s*)([A-Za-z0-9_\-$]+)\s*:/g, '$1"$2":');
  t = t.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, function(_, inner) {
    return '"' + inner.replace(/"/g, '\\"') + '"';
  });
  t = t.replace(/,\s*(?=[}\]])/g, '');
  t = t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*(?=[\n\r])/g, '');
  return t.trim();
}
module.exports = {
  convertRawToJSON_usingJSON5,
};
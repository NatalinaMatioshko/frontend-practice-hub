/**
 * Static checks applied before learner code is executed: a syntax pass plus
 * per-task rules such as "must use .map()" or "no for loops".
 */
export function checkSyntax(code) {
  try {
    // eslint-disable-next-line no-new-func -- parse-only, the function is never invoked
    new Function(code);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: `${error.name}: ${error.message}` };
  }
}

export function validateCode(code, rules = {}) {
  const issues = [];
  const trimmed = code.trim();

  if (!trimmed) {
    return { valid: false, issues: ['Редактор порожній — напиши рішення перед перевіркою.'] };
  }

  const syntax = checkSyntax(code);
  if (!syntax.valid) {
    return { valid: false, issues: [`Синтаксична помилка. ${syntax.error}`] };
  }

  const stripped = stripCommentsAndStrings(code);

  for (const rule of rules.required ?? []) {
    if (!toRegExp(rule.pattern).test(stripped)) {
      issues.push(rule.message ?? `Рішення має містити: ${rule.pattern}`);
    }
  }

  for (const rule of rules.forbidden ?? []) {
    if (toRegExp(rule.pattern).test(stripped)) {
      issues.push(rule.message ?? `Рішення не повинно містити: ${rule.pattern}`);
    }
  }

  return { valid: issues.length === 0, issues };
}

function toRegExp(pattern) {
  return pattern instanceof RegExp ? new RegExp(pattern.source, pattern.flags) : new RegExp(pattern);
}

/**
 * Rule matching should ignore text inside comments and string literals so that
 * a hint written in a comment never satisfies a "required pattern" check.
 */
function stripCommentsAndStrings(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ')
    .replace(/(['"`])(?:\\.|(?!\1)[\s\S])*\1/g, '""');
}

export function countLines(code) {
  return code.split('\n').length;
}

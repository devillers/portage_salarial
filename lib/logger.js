const LEVELS = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERROR'
};

function normalizeLogArguments(metaOrMessage, maybeMessage) {
  if (typeof metaOrMessage === 'string' || metaOrMessage instanceof String) {
    return { meta: undefined, message: metaOrMessage };
  }

  if (metaOrMessage && typeof maybeMessage === 'undefined') {
    return { meta: metaOrMessage, message: undefined };
  }

  return { meta: metaOrMessage, message: maybeMessage };
}

function formatMeta(meta) {
  if (!meta) return undefined;

  if (meta instanceof Error) {
    return {
      name: meta.name,
      message: meta.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : meta.stack
    };
  }

  if (typeof meta === 'object') {
    const sanitized = Array.isArray(meta) ? [] : {};

    Object.entries(meta).forEach(([key, value]) => {
      if (value instanceof Error) {
        sanitized[key] = {
          name: value.name,
          message: value.message,
          stack: process.env.NODE_ENV === 'production' ? undefined : value.stack
        };
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  try {
    return JSON.parse(JSON.stringify(meta));
  } catch (error) {
    return { detail: String(meta) };
  }
}

function log(level, metaOrMessage, maybeMessage) {
  const { meta, message } = normalizeLogArguments(metaOrMessage, maybeMessage);
  const timestamp = new Date().toISOString();
  const metaPayload = formatMeta(meta);

  const parts = [`[${timestamp}]`, `[${LEVELS[level] ?? level.toUpperCase()}]`];
  if (message) {
    parts.push(message);
  }
  if (metaPayload) {
    parts.push(JSON.stringify(metaPayload));
  }

  const output = parts.join(' ');

  switch (level) {
    case 'warn':
      console.warn(output);
      break;
    case 'error':
      console.error(output);
      break;
    default:
      console.log(output);
      break;
  }
}

const logger = {
  info(metaOrMessage, maybeMessage) {
    log('info', metaOrMessage, maybeMessage);
  },
  warn(metaOrMessage, maybeMessage) {
    log('warn', metaOrMessage, maybeMessage);
  },
  error(metaOrMessage, maybeMessage) {
    log('error', metaOrMessage, maybeMessage);
  }
};

export default logger;

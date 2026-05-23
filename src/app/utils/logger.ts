type LogContext = unknown;

const timestamp = () => new Date().toISOString();

const formatContext = (context: LogContext) => {
  if (context === undefined) {
    return '';
  }

  if (typeof context === 'string') {
    return ` ${context}`;
  }

  try {
    return ` ${JSON.stringify(context)}`;
  } catch {
    return ' [unserializable-context]';
  }
};

const info = (message: string, context?: LogContext) => {
  console.log(`[${timestamp()}] INFO ${message}${formatContext(context)}`);
};

const warn = (message: string, context?: LogContext) => {
  console.warn(`[${timestamp()}] WARN ${message}${formatContext(context)}`);
};

const error = (message: string, context?: LogContext) => {
  console.error(`[${timestamp()}] ERROR ${message}${formatContext(context)}`);
};

export const logger = {
  info,
  warn,
  error,
};
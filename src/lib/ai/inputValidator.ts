/**
 * Sakura AI — Input Validation & Safety Filter
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedMessage: string;
  isOffTopic: boolean;
  rejectionReason?: string;
}

const MAX_MESSAGE_LENGTH = 1000;

// Keywords that indicate explicitly off-topic or inappropriate prompts
const OFF_TOPIC_PATTERNS = [
  /how to make a bomb/i,
  /hack (into|bank|website)/i,
  /tell me a joke about politics/i,
  /stock market advice/i,
  /write a code in python for bitcoin/i,
];

export function validateUserInput(rawMessage: unknown): ValidationResult {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return {
      isValid: false,
      sanitizedMessage: '',
      isOffTopic: false,
      rejectionReason: 'Please enter a valid message.',
    };
  }

  const trimmed = rawMessage.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      sanitizedMessage: '',
      isOffTopic: false,
      rejectionReason: 'Message cannot be empty.',
    };
  }

  // Truncate to max length to prevent prompt injection / token exhaustion
  const sanitizedMessage = trimmed.slice(0, MAX_MESSAGE_LENGTH);

  // Check off-topic patterns
  const isOffTopic = OFF_TOPIC_PATTERNS.some((pattern) => pattern.test(sanitizedMessage));

  return {
    isValid: true,
    sanitizedMessage,
    isOffTopic,
    rejectionReason: isOffTopic
      ? "Let's stay focused on Japanese learning! 🌸 Ask me anything about Japanese grammar, vocabulary, kanji, or conversation practice."
      : undefined,
  };
}

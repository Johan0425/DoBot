
/**
 * Data Transfer Object for chat messages.
 * 
 * @interface ChatMessageDTO
 * @property {string} message - The text content of the chat message
 * @property {number} [userId] - Optional identifier of the user sending the message
 * @property {'tasks' | 'general' | 'help'} [context] - Optional context category for the chat message
 */
export interface ChatMessageDTO {
    message: string;
    userId?: number;
    context?: 'tasks' | 'general' | 'help';
  }
  
/**
 * Data Transfer Object for chat response containing AI assistant's reply and optional action metadata.
 * 
 * @interface ChatResponseDTO
 * @property {string} response - The AI assistant's text response to the user's message
 * @property {Object} [actionTaken] - Optional metadata about actions performed during response generation
 * @property {'task_created' | 'task_updated' | 'query_executed'} actionTaken.type - Type of action that was executed
 * @property {any} [actionTaken.data] - Additional data related to the performed action
 * @property {string[]} [suggestions] - Optional array of suggested follow-up actions or questions
 * @property {Date} timestamp - Timestamp when the response was generated
 */
  export interface ChatResponseDTO {
    response: string;
    actionTaken?: {
      type: 'task_created' | 'task_updated' | 'query_executed';
      data?: any;
    };
    suggestions?: string[];
    timestamp: Date;
  }
  
/**
 * Data Transfer Object for N8N webhook communication.
 * 
 * This interface defines the structure for messages exchanged between the application
 * and N8N automation platform through webhook endpoints.
 * 
 * @interface N8NWebhookDTO
 * @example
 * ```typescript
 * const webhookMessage: N8NWebhookDTO = {
 *   event: 'chat_message',
 *   data: { message: 'Hello', userId: '123' },
 *   source: 'frontend'
 * };
 * ```
 */
  export interface N8NWebhookDTO {
    event: 'chat_message' | 'task_suggestion' | 'status_query';
    data: any;
    source: 'frontend' | 'n8n' | 'system';
  }
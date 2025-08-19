const resolveHost = () =>
    (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  
  const HOST = resolveHost();
  const N8N_BASE = 
    import.meta.env.VITE_N8N_BASE || 
    `http://${HOST}:${import.meta.env.VITE_N8N_PORT || 5678}/webhook`;
  
  const JSON_HEADERS = { 'Content-Type': 'application/json' };
  
/**
 * Sends a chat message to the DoBot AI service.
 * 
 * @async
 * @function sendChatMessage
 * @param {string} message - The chat message to send.
 * @return {Promise<Object>} A promise that resolves to the response data from the server.
 * @throws {Error} Throws an error if the HTTP request fails with a non-ok status.
 * @example
 * // Send a chat message to DoBot AI
 * const response = await sendChatMessage('Hello, DoBot!');
 * console.log(response); // Response data from DoBot AI
 * @description
 * This function sends a chat message to the DoBot AI service endpoint.
 * It constructs a POST request with the message and session ID,
 * and handles the response.
 */

  export const sendChatMessage = async (message) => {
    try {
      const response = await fetch(`${N8N_BASE}/dobot-ai`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ 
          message,
          timestamp: new Date().toISOString(),
          sessionId: getSessionId()
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  };
  
/**
 * Retrieves the chat history for the current session from the server.
 * 
 * @async
 * @function getChatHistory
 * @returns {Promise<Array>} A promise that resolves to an array of chat history data.
 *                          Returns an empty array if the request fails or encounters an error.
 * @throws {Error} Throws an error if the HTTP request fails with a non-ok status.
 * 
 * @example
 * // Get chat history for current session
 * const history = await getChatHistory();
 * console.log(history); // Array of chat messages
 */
  export const getChatHistory = async () => {
    try {
      const response = await fetch(`${N8N_BASE}/chat/history?sessionId=${getSessionId()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  };
  
/**
 * Retrieves or generates a unique session ID for the DoBot application.
 * If a session ID already exists in localStorage, it returns the existing one.
 * Otherwise, it generates a new session ID using current timestamp and random string,
 * stores it in localStorage, and returns the newly created ID.
 * 
 * @returns {string} The session ID string in format 'session_{timestamp}_{randomString}'
 */
  const getSessionId = () => {
    let sessionId = localStorage.getItem('dobot_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('dobot_session_id', sessionId);
    }
    return sessionId;
  };
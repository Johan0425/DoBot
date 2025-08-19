/**
 * Controller responsible for handling chat-related HTTP requests.
 * 
 * This controller acts as an intermediary between the HTTP layer and the chat use case,
 * handling request validation, response formatting, and error handling for chat operations.
 */

import { Request, Response } from 'express';
import { ChatUseCase } from '../use-cases/chat.use-case';

    /**
     * Creates a new ChatController instance.
     * 
     * @param chatUseCase - The chat use case instance for processing chat logic
     */
   

    /**
     * Processes an incoming chat message and returns a response.
     * 
     * This method validates the incoming request, extracts the message data,
     * delegates processing to the chat use case, and formats the response.
     * 
     * @param req - Express request object containing message, userId, and context in body
     * @param res - Express response object for sending the response
     * @returns Promise that resolves when the response has been sent
     * 
     * @throws {400} When message is missing or not a string
     * @throws {500} When an internal server error occurs during processing
     */
    
    export class ChatController {
        constructor(private chatUseCase: ChatUseCase) {}
      
        async processMessage(req: Request, res: Response): Promise<void> {
          try {
            const { message, userId, context } = req.body;
            
            if (!message || typeof message !== 'string') {
              res.status(400).json({ error: 'Message is required' });
              return;
            }
      
            const response = await this.chatUseCase.processMessage({
              message,
              userId,
              context
            });
      
            res.json(response);
          } catch (error) {
            res.status(500).json({
              error: 'Internal server error',
              message: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

const API_KEY = 'AIzaSyAbJINoNUa_H8UCfdpjstcWJS2ZMjDB3mQ';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
  metadata?: {
    model?: string;
    response_time?: number;
    tokens?: number;
  };
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

export interface UserContext {
  name?: string;
  gender?: string;
  age?: number;
  skinType?: string;
  hairType?: string;
  recentAnalysis?: any;
}

/**
 * KarmaAI Service - Enhanced AI chat service with Supabase integration
 */
export class KarmaAIService {
  private model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title: string = 'New Conversation'): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data as Conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string, includeArchived: boolean = false): Promise<Conversation[]> {
    try {
      let query = supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!includeArchived) {
        query = query.eq('is_archived', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return data as Conversation[];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  /**
   * Save a message to Supabase
   */
  async saveMessage(
    conversationId: string,
    userId: string,
    content: string,
    isUserMessage: boolean,
    metadata?: any
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          content: content,
          is_user_message: isUserMessage,
          created_at: new Date().toISOString(),
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        return null;
      }

      return data as Message;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  }

  /**
   * Generate AI response with enhanced context
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: Message[],
    userContext?: UserContext
  ): Promise<{ text: string; metadata: any } | null> {
    try {
      const startTime = Date.now();

      // Build context-aware prompt
      const systemPrompt = this.buildSystemPrompt(userContext);
      const conversationContext = this.buildConversationContext(conversationHistory);
      
      const fullPrompt = `${systemPrompt}

${conversationContext}

User's current question: ${userMessage}

Please provide a comprehensive, personalized response that:
1. Directly addresses their question with specific, actionable advice
2. References their previous questions or concerns if relevant
3. Provides evidence-based recommendations
4. Suggests relevant Karma Terra products when appropriate (but don't be overly promotional)
5. Maintains a warm, friendly, and supportive tone
6. Uses simple language while being thorough
7. If discussing skincare/haircare, consider their ${userContext?.gender || 'individual'} needs
8. Includes practical tips they can implement immediately
9. Encourages follow-up questions if they need clarification

CRITICAL FORMATTING RULES:
- Write in plain text with simple formatting
- For bullet lists, use "•" or "-" at the start of lines
- For numbered lists, use "1.", "2.", "3." at the start of lines
- Use double line breaks between paragraphs
- DO NOT use markdown syntax like **, __, [], (), {}, etc.
- DO NOT use special characters or symbols except bullet points
- Keep formatting clean and simple
- Write naturally as if speaking to a friend

Response format example:
"Here's what I recommend:

For dry skin, try these steps:

• Use a gentle cleanser morning and night
• Apply hyaluronic acid serum on damp skin
• Follow with a rich moisturizer
• Don't forget sunscreen during the day

These ingredients work great because they help lock in moisture and protect your skin barrier.

Would you like specific product recommendations?"

Keep responses between 150-300 words unless more detail is specifically requested.
`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();

      // Clean up any malformed formatting
      text = this.sanitizeResponse(text);

      const responseTime = Date.now() - startTime;

      return {
        text: text,
        metadata: {
          model: 'gemini-2.0-flash-exp',
          response_time: responseTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return null;
    }
  }

  /**
   * Build system prompt with user context
   */
  private buildSystemPrompt(userContext?: UserContext): string {
    let prompt = `You are Karma Terra AI, a knowledgeable and empathetic virtual assistant specializing in skincare, haircare, beauty, and holistic wellness. You provide personalized, evidence-based advice with warmth and encouragement.

Your expertise includes:
- Skin analysis and skincare routines
- Hair health and haircare solutions
- Product recommendations (ingredients, usage)
- Lifestyle and wellness tips
- Beauty trends and techniques
- Natural and science-backed remedies`;

    if (userContext) {
      prompt += `\n\nUser Context:`;
      if (userContext.name) prompt += `\n- Name: ${userContext.name}`;
      if (userContext.gender) prompt += `\n- Gender: ${userContext.gender}`;
      if (userContext.age) prompt += `\n- Age: ${userContext.age}`;
      if (userContext.skinType) prompt += `\n- Skin Type: ${userContext.skinType}`;
      if (userContext.hairType) prompt += `\n- Hair Type: ${userContext.hairType}`;
      
      prompt += `\n\nUse this context to personalize your responses when relevant.`;
    }

    return prompt;
  }

  /**
   * Build conversation context from message history
   */
  private buildConversationContext(messages: Message[]): string {
    if (messages.length === 0) {
      return 'This is the start of a new conversation.';
    }

    // Get last 6 messages for context (to stay within token limits)
    const recentMessages = messages.slice(-6);
    
    let context = 'Previous conversation:\n';
    recentMessages.forEach(msg => {
      const role = msg.is_user_message ? 'User' : 'You';
      context += `\n${role}: ${msg.content}`;
    });

    return context;
  }

  /**
   * Update conversation title based on first message
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ title: title })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation title:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }
  }

  /**
   * Sanitize AI response to remove malformed formatting
   */
  private sanitizeResponse(text: string): string {
    // Remove broken markdown syntax
    text = text.replace(/\*\*\s*\{/g, ''); // Remove ** {
    text = text.replace(/\}\s*\*\*/g, ''); // Remove } **
    text = text.replace(/\*\*\s*\(/g, ''); // Remove ** (
    text = text.replace(/\)\s*\*\*/g, ''); // Remove ) **
    text = text.replace(/\*\*\s*\[/g, ''); // Remove ** [
    text = text.replace(/\]\s*\*\*/g, ''); // Remove ] **
    
    // Clean up stray markdown characters
    text = text.replace(/\*\*\*+/g, ''); // Remove multiple asterisks
    text = text.replace(/___+/g, ''); // Remove multiple underscores
    text = text.replace(/\{\{/g, ''); // Remove double braces
    text = text.replace(/\}\}/g, ''); // Remove double braces
    
    // Clean up orphaned brackets and parentheses
    text = text.replace(/\{\s*\*\*/g, ''); // Remove { **
    text = text.replace(/\*\*\s*\}/g, ''); // Remove ** }
    
    // Remove any remaining lone special characters at line ends
    text = text.replace(/\s+[{\[\(]\s*$/gm, ''); // Remove trailing brackets
    text = text.replace(/^\s*[}\]\)]/gm, ''); // Remove leading brackets
    
    // Clean up excessive whitespace
    text = text.replace(/\n{3,}/g, '\n\n'); // Max 2 line breaks
    text = text.replace(/[ \t]+/g, ' '); // Single spaces
    
    // Trim each line
    text = text.split('\n').map(line => line.trim()).join('\n');
    
    return text.trim();
  }

  /**
   * Generate a conversation title from the first user message
   */
  generateConversationTitle(firstMessage: string): string {
    // Take first 50 characters or first sentence
    let title = firstMessage.substring(0, 50);
    const firstSentence = firstMessage.match(/^[^.!?]+[.!?]/);
    
    if (firstSentence && firstSentence[0].length < 60) {
      title = firstSentence[0];
    }
    
    if (title.length < firstMessage.length) {
      title += '...';
    }
    
    return title;
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_archived: true })
        .eq('id', conversationId);

      if (error) {
        console.error('Error archiving conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return false;
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Messages will be deleted automatically due to CASCADE
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Get user's recent skin/hair analysis for context
   */
  async getUserAnalysisContext(userId: string): Promise<any> {
    try {
      // Get most recent skin analysis
      const { data: skinAnalysis } = await supabase
        .from('skin_analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get most recent hair analysis
      const { data: hairAnalysis } = await supabase
        .from('hair_analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return {
        skinAnalysis,
        hairAnalysis
      };
    } catch (error) {
      console.error('Error fetching analysis context:', error);
      return null;
    }
  }
}

// Export singleton instance
export const karmaAI = new KarmaAIService();


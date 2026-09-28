/**
 * REST API Service
 * Handles communication with backend REST endpoints.
 */

const API_BASE = '/api';

/**
 * Fetch chat history from the backend REST API
 */
export async function fetchMessages(limit = 100) {
  try {
    const res = await fetch(`${API_BASE}/messages?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch messages: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('[API] Error in fetchMessages:', err);
    throw err;
  }
}

/**
 * Send a message via backend REST API
 */
export async function sendMessageApi({ sender, text }) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sender, text })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('[API] Error in sendMessageApi:', err);
    throw err;
  }
}

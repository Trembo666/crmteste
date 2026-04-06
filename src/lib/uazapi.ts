import axios from "axios";

/**
 * UazAPI Service Configuration
 * Based on docs.uazapi.com
 */
const getApi = (subdomain: string = "app", token?: string, adminToken?: string) => {
  return axios.create({
    baseURL: `https://${subdomain}.uazapi.com`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "token": token }),
      ...(adminToken && { "admintoken": adminToken }),
    }
  });
};

export const uazapi = {
  /**
   * Create a new instance (Requires Admin Token)
   */
  async createInstance(name: string, adminToken: string, subdomain: string = "app") {
    try {
      const api = getApi(subdomain, undefined, adminToken);
      const response = await api.post("/instance/create", { name });
      return response.data;
    } catch (error) {
      console.error("Error creating instance:", error);
      throw error;
    }
  },

  /**
   * Get QR Code for an instance (Requires Instance Token)
   */
  async connectInstance(token: string, subdomain: string = "app") {
    try {
      const api = getApi(subdomain, token);
      const response = await api.post("/instance/connect");
      return response.data; // Retorna base64 do QR code
    } catch (error) {
      console.error("Error connecting instance:", error);
      throw error;
    }
  },

  /**
   * Logout from instance
   */
  async logoutInstance(token: string, subdomain: string = "app") {
    try {
      const api = getApi(subdomain, token);
      const response = await api.post("/instance/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out instance:", error);
      throw error;
    }
  },

  /**
   * Send text message
   */
  async sendText(token: string, jid: string, body: string, subdomain: string = "app") {
    try {
      const api = getApi(subdomain, token);
      const response = await api.post("/message/text", {
        jid, // Ex: 5511999999999@s.whatsapp.net
        body
      });
      return response.data;
    } catch (error) {
      console.error("Error sending text message:", error);
      throw error;
    }
  },

  /**
   * Get instance status
   */
  async getStatus(token: string, subdomain: string = "app") {
    try {
      const api = getApi(subdomain, token);
      const response = await api.get("/instance/status");
      return response.data;
    } catch (error) {
      console.error("Error getting status:", error);
      throw error;
    }
  }
};


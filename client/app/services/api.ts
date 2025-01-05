import axios from "axios";

axios.defaults.withCredentials = true;
const BASE_URL = "https://friend-management.onrender.com/api/v1"

// Helper function to extract and format error messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleApiError = (error?: any, defaultMessage?: string) => {
  console.error(defaultMessage, error?.response?.data || error.message || "Error occured");
  throw new Error(error?.response?.data?.message || defaultMessage);
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, {
      email,
      password,
      name,
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to register user");
  }
};

// Login a user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email,
      password,
    });
    return response.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to log in user");
  }
};

// Send a friend request
export const sendFriendRequest = async (receiverId: string) => {

  try {
    const response = await axios.post(
      `${BASE_URL}/friend/request`,
      { receiverId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to send friend request");
  }
};

// Get the list of friends
export const getFriendsList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/friend/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to fetch friends list");
  }
};

// Manage a friend request (accept/reject)
export const manageFriendRequest = async (
  requestId: string,
  action: "accepted" | "rejected"
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/friend/manage`,
      { requestId, action },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, `Failed to ${action} friend request`);
  }
};

// Get friend recommendations
export const getFriendRecommendations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/friend/recommend`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to fetch friend recommendations");
  }
};

// Get random users for exploration
export const getRandomUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/friend/random`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch random users");
  }
};

// Search for users by name
export const searchUsers = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/friend/search`, {
      params: { query },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    handleApiError(error, "Failed to search users");
  }
};


// 
export const getRequests = async () =>{
  try {
    const response = await axios.get(`${BASE_URL}/friend/requests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, "Failed to fetch friend requests");
  }
}
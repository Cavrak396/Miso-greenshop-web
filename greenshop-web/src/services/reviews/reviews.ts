import axios, { AxiosError } from "axios";
import { ReviewDto } from "./reviewsTypes";
import { BASE_URL } from "../reusable/baseUrl";
import { ApiError } from "../reusable/reusableTypes";

const APPLICATION_KEY = import.meta.env.VITE_APPLICATION_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ApplicationKey: APPLICATION_KEY,
  },
  withCredentials: true,
});

const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    console.error("API Error Response:", error.response.data);
    return error.response.data as ApiError;
  } else if (error.request) {
    console.error("No response received:", error.request);
    return { message: "No response from the server" } as ApiError;
  } else {
    console.error("Unexpected Error:", error.message);
    return { message: error.message } as ApiError;
  }
};

export const getPlantReviews = async (
  plantId: string,
  page = 1,
  pageSize = 3
): Promise<ReviewDto[]> => {
  if (!plantId) {
    throw new Error("plantId is required");
  }

  try {
    const response = await axiosInstance.get<ReviewDto[]>(`/reviews/${plantId}`, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error as AxiosError);
    if (apiError.message.includes("Plant not found")) {
      throw new Error("Plant not found");
    }
    if (apiError.message.includes("Unauthorized")) {
      throw new Error("Unauthorized: You need to be logged in to view user reviews");
    }
    return [];
  }
};

export const createReview = async (reviewDto: ReviewDto): Promise<ReviewDto> => {
  try {
    const response = await axiosInstance.post<ReviewDto>("/reviews", reviewDto);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

export const getUserReview = async (plantId: string): Promise<ReviewDto | null> => {
  try {
    const response = await axiosInstance.get<ReviewDto>(`/reviews/${plantId}/user`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateReview = async (plantId: string, reviewDto: ReviewDto): Promise<void> => {
  try {
    await axiosInstance.put(`/reviews/${plantId}`, reviewDto);
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

export const deleteReview = async (plantId: string): Promise<ReviewDto | null> => {
  try {
    const response = await axiosInstance.delete<ReviewDto>(`/reviews/${plantId}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    return null;
  }
};

export const getTotalNumberOfReviews = async (plantId: string): Promise<number | null> => {
  try {
    const response = await axiosInstance.get<number>(`/reviews/${plantId}/total-number`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    return null;
  }
};

export const getRatingNumbers = async (plantId: string): Promise<{ [key: string]: number } | null> => {
  try {
    const response = await axiosInstance.get<{ [key: string]: number }>(`/reviews/${plantId}/rating-number`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error as AxiosError);
    if (apiError.message.includes("Plant not found")) {
      throw new Error("Plant not found");
    }
    return null;
  }
};

export default axiosInstance;

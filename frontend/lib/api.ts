import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';
import type {
  Habit,
  CreateHabitDto,
  UpdateHabitDto,
  UserProfile,
  CheckInTodayResponse,
  GetHabitsParams,
  SuccessResponse,
} from '@habit/shared';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.jwt) {
      config.headers.Authorization = `Bearer ${session.user.jwt}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to extract error messages from backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  },
);

// API functions
export const apiClient = {
  // Users
  async getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/users/me');
    return data;
  },

  // Habits
  async getHabits(params?: GetHabitsParams): Promise<Habit[]> {
    const { data } = await api.get<Habit[]>('/habits', { params });
    return data;
  },

  async createHabit(dto: CreateHabitDto): Promise<Habit> {
    const { data } = await api.post<Habit>('/habits', dto);
    return data;
  },

  async getHabit(id: string): Promise<Habit> {
    const { data } = await api.get<Habit>(`/habits/${id}`);
    return data;
  },

  async updateHabit(id: string, dto: UpdateHabitDto): Promise<Habit> {
    const { data } = await api.patch<Habit>(`/habits/${id}`, dto);
    return data;
  },

  async deleteHabit(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/habits/${id}`);
    return data;
  },

  // Check-ins
  async checkInToday(habitId: string): Promise<CheckInTodayResponse> {
    const { data } = await api.post<CheckInTodayResponse>(
      `/habits/${habitId}/checkins/today`,
    );
    return data;
  },

  async undoCheckInToday(habitId: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(
      `/habits/${habitId}/checkins/today`,
    );
    return data;
  },
};

export default api;

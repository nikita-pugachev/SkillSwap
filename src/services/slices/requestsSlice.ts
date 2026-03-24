import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export type SkillRequest = {
  id: string;
  skillId: string;
  fromUserId: string;
  toUserId: string;
  status: RequestStatus;
  createdAt: string;
};

type RequestsState = {
  requests: SkillRequest[];
};

const REQUESTS_STORAGE_KEY = 'skillswap_requests';

// Загрузка из localStorage
const loadFromStorage = (): SkillRequest[] => {
  try {
    const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load requests from localStorage', e);
    return [];
  }
};

// Сохранение в localStorage
const saveToStorage = (requests: SkillRequest[]) => {
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save requests to localStorage', e);
  }
};

const initialState: RequestsState = {
  requests: loadFromStorage(),
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    createRequest: (
      state,
      action: PayloadAction<Omit<SkillRequest, 'id' | 'status' | 'createdAt'>>
    ) => {
      const newRequest: SkillRequest = {
        ...action.payload,
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      state.requests.push(newRequest);
      saveToStorage(state.requests);
    },

    acceptRequest: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((r) => r.id === action.payload);
      if (request) {
        request.status = 'accepted';
        saveToStorage(state.requests);
      }
    },

    rejectRequest: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((r) => r.id === action.payload);
      if (request) {
        request.status = 'rejected';
        saveToStorage(state.requests);
      }
    },

    completeRequest: (state, action: PayloadAction<string>) => {
      const request = state.requests.find((r) => r.id === action.payload);
      if (request) {
        request.status = 'done';
        saveToStorage(state.requests);
      }
    },
  },
});

export const { createRequest, acceptRequest, rejectRequest, completeRequest } =
  requestsSlice.actions;
export default requestsSlice.reducer;

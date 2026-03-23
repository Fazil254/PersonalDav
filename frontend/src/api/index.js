import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token from memory
let accessToken = null

export const setAccessToken = (token) => { accessToken = token }
export const clearAccessToken = () => { accessToken = null }
export const getAccessToken = () => accessToken

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
        setAccessToken(data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        clearAccessToken()
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login:    (data) => api.post('/auth/login/', data),
  logout:   (data) => api.post('/auth/logout/', data),
  me:       ()     => api.get('/auth/me/'),
  updateMe: (data) => api.patch('/auth/me/', data),
  profile:  ()     => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => api.post('/auth/change-password/', data),
  adminUsers: (params) => api.get('/auth/admin/users/', { params }),
  adminToggleUser: (id, data) => api.patch(`/auth/admin/users/${id}/`, data),
}

// Goals endpoints
export const goalsAPI = {
  list:    (params) => api.get('/goals/', { params }),
  create:  (data)   => api.post('/goals/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  get:     (id)     => api.get(`/goals/${id}/`),
  update:  (id, data) => api.patch(`/goals/${id}/`, data),
  delete:  (id)     => api.delete(`/goals/${id}/`),
  exportPDF: ()     => api.get('/goals/export/pdf/', { responseType: 'blob' }),
  categories: ()    => api.get('/goals/categories/'),
  createCategory: (data) => api.post('/goals/categories/', data),
  milestones: (goalId) => api.get(`/goals/${goalId}/milestones/`),
  createMilestone: (goalId, data) => api.post(`/goals/${goalId}/milestones/`, data),
  updateMilestone: (id, data) => api.patch(`/goals/milestones/${id}/`, data),
  deleteMilestone: (id) => api.delete(`/goals/milestones/${id}/`),
  notes: (goalId)   => api.get(`/goals/${goalId}/notes/`),
  addNote: (goalId, data) => api.post(`/goals/${goalId}/notes/`, data),
  adminAll: (params) => api.get('/goals/admin/all/', { params }),
}

// Habits endpoints
export const habitsAPI = {
  list:    (params) => api.get('/habits/', { params }),
  create:  (data)   => api.post('/habits/', data),
  get:     (id)     => api.get(`/habits/${id}/`),
  update:  (id, data) => api.patch(`/habits/${id}/`, data),
  delete:  (id)     => api.delete(`/habits/${id}/`),
  log:     (id, data) => api.post(`/habits/${id}/log/`, data),
  weeklyStats: () => api.get('/habits/stats/weekly/'),
  adminAll: ()    => api.get('/habits/admin/all/'),
}

// Journal endpoints
export const journalAPI = {
  list:    (params) => api.get('/journal/', { params }),
  create:  (data)   => api.post('/journal/', data),
  get:     (id)     => api.get(`/journal/${id}/`),
  update:  (id, data) => api.patch(`/journal/${id}/`, data),
  delete:  (id)     => api.delete(`/journal/${id}/`),
  tags:    ()       => api.get('/journal/tags/'),
  createTag: (data) => api.post('/journal/tags/', data),
  moodStats: ()     => api.get('/journal/stats/mood/'),
}

// Dashboard
export const dashboardAPI = {
  user:  () => api.get('/dashboard/'),
  admin: () => api.get('/dashboard/admin/'),
}

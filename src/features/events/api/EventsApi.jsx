import { request } from "../../../shared/api/axios";

export const getEvent = async (id) => {
  const response = await request.get(`/main/events/${id}`);
  return response.data;
};

export const createEvent = async (eventDto) => {
  const response = await request.post(`/main/events`, eventDto);
  return response.data;
};

export const updateEvent = async (id, eventDto) => {
  const response = await request.put(`/main/events/${id}`, eventDto);
  return response.data;
};

export const deleteEvent = (id) =>
  request.delete(`/main/events/${id}`).then((res) => res.data);

export const addParticipant = (eventId, login) =>
  request.post('/main/participants', { eventId, login }, { withCredentials: true })
    .then(res => res.data);

export const removeParticipant = (eventId, login) =>
  request.delete(`/main/participants/${eventId}/${login}`, { withCredentials: true })
    .then(res => res.data);



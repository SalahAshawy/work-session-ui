// utils/localStorage.ts
export const saveSessionTimer = (id: string, data: any) => {
  localStorage.setItem(`session-timer-${id}`, JSON.stringify(data));
};

export const loadSessionTimer = (id: string) => {
  const data = localStorage.getItem(`session-timer-${id}`);
  return data ? JSON.parse(data) : null;
};

export const clearSessionTimer = (id: string) => {
  localStorage.removeItem(`session-timer-${id}`);
};

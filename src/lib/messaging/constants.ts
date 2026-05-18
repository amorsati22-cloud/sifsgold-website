/** Max single file upload (bytes) */
export const MESSAGE_FILE_MAX_BYTES = 10 * 1024 * 1024;

/** Max total file bytes per thread per calendar day (UTC) */
export const MESSAGE_THREAD_DAILY_MAX_BYTES = 100 * 1024 * 1024;

/** Max voice note length (seconds) */
export const VOICE_NOTE_MAX_SECONDS = 5 * 60;

export const MESSAGE_VOICE_BUCKET = "message-voice";
export const MESSAGE_FILES_BUCKET = "message-files";

export const POLL_EXPIRY_HOURS: Record<string, number | null> = {
  "1h": 1,
  "24h": 24,
  "7d": 24 * 7,
  never: null,
};

export const GROUP_PURPOSES = [
  { value: "team", label: "Team" },
  { value: "class", label: "Class" },
  { value: "event_planning", label: "Event planning" },
  { value: "client_consult_group", label: "Client consult group" },
] as const;

export const CREATED_BY_ROLES = [
  { value: "pro", label: "Pro" },
  { value: "salon", label: "Salon" },
  { value: "school", label: "School" },
  { value: "admin", label: "Admin" },
] as const;

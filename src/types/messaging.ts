export type ThreadType = "dm" | "group" | "appointment";

export type MessageType = "text" | "voice_note" | "file" | "poll" | "system";

export type GroupPurpose = "team" | "class" | "event_planning" | "client_consult_group";

export type CreatedByRole = "pro" | "salon" | "school" | "admin";

export type BubbleStyle = "gold" | "minimal" | "navy";

export type GroupSettings = {
  who_can_add?: "all" | "admins";
  who_can_post?: "all" | "admins";
};

export type ThreadParticipant = {
  thread_id: string;
  user_id: string;
  joined_at: string;
  role: "member" | "admin";
  muted: boolean;
  last_read_at: string | null;
  bubble_style: BubbleStyle;
  profile?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    email?: string | null;
  };
};

export type Thread = {
  id: string;
  created_at: string;
  last_message_at: string | null;
  thread_type: ThreadType;
  linked_appointment_id: string | null;
  title: string | null;
  avatar_url: string | null;
  created_by: string | null;
  encrypted_last_preview: string | null;
  preview_iv: string | null;
  max_participants?: number;
  created_by_role?: CreatedByRole | null;
  group_purpose?: GroupPurpose | null;
  group_key_version?: number;
  group_settings?: GroupSettings;
  participants?: ThreadParticipant[];
  unread_count?: number;
};

export type FileMetadata = {
  name: string;
  size: number;
  mime_type: string;
  storage_path?: string;
};

export type PollData = {
  question: string;
  options: string[];
  multi_select: boolean;
  expires_at: string | null;
  allow_edit_vote?: boolean;
};

export type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  created_at: string;
  encrypted_body: string;
  iv: string;
  encrypted_attachments: string | null;
  attachments_iv: string | null;
  reply_to_message_id: string | null;
  edited: boolean;
  edited_at: string | null;
  deleted: boolean;
  delivered_to: string[];
  read_by: string[];
  message_type?: MessageType;
  voice_note_duration_seconds?: number | null;
  voice_note_waveform?: number[] | null;
  file_metadata?: FileMetadata | null;
  poll_data?: PollData | null;
  scheduled_for?: string | null;
  delivered?: boolean;
  reactions?: MessageReaction[];
  plaintext?: string;
  attachments?: string[];
  poll_tally?: Record<string, number>;
  poll_my_vote?: string[];
};

export type MessageReaction = {
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
};

export type ContactOption = {
  user_id: string;
  display_name: string;
  subtitle: string | null;
  avatar_url: string | null;
};

export type ThreadAnnouncement = {
  id: string;
  thread_id: string;
  title: string;
  content: string;
  expires_at: string | null;
  created_at: string;
};

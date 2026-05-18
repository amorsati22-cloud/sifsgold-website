export type ThreadType = "dm" | "group" | "appointment";

export type BubbleStyle = "gold" | "minimal" | "navy";

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
  participants?: ThreadParticipant[];
  unread_count?: number;
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
  reactions?: MessageReaction[];
  plaintext?: string;
  attachments?: string[];
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

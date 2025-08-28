export interface ChatRequest {
  thread_id: string;
  text: string;
  tech_id: string;
  property_id: string;
}

export interface ActionData {
  unit: string | null;
  summary: string | null;
  part: string | null;
  priority: 'low' | 'normal' | 'high' | null;
}

export interface Action {
  type: 'none' | 'create_work_order' | 'need_part' | 'schedule_vendor';
  data: ActionData;
}

export interface Fact {
  id?: number;
  property_id: string;
  unit: string | null;
  category: string;
  summary: string;
  embedding?: number[];
  score?: number;
}

export interface ChatResponse {
  assistant_reply: string;
  action: Action;
  facts_added: Fact[];
}

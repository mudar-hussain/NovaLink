import { Timestamp } from "firebase/firestore";

export interface UrlData {
    long_url: string,
    short_id: string | null,
    short_url: string,
    active: boolean,
    email: string | null,
    notes: string | null,
    expire_at_datetime: Timestamp | null,
    created_at: Timestamp,
    updated_at: Timestamp,
    id: string | null
}
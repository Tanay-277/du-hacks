export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    created_at: string;
                    updated_at: string;
                    // Add other profile fields as needed
                };
                Insert: {
                    id: string;
                    email: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    updated_at?: string;
                };
            };
            // Add other tables as needed
        };
    };
};

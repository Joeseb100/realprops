import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload a file buffer to Supabase Storage and return the public URL.
 */
export async function uploadImage(
    buffer: Buffer,
    filename: string,
    contentType: string
): Promise<string> {
    const path = `properties/${Date.now()}-${filename}`;

    const { error } = await supabase.storage
        .from("property-images")
        .upload(path, buffer, {
            contentType,
            upsert: false,
        });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(path);

    return data.publicUrl;
}

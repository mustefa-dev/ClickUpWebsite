// src/website/src/utils/uploadMedia.ts
import { Api } from "@/Api";

const uploadMedia = async (file: File): Promise<string[]> => {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const { data } = await Api.post<string[]>('media', formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });

    return data;
};

export default uploadMedia;
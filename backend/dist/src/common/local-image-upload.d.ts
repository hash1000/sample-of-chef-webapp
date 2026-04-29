export declare function ensureUploadsDir(): string;
export declare function localImageUploadOptions(folder: string): {
    storage: any;
    fileFilter: (_req: any, file: any, callback: (error: Error | null, acceptFile: boolean) => void) => void;
    limits: {
        fileSize: number;
    };
};

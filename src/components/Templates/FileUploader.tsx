// import { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { X } from 'lucide-react';
// import { uploadToS3 } from '@/lib/s3Upload';
// import { Button } from '@/components/atoms/Button';
// import { toast } from 'sonner';

// export interface FileObject {
//     file: File;
//     title: string;
//     preview: string;    
//     type: string;
//     s3Url?: string;
// }

// export interface FileUploaderProps {
//     files: FileObject[];
//     setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
//     maxFileLimit?: number;
//     acceptedFileTypes?: Record<string, string[]>;
//     maxFileSize?: number;
//     s3Prefix?: string;
//     showPreview?: boolean;
//     previewSize?: number;
//     showInfo?: () => void;
//     label?: string;
//     placeholderText?: string;
//     noFilesText?: string;
//     dropzoneHeight?: string;
//     dropzoneBorder?: string;
//     dropzonePadding?: string;
//     hideSelectedFilesSection?: boolean;
// }

// export const FileUploader: React.FC<FileUploaderProps> = ({
//     files,
//     setFiles,
//     maxFileLimit = 2,
//     acceptedFileTypes = {
//         "image/jpeg": [".jpeg"],
//         "image/png": [".png"],
//         "image/jpg": [".jpg"],
//         "application/pdf": [".pdf"]
//     },
//     maxFileSize = 5 * 1024 * 1024,
//     s3Prefix = 'uploads',
//     showPreview = true,
//     previewSize = 12,
//     showInfo,
//     label = "Drag & drop files here, or click to select files",
//     placeholderText = "Uploading files...",
//     noFilesText = "No files selected.",
//     dropzoneHeight = "h-28",
//     dropzoneBorder = "border border-gray-600",
//     dropzonePadding = "p-4",
//     hideSelectedFilesSection = false,
// }) => {
//     const [uploading, setUploading] = useState(false);

//     const { getRootProps, getInputProps } = useDropzone({
//         accept: acceptedFileTypes,
//         maxFiles: maxFileLimit,
//         maxSize: maxFileSize,
//         onDrop: async (acceptedFiles) => {
//             if (acceptedFiles.length + files.length > maxFileLimit) {
//                 toast.error(`Maximum ${maxFileLimit} files allowed`);
//                 return;
//             }

//             setUploading(true);

//             try {
//                 type UploadResult = {
//                     success: true;
//                     data: FileObject;
//                 } | {
//                     success: false;
//                     error: unknown;
//                     fileName: string;
//                 };

//                 const uploadPromises = acceptedFiles.map(async (file, index): Promise<UploadResult> => {
//                     try {
                       
//                         const preview = URL.createObjectURL(file);

//                         const s3Url = await uploadToS3WithRetry(file, {
//                             prefix: s3Prefix
//                         });

//                         return {
//                             success: true,
//                             data: {
//                                 file,
//                                 title: file.name,
//                                 preview,
//                                 type: file.type,
//                                 s3Url
//                             }
//                         };
//                     } catch (error) {
//                         console.error(`Failed to upload file ${index + 1}:`, file.name, error);
                       
//                         const preview = URL.createObjectURL(file);
//                         URL.revokeObjectURL(preview);
                       
//                         return {
//                             success: false,
//                             error: error,
//                             fileName: file.name
//                         };
//                     }
//                 });

//                 const results = await Promise.allSettled(uploadPromises);
               
//                 const successfulUploads: FileObject[] = [];
//                 const failedUploads: { fileName: string; error: any }[] = [];

//                 results.forEach((result, index) => {
//                     if (result.status === 'fulfilled') {
//                         const uploadResult = result.value;
//                         if (uploadResult.success) {
//                             successfulUploads.push(uploadResult.data);
//                         } else {
//                             failedUploads.push({
//                                 fileName: uploadResult.fileName,
//                                 error: uploadResult.error
//                             });
//                         }
//                     } else {
//                         failedUploads.push({
//                             fileName: acceptedFiles[index]?.name ?? `File ${index + 1}`,
//                             error: result.reason
//                         });
//                     }
//                 });

//                 if (successfulUploads.length > 0) {
//                     setFiles(prev => [...prev, ...successfulUploads]);
//                 }

//                 if (successfulUploads.length > 0 && failedUploads.length === 0) {
//                     toast({
//                         title: "Success",
//                         description: `${successfulUploads.length} file(s) uploaded successfully.`,
//                     });
//                 } else if (successfulUploads.length > 0 && failedUploads.length > 0) {
//                     toast({
//                         title: "Partial Success",
//                         description: `${successfulUploads.length} file(s) uploaded successfully. ${failedUploads.length} file(s) failed.`,
//                         variant: "destructive"
//                     });
                   
//                     console.error("Failed uploads:", failedUploads);
//                 } else {
//                     toast({
//                         title: "Upload failed",
//                         description: `All ${failedUploads.length} file(s) failed to upload.`,
//                         variant: "destructive"
//                     });
                   
//                     console.error("All uploads failed:", failedUploads);
//                 }

//             } catch (error) {
//                 console.error("Unexpected error during upload process:", error);
//                 toast({
//                     title: "Upload failed",
//                     description: "An unexpected error occurred during file upload.",
//                     variant: "destructive"
//                 });
//             } finally {
//                 setUploading(false);
//             }
//         }
//     });

//     const uploadToS3WithRetry = async (file: File, options: any, maxRetries = 3): Promise<string> => {
//         for (let attempt = 1; attempt <= maxRetries; attempt++) {
//             try {
               
//                 const uploadPromise = uploadToS3(file, options);
//                 const timeoutPromise = new Promise((_, reject) =>
//                     setTimeout(() => reject(new Error('Upload timeout')), 30000)
//                 );
               
//                 const result = await Promise.race([uploadPromise, timeoutPromise]) as string;
               
//                 if (!result || typeof result !== 'string') {
//                     throw new Error('Invalid S3 URL returned');
//                 }
               
//                 return result;
//             } catch (error) {
//                 console.error(`Upload attempt ${attempt} failed for file ${file.name}:`, error);
               
//                 if (attempt === maxRetries) {
//                     throw new Error(`Failed to upload ${file.name} after ${maxRetries} attempts: ${error}`);
//                 }
               
//                 await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
//             }
//         }
       
//         throw new Error('Upload failed after all retries');
//     };

//     const handleRemoveFile = (index: number) => {
//         setFiles(files => {
//             const newFiles = [...files];
//             URL.revokeObjectURL(newFiles[index].preview);
//             newFiles.splice(index, 1);
//             return newFiles;
//         });
//     };

//     return (
//         <div className="space-y-4">
//             <div
//                 {...getRootProps()}
//                 className={`${dropzoneBorder} ${dropzoneHeight} ${dropzonePadding} rounded-md cursor-pointer flex items-center justify-center hover:bg-accent/50 transition-colors`}
//             >
//                 <input {...getInputProps()} />
//                 {uploading ? (
//                     <p className="text-center text-gray-500">{placeholderText}</p>
//                 ) : (
//                     <p className="text-center text-gray-500">{label}</p>
//                 )}
//             </div>

//             {!hideSelectedFilesSection && (
//                 <div className="mt-4">
//                     <div className="flex items-center gap-2">
//                         <h4 className="font-medium">Selected Files:</h4>
//                         {files.length === 0 && (
//                             <p className="text-sm text-gray-500">{noFilesText}</p>
//                         )}
//                     </div>

//                     {files.length > 0 && (
//                         <ul className="mt-2 flex flex-wrap gap-3">
//                             {files.map((fileObj, index) => (
//                                 <li key={index} className="flex items-center gap-1 p-2 border rounded-md">
//                                     <div className="flex items-center gap-2">
//                                         {showPreview && fileObj.preview && fileObj.type && fileObj.type.startsWith("image") ? (
//                                             <img
//                                                 src={fileObj.preview}
//                                                 alt={fileObj.title}
//                                                 className={`w-${previewSize} h-${previewSize} object-contain`}
//                                             />
//                                         ) : (
//                                             <div className={`w-${previewSize} h-${previewSize} bg-gray-100 flex items-center justify-center rounded`}>
//                                                 <span className="text-xs">{fileObj.file?.name.split('.').pop()}</span>
//                                             </div>
//                                         )}
//                                         <span className="text-sm overflow-hidden text-ellipsis max-w-40">{fileObj.title}</span>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         className="text-red-500 ml-2"
//                                         onClick={() => handleRemoveFile(index)}
//                                         aria-label="Remove file"
//                                     >
//                                         <X className="w-5 h-5" />
//                                     </Button>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}

//                     {showInfo && (
//                         <p
//                             className="flex items-center gap-1 text-sm text-accent dark:text-accent cursor-pointer hover:underline mt-2"
//                             onClick={showInfo}
//                         >
//                             File upload rules
//                         </p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

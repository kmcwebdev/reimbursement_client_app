import { type AttachedFile } from "~/app/components/shared/reimburse-form/steps/AddAttachments";

export const isDuplicateFile = (existingFiles: AttachedFile[], file: File) => {
  const isDuplicate = existingFiles.find(
    (existingFile) =>
      existingFile.file.name === file.name &&
      existingFile.file.lastModified === file.lastModified &&
      existingFile.file.size === file.size &&
      existingFile.file.type === file.type,
  );

  return isDuplicate;
};

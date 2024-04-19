import { type AttachedFile } from "~/app/components/shared/reimburse-form/steps/AddAttachments";

export const isDuplicateFile = (existingFiles: AttachedFile[], file: File) => {
  const isDuplicate = existingFiles.find(
    (existingFile) =>
      existingFile.fileName.replaceAll(/\s/g, "") ===
        file.name.replaceAll(/\s/g, "") &&
      existingFile.file.lastModified === file.lastModified &&
      existingFile.file.size === file.size &&
      existingFile.file.type === file.type,
  );

  return isDuplicate;
};

'use client';

import { useCallback, useRef, useState } from 'react';
import ClientIcon from '../ClientIcon';

export default function FileDropzone({
  label,
  description,
  accept,
  multiple = false,
  onFilesChange,
  helperText,
  className = ''
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = useCallback(
    (fileList) => {
      const nextFiles = Array.from(fileList || []);
      setFiles(nextFiles);
      onFilesChange?.(nextFiles);
    },
    [onFilesChange]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer?.files?.length) {
        handleFiles(event.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (event) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((index) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onFilesChange?.(next);
      return next;
    });
  }, [onFilesChange]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-800">{label}</label>
          {helperText && <span className="text-xs text-neutral-500">{helperText}</span>}
        </div>
      )}

      {description && (
        <p className="text-sm text-neutral-500">{description}</p>
      )}

      <div
        className="relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-6 py-10 text-center transition hover:border-primary-400 hover:bg-primary-50/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        }}
      >
        <ClientIcon name="UploadCloud" className="h-8 w-8 text-primary-500" />
        <p className="mt-4 text-sm font-medium text-neutral-700">
          Glissez-déposez vos fichiers ici ou <span className="text-primary-600">cliquez pour parcourir</span>
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          {multiple ? 'Formats JPG, PNG ou PDF. Taille max : 10 Mo par fichier.' : 'Un fichier au format JPG, PNG ou PDF. Taille max : 10 Mo.'}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />
      </div>

      {!!files.length && (
        <ul className="space-y-2 rounded-xl border border-neutral-200 bg-white/80 p-4">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
            >
              <div className="flex items-center gap-3">
                <ClientIcon name="File" className="h-4 w-4 text-primary-500" />
                <span className="truncate font-medium">{file.name}</span>
                <span className="text-xs text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} Mo</span>
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
                aria-label={`Retirer ${file.name}`}
              >
                <ClientIcon name="X" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

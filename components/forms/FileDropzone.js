'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ClientIcon from '../ClientIcon';

const isFileInstance = (candidate) =>
  typeof File !== 'undefined' && candidate instanceof File;

const parseAcceptString = (accept = '') =>
  accept
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const getFileExtension = (file) => {
  if (!file?.name) {
    return '';
  }

  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

const isAcceptedType = (file, acceptedTypes) => {
  if (!Array.isArray(acceptedTypes) || acceptedTypes.length === 0) {
    return true;
  }

  return acceptedTypes.some((type) => {
    if (type.startsWith('.')) {
      return `.${getFileExtension(file)}` === type.toLowerCase();
    }

    if (type.endsWith('/*')) {
      const group = type.split('/')[0];
      return file.type?.startsWith(`${group}/`);
    }

    return file.type === type;
  });
};

const createPreviewItems = (files = []) => {
  if (!Array.isArray(files)) {
    return [];
  }

  return files.map((file, index) => {
    const isImagePreview =
      isFileInstance(file) && file.type?.startsWith('image/');

    return {
      file,
      key: `${file?.name ?? 'file'}-${index}-${file?.lastModified ?? 'static'}`,
      previewUrl: isImagePreview ? URL.createObjectURL(file) : null
    };
  });
};

const formatLimitMessage = (maxFileSize) => {
  if (!maxFileSize) {
    return '';
  }

  const megabytes = (maxFileSize / 1024 / 1024).toFixed(0);
  return ` (${megabytes} Mo)`;
};

export default function FileDropzone({
  label,
  description,
  accept,
  multiple = false,
  onFilesChange,
  helperText,
  className = '',
  value = [],
  maxFileSize,
  error,
  onError
}) {
  const inputRef = useRef(null);
  const acceptedTypes = useMemo(() => parseAcceptString(accept), [accept]);
  const [fileItems, setFileItems] = useState(() => createPreviewItems(value));
  const [localError, setLocalError] = useState('');

  const displayError = useCallback(
    (message) => {
      setLocalError(message);
      onError?.(message);
    },
    [onError]
  );

  useEffect(() => {
    setFileItems((previousItems) => {
      previousItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      return createPreviewItems(value);
    });
  }, [value]);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.dataTransfer?.files?.length) {
        const files = event.dataTransfer.files;
        const nextFiles = Array.from(files || []);

        let hasError = false;

        const filteredFiles = nextFiles.filter((file) => {
          if (!isAcceptedType(file, acceptedTypes)) {
            hasError = true;
            displayError("Ce type de fichier n'est pas pris en charge.");
            return false;
          }

          if (maxFileSize && file.size > maxFileSize) {
            hasError = true;
            displayError(
              `Le fichier ${file.name} dépasse la taille maximale autorisée${formatLimitMessage(maxFileSize)}.`
            );
            return false;
          }

          return true;
        });

        if (hasError && filteredFiles.length === 0) {
          return;
        }

        if (!multiple && filteredFiles.length > 1) {
          filteredFiles.splice(1);
        }

        if (!hasError) {
          displayError('');
        }
        onFilesChange?.(filteredFiles);
      }
    },
    [acceptedTypes, displayError, maxFileSize, multiple, onFilesChange]
  );

  const handleFiles = useCallback(
    (fileList) => {
      const nextFiles = Array.from(fileList || []);
      let hasError = false;

      const filteredFiles = nextFiles.filter((file) => {
        if (!isAcceptedType(file, acceptedTypes)) {
          hasError = true;
          displayError("Ce type de fichier n'est pas pris en charge.");
          return false;
        }

        if (maxFileSize && file.size > maxFileSize) {
          hasError = true;
          displayError(
            `Le fichier ${file.name} dépasse la taille maximale autorisée${formatLimitMessage(maxFileSize)}.`
          );
          return false;
        }

        return true;
      });

      if (hasError && filteredFiles.length === 0) {
        inputRef.current && (inputRef.current.value = '');
        return;
      }

      if (!multiple && filteredFiles.length > 1) {
        filteredFiles.splice(1);
      }

      if (!hasError) {
        displayError('');
      }
      onFilesChange?.(filteredFiles);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [acceptedTypes, displayError, maxFileSize, multiple, onFilesChange]
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

  const removeFile = useCallback(
    (index) => {
      const files = Array.isArray(value) ? value : [];
      const nextFiles = files.filter((_, i) => i !== index);
      displayError('');
      onFilesChange?.(nextFiles);
    },
    [displayError, onFilesChange, value]
  );

  useEffect(() => {
    return () => {
      fileItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [fileItems]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium uppercase text-neutral-800">{label}</label>
          {helperText && <span className="text-sm text-neutral-500">{helperText}</span>}
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
          {helperText ||
            (multiple
              ? 'Formats autorisés : JPG, JPEG ou WEBP. Limite totale du formulaire : 200 Mo.'
              : 'Formats autorisés : JPG, JPEG ou WEBP. Limite totale du formulaire : 200 Mo.')}
        </p>
        {(error || localError) && (
          <p className="mt-2 text-xs text-red-600">{error || localError}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />
      </div>

      {!!fileItems.length && (
        <ul className="space-y-2 rounded-xl border border-neutral-200 bg-white/80 p-4">
          {fileItems.map(({ file, previewUrl }, index) => {
            const isImage = Boolean(previewUrl);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700"
              >
                <div className="flex items-center gap-3">
                  {isImage ? (
                    <img
                      src={previewUrl}
                      alt={`Prévisualisation de ${file.name}`}
                      className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary-50">
                      <ClientIcon name="File" className="h-5 w-5 text-primary-500" />
                    </div>
                  )}
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="text-xs text-neutral-400">{(file.size / 1024 / 1024).toFixed(2)} Mo</span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="rounded-full p-1 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Retirer ${file.name}`}
                >
                  <ClientIcon name="X" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ClientIcon from "../../components/ClientIcon";
import FileDropzone from "../../components/forms/FileDropzone";

const createOwnerInitial = () => ({
  title: "",
  slug: "",
  shortDescription: "",
  longDescription: "",
  heroPhoto: [],
  gallery: [],
  portfolioGallery: [],
  amenities: {
    jacuzzi: false,
    sauna: false,
    piscine: false,
    other: [],
  },
  rooms: [
    {
      name: "",
      description: "",
      photos: [],
    },
  ],
  propertyAddress: {
    streetNumber: "",
    streetName: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "",
  },
  mainAddress: {
    streetNumber: "",
    streetName: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "",
  },
  owner: {
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",
    password: "",
  },
  identityDocument: [],
  ownershipProof: [],
});

const createTenantInitial = () => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredRegion: "",
  desiredDates: "",
  guests: "",
  budget: "",
  requirements: "",
});

const OPTIONS = [
  {
    id: "owner",
    title: "J'ai un chalet à louer à la saison",
    description:
      "Partagez les informations essentielles de votre bien pour rejoindre notre réseau et bénéficier de notre accompagnement complet.",
    icon: "Home",
  },
  {
    id: "tenant",
    title: "Je recherche une location à la saison",
    description:
      "Indiquez vos critères afin que notre équipe vous propose les chalets correspondant parfaitement à vos attentes.",
    icon: "Search",
  },
];

const CLOUDINARY_FOLDERS = {
  hero: "signup/hero",
  gallery: "signup/gallery",
  rooms: "signup/rooms",
  identity: "signup/documents/identity",
  ownership: "signup/documents/ownership",
};

const DEFAULT_AMENITIES = [
  { key: "jacuzzi", label: "Jacuzzi" },
  { key: "sauna", label: "Sauna" },
  { key: "piscine", label: "Piscine" },
];

const isFileInstance = (candidate) =>
  typeof File !== "undefined" && candidate instanceof File;

const mapUploadToMetadata = (file, upload = {}) => ({
  name: file?.name ?? "",
  size: file?.size ?? 0,
  type: file?.type ?? "",
  lastModified: file?.lastModified ?? null,
  url: upload?.secureUrl || upload?.url || "",
  secureUrl: upload?.secureUrl || "",
  publicId: upload?.publicId || "",
  assetId: upload?.assetId || "",
  resourceType: upload?.resourceType || "",
  format: upload?.format || "",
  bytes: upload?.bytes ?? file?.size ?? 0,
  width: upload?.width ?? null,
  height: upload?.height ?? null,
  folder: upload?.folder || "",
  originalFilename: upload?.originalFilename || file?.name || "",
  version: upload?.version ?? null,
});

const uploadFilesToCloudinary = async (files, folder) => {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const fileEntries = files.filter(isFileInstance);

  if (fileEntries.length === 0) {
    return [];
  }

  const formData = new FormData();
  fileEntries.forEach((file) => {
    formData.append("files", file);
  });

  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.message ||
        "Le téléversement des fichiers sur Cloudinary a échoué."
    );
  }

  const uploadedFiles = Array.isArray(payload.files) ? payload.files : [];

  return fileEntries.map((file, index) =>
    mapUploadToMetadata(file, uploadedFiles[index] || {})
  );
};

const buildOwnerPayload = async (form) => {
  const [
    heroPhoto,
    gallery,
    identityDocument,
    ownershipProof,
    roomPhotos,
  ] = await Promise.all([
    uploadFilesToCloudinary(form.heroPhoto, CLOUDINARY_FOLDERS.hero),
    uploadFilesToCloudinary(form.gallery, CLOUDINARY_FOLDERS.gallery),
    uploadFilesToCloudinary(
      form.identityDocument,
      CLOUDINARY_FOLDERS.identity
    ),
    uploadFilesToCloudinary(
      form.ownershipProof,
      CLOUDINARY_FOLDERS.ownership
    ),
    Promise.all(
      form.rooms.map((room, index) =>
        uploadFilesToCloudinary(
          room.photos,
          `${CLOUDINARY_FOLDERS.rooms}/room-${index + 1}`
        )
      )
    ),
  ]);

  const portfolioGallery = [
    ...(Array.isArray(heroPhoto) ? heroPhoto : []),
    ...(Array.isArray(gallery) ? gallery : []),
    ...roomPhotos.flatMap((photos) =>
      Array.isArray(photos) ? photos : []
    ),
  ];

  return {
    title: form.title,
    slug: form.slug,
    shortDescription: form.shortDescription,
    longDescription: form.longDescription,
    heroPhoto,
    gallery,
    portfolioGallery,
    amenities: form.amenities,
    rooms: form.rooms.map((room, index) => ({
      name: room.name,
      description: room.description,
      photos: roomPhotos[index] ?? [],
    })),
    propertyAddress: form.propertyAddress,
    mainAddress: form.mainAddress,
    owner: form.owner,
    identityDocument,
    ownershipProof,
  };
};

const serializeTenantForm = (form) => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  phone: form.phone,
  preferredRegion: form.preferredRegion,
  desiredDates: form.desiredDates,
  guests: form.guests,
  budget: form.budget,
  requirements: form.requirements,
});

export default function SignUpPage() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [ownerForm, setOwnerForm] = useState(createOwnerInitial);
  const [tenantForm, setTenantForm] = useState(createTenantInitial);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [ownerActiveModule, setOwnerActiveModule] = useState("owner-chalet");
  const [tenantActiveModule, setTenantActiveModule] =
    useState("tenant-profile");
  const [ownerSubmitting, setOwnerSubmitting] = useState(false);
  const [tenantSubmitting, setTenantSubmitting] = useState(false);
  const [ownerExpandedRooms, setOwnerExpandedRooms] = useState([true]);
  const [customAmenityInput, setCustomAmenityInput] = useState("");
  const [ownerAcceptedCGV, setOwnerAcceptedCGV] = useState(false);
  const [tenantAcceptedCGV, setTenantAcceptedCGV] = useState(false);
  const [cgvModal, setCgvModal] = useState({ open: false, type: null });
  const [successModal, setSuccessModal] = useState({
    open: false,
    type: null,
    message: "",
  });
  const CGV_URLS = {
    owner: "/cgv-proprietaires",
    tenant: "/cgv-locataires",
  };

  const openCGVModal = (type) => {
    setCgvModal({ open: true, type });
  };

  const closeCGVModal = () => {
    setCgvModal({ open: false, type: null });
  };

  const handleCGVAcceptance = () => {
    if (cgvModal.type === "owner") {
      setOwnerAcceptedCGV(true);
    } else if (cgvModal.type === "tenant") {
      setTenantAcceptedCGV(true);
    }
    resetFeedback();
    closeCGVModal();
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ open: false, type: null, message: "" });
    resetFeedback();
    setSelectedOption(null);
    setOwnerForm(createOwnerInitial());
    setTenantForm(createTenantInitial());
    setOwnerActiveModule("owner-chalet");
    setTenantActiveModule("tenant-profile");
    setOwnerExpandedRooms([true]);
    setOwnerAcceptedCGV(false);
    setTenantAcceptedCGV(false);
  };

  const ownerModuleStatus = useMemo(() => {
    const hasBaseInfo =
      ownerForm.title.trim() &&
      ownerForm.shortDescription.trim() &&
      ownerForm.longDescription.trim();
    const hasRooms =
      ownerForm.rooms.length > 0 &&
      ownerForm.rooms.every(
        (room) => room.name.trim() && room.description.trim()
      );
    const hasPropertyAddress =
      ownerForm.propertyAddress.streetNumber.trim() &&
      ownerForm.propertyAddress.streetName.trim() &&
      ownerForm.propertyAddress.city.trim() &&
      ownerForm.propertyAddress.country.trim();
    const hasOwnerInfo =
      ownerForm.owner.firstName.trim() &&
      ownerForm.owner.lastName.trim() &&
      ownerForm.owner.birthDate &&
      ownerForm.owner.email.trim() &&
      ownerForm.owner.phone.trim() &&
      ownerForm.owner.password.trim();
    const hasDocuments =
      ownerForm.identityDocument.length > 0 &&
      ownerForm.ownershipProof.length > 0;

    const hasMainAddress =
      ownerForm.mainAddress.streetNumber.trim() &&
      ownerForm.mainAddress.streetName.trim() &&
      ownerForm.mainAddress.city.trim() &&
      ownerForm.mainAddress.country.trim();

    return {
      chalet: Boolean(hasBaseInfo),
      rooms: Boolean(hasRooms),
      location: Boolean(hasPropertyAddress),
      owner: Boolean(hasOwnerInfo),
      documents: Boolean(hasDocuments),
      mainAddress: Boolean(hasMainAddress),
    };
  }, [ownerForm]);

  const tenantModuleStatus = useMemo(() => {
    const hasProfile =
      tenantForm.firstName.trim() &&
      tenantForm.lastName.trim() &&
      tenantForm.email.trim();
    const hasProject = tenantForm.preferredRegion.trim();

    return {
      profile: Boolean(hasProfile),
      project: Boolean(hasProject),
    };
  }, [tenantForm]);

  const isOwnerFormValid = useMemo(
    () => Object.values(ownerModuleStatus).every(Boolean),
    [ownerModuleStatus]
  );

  const isTenantFormValid = useMemo(
    () => tenantModuleStatus.profile && tenantModuleStatus.project,
    [tenantModuleStatus]
  );

  const resetFeedback = () => setFeedback({ type: "", message: "" });

  const handleOwnerChange = (path, value) => {
    resetFeedback();

    setOwnerForm((prev) => {
      const updated = structuredClone(prev);

      const segments = Array.isArray(path) ? path : path.split(".");
      let pointer = updated;

      segments.slice(0, -1).forEach((segment) => {
        if (typeof pointer[segment] === "undefined") {
          pointer[segment] = {};
        }
        pointer = pointer[segment];
      });

      pointer[segments.at(-1)] = value;

      if (segments[0] === "title") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]+/g, "")
          .trim()
          .replace(/\s+/g, "-");
      }

      return updated;
    });
  };

  const handleRoomChange = (index, key, value) => {
    resetFeedback();
    setOwnerForm((prev) => {
      const updated = structuredClone(prev);
      updated.rooms[index][key] = value;
      return updated;
    });
  };

  const handleRoomPhotosChange = (index, files) => {
    resetFeedback();
    setOwnerForm((prev) => {
      const updated = structuredClone(prev);
      updated.rooms[index].photos = files;
      return updated;
    });
  };

  const addRoom = () => {
    resetFeedback();
    setOwnerForm((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          name: "",
          description: "",
          photos: [],
        },
      ],
    }));
    setOwnerExpandedRooms((prev) => [...prev, true]);
  };

  const removeRoom = (index) => {
    resetFeedback();
    setOwnerForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
    setOwnerExpandedRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRoomVisibility = (index) => {
    setOwnerExpandedRooms((prev) =>
      prev.map((isOpen, currentIndex) =>
        currentIndex === index ? !isOpen : isOpen
      )
    );
  };

  const addCustomAmenity = () => {
    const value = customAmenityInput.trim();

    if (!value) {
      return;
    }

    const normalizedValue = value.toLowerCase();
    const existingCustomAmenities = ownerForm.amenities?.other ?? [];
    const hasDuplicateCustom = existingCustomAmenities.some(
      (amenity) => amenity.toLowerCase() === normalizedValue
    );
    const matchesDefaultAmenity = DEFAULT_AMENITIES.some(
      (amenity) => amenity.label.toLowerCase() === normalizedValue
    );

    if (hasDuplicateCustom || matchesDefaultAmenity) {
      setCustomAmenityInput("");
      return;
    }

    resetFeedback();

    handleOwnerChange("amenities.other", [
      ...existingCustomAmenities,
      value,
    ]);

    setCustomAmenityInput("");
  };

  const removeCustomAmenity = (index) => {
    const existingCustomAmenities = ownerForm.amenities?.other ?? [];

    if (!existingCustomAmenities.length) {
      return;
    }

    resetFeedback();

    handleOwnerChange(
      "amenities.other",
      existingCustomAmenities.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleOwnerSubmit = async (event) => {
    event.preventDefault();

    if (!isOwnerFormValid) {
      setFeedback({
        type: "error",
        message:
          "Merci de compléter les informations obligatoires avant de valider.",
      });
      return;
    }

    if (!ownerAcceptedCGV) {
      setFeedback({
        type: "error",
        message:
          "Merci de consulter et d'accepter les CGV avant de valider votre candidature.",
      });
      openCGVModal("owner");
      return;
    }

    try {
      setOwnerSubmitting(true);
      const ownerPayload = await buildOwnerPayload(ownerForm);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "owner",
          data: ownerPayload,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Une erreur est survenue lors de l'enregistrement de votre candidature."
        );
      }

      setFeedback({
        type: "success",
        message:
          "Votre demande a bien été enregistrée. Notre équipe vous contactera sous 48h pour finaliser la mise en location de votre chalet.",
      });
      setSuccessModal({
        open: true,
        type: "owner",
        message:
          result.message ||
          "Votre demande a bien été prise en compte. Nous vous recontactons très vite !",
      });
      setOwnerForm(createOwnerInitial());
      setOwnerActiveModule("owner-chalet");
      setOwnerExpandedRooms([true]);
      setOwnerAcceptedCGV(false);
    } catch (error) {
      console.error("Owner signup error:", error);
      setFeedback({
        type: "error",
        message:
          error.message ||
          "Impossible d'enregistrer votre candidature pour le moment. Merci de réessayer ultérieurement.",
      });
    } finally {
      setOwnerSubmitting(false);
    }
  };

  const handleTenantChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setTenantForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTenantSubmit = async (event) => {
    event.preventDefault();

    if (!isTenantFormValid) {
      setFeedback({
        type: "error",
        message:
          "Merci de renseigner les informations principales pour que nous puissions vous répondre.",
      });
      return;
    }

    if (!tenantAcceptedCGV) {
      setFeedback({
        type: "error",
        message:
          "Merci de consulter et d'accepter les CGV avant de valider votre demande.",
      });
      openCGVModal("tenant");
      return;
    }

    try {
      setTenantSubmitting(true);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "tenant",
          data: serializeTenantForm(tenantForm),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Une erreur est survenue lors de l'enregistrement de votre demande."
        );
      }

      setFeedback({
        type: "success",
        message:
          "Votre demande a bien été prise en compte. Nous reviendrons vers vous rapidement avec une sélection de chalets adaptés.",
      });
      setSuccessModal({
        open: true,
        type: "tenant",
        message:
          result.message ||
          "Votre demande a bien été prise en compte. Notre équipe vous contactera rapidement !",
      });
      setTenantForm(createTenantInitial());
      setTenantActiveModule("tenant-profile");
      setTenantAcceptedCGV(false);
    } catch (error) {
      console.error("Tenant signup error:", error);
      setFeedback({
        type: "error",
        message:
          error.message ||
          "Impossible d'enregistrer votre demande pour le moment. Merci de réessayer ultérieurement.",
      });
    } finally {
      setTenantSubmitting(false);
    }
  };

  const renderFeedback = () => {
    if (!feedback.message) return null;

    const isSuccess = feedback.type === "success";

    return (
      <div
        className={`rounded-xl border p-4 text-sm ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {feedback.message}
      </div>
    );
  };

  const ownerModules = [
    {
      id: "owner-chalet",
      title: "Informations sur le chalet",
      description:
        "Présentez votre bien en détail pour que nous puissions créer une fiche attrayante et complète.",
      icon: "Home",
      isComplete: ownerModuleStatus.chalet,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[30px] uppercase font-thin text-neutral-600">
              Titre du chalet
            </label>
            <input
              type="text"
              value={ownerForm.title}
              onChange={(event) =>
                handleOwnerChange("title", event.target.value)
              }
              placeholder="Ex. Chalet Horizon Mont-Blanc"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
          <label className="text-[15px]  italic text-neutral-600">
              Slug généré
            </label>
            <input
              type="text"
              value={ownerForm.slug}
              readOnly
                className="w-full rounded-2xl border-b border-b-neutral-200 bg-white px-4 py-3 text-[11px] italic font-loose text-neutral-800 hover:shadow-sm "
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <>
              <label className="text-[15px]  text-black">
                Description courte
              </label>
              <textarea
                value={ownerForm.shortDescription}
                onChange={(event) =>
                  handleOwnerChange("shortDescription", event.target.value)
                }
                rows={3}
                placeholder="Quelques phrases pour résumer l'expérience offerte par votre chalet."
                className="w-full rounded-2xl border-b border-b-neutral-200 bg-white px-4 py-3 text-sm italic font-loose text-neutral-800 hover:shadow-sm "
              />
            </>

            <>
              <label className="text-[15px]   text-black">
                Description détaillée
              </label>
              <textarea
                value={ownerForm.longDescription}
                onChange={(event) =>
                  handleOwnerChange("longDescription", event.target.value)
                }
                rows={6}
                placeholder="Détaillez les atouts du chalet, ses prestations, les services inclus..."
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </>
          </div>

          <div className="space-y-3 md:col-span-2">
            <span className="text-[15px] text-black">Équipements</span>
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white px-4 py-4">
              <div className="flex flex-wrap gap-4">
                {DEFAULT_AMENITIES.map((amenity) => {
                  const amenityId = `amenity-${amenity.key}`;

                  return (
                    <label
                      key={amenity.key}
                      htmlFor={amenityId}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:border-primary-200"
                    >
                      <input
                        id={amenityId}
                        type="checkbox"
                        checked={ownerForm.amenities?.[amenity.key] ?? false}
                        onChange={(event) =>
                          handleOwnerChange(
                            `amenities.${amenity.key}`,
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{amenity.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-neutral-500">
                  Ajouter un autre équipement
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={customAmenityInput}
                    onChange={(event) => setCustomAmenityInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addCustomAmenity();
                      }
                    }}
                    placeholder="Ex. Barbecue, Salle de sport..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
                  >
                    Ajouter
                  </button>
                </div>

                {ownerForm.amenities?.other?.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {ownerForm.amenities.other.map((amenity, index) => (
                      <li
                        key={`${amenity}-${index}`}
                        className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomAmenity(index)}
                          className="text-neutral-400 transition hover:text-neutral-600"
                          aria-label={`Supprimer l’équipement ${amenity}`}
                        >
                          <ClientIcon name="X" className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <FileDropzone
            label="Photo principale"
            description="Sélectionnez la photo phare qui met le mieux en valeur votre chalet."
            onFilesChange={(files) => handleOwnerChange("heroPhoto", files)}
            accept="image/jpeg,image/png"
            helperText="1 fichier"
          />

          <FileDropzone
            label="Galerie photos"
            description="Ajoutez plusieurs visuels pour présenter chaque pièce et ambiance."
            multiple
            onFilesChange={(files) => handleOwnerChange("gallery", files)}
            accept="image/jpeg,image/png"
            helperText="Jusqu'à 12 fichiers"
          />
        </div>
      ),
    },
    {
      id: "owner-rooms",
      title: "Pièces et ambiances",
      description:
        "Décrivez chaque pièce clé avec des visuels dédiés pour aider nos visiteurs à se projeter.",
      icon: "Layout",
      isComplete: ownerModuleStatus.rooms,
      content: (
        <div className="mt-8 space-y-8">
          {ownerForm.rooms.map((room, index) => {
            const isRoomOpen = ownerExpandedRooms[index] ?? true;

            return (
              <div
                key={index}
                className={`rounded-2xl border bg-white/60 p-6 transition ${
                  isRoomOpen ? "border-neutral-200" : "border-neutral-200/80"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleRoomVisibility(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition hover:border-primary-200 hover:text-primary-600"
                      aria-expanded={isRoomOpen}
                    >
                      <ClientIcon
                        name={isRoomOpen ? "ChevronUp" : "ChevronDown"}
                        className="h-4 w-4"
                      />
                    </button>
                    <h3 className="text-lg uppercase font-semibold text-neutral-800">
                      Pièce {index + 1}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-400">
                      {isRoomOpen ? "Ouverte" : "Fermée"}
                    </span>
                    {ownerForm.rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <ClientIcon name="Trash2" className="h-4 w-4" />
                        Retirer
                      </button>
                    )}
                  </div>
                </div>

                {isRoomOpen && (
                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                     <label className="text-sm font-medium text-neutral-800">
                        Nom de la pièce
                      </label>
                      <input
                        type="text"
                        value={room.name}
                        onChange={(event) =>
                          handleRoomChange(index, "name", event.target.value)
                        }
                        placeholder="Ex. Suite parentale, Salon cathédrale..."
                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium uppercase text-neutral-800">
                        Description
                      </label>
                      <textarea
                        value={room.description}
                        onChange={(event) =>
                          handleRoomChange(
                            index,
                            "description",
                            event.target.value
                          )
                        }
                        rows={3}
                        placeholder="Détaillez les prestations, la vue, les équipements disponibles..."
                        className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>

                    <FileDropzone
                      label="Photos de la pièce"
                      description="Ajoutez plusieurs photos mettant en valeur cette pièce."
                      multiple
                      onFilesChange={(files) =>
                        handleRoomPhotosChange(index, files)
                      }
                      accept="image/jpeg,image/png"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addRoom}
            className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/60 px-5 py-3 text-sm font-medium text-primary-600 transition hover:bg-primary-100"
          >
            <ClientIcon name="Plus" className="h-4 w-4" />
            Ajouter une pièce
          </button>
        </div>
      ),
    },
    {
      id: "owner-location",
      title: "Localisation du bien",
      description:
        "Précisez l'adresse du chalet afin que nous puissions vérifier sa zone de chalandise.",
      icon: "MapPin",
      isComplete: ownerModuleStatus.location,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Numéro de rue
            </label>
            <input
              type="text"
              value={ownerForm.propertyAddress.streetNumber}
              onChange={(event) =>
                handleOwnerChange(
                  "propertyAddress.streetNumber",
                  event.target.value
                )
              }
              placeholder="Ex. 12"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">Rue</label>
            <input
              type="text"
              value={ownerForm.propertyAddress.streetName}
              onChange={(event) =>
                handleOwnerChange(
                  "propertyAddress.streetName",
                  event.target.value
                )
              }
              placeholder="Nom de la rue"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.line2}
              onChange={(event) =>
                handleOwnerChange("propertyAddress.line2", event.target.value)
              }
              placeholder="Complément d'adresse (facultatif)"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.city}
              onChange={(event) =>
                handleOwnerChange("propertyAddress.city", event.target.value)
              }
              placeholder="Ville"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.postalCode}
              onChange={(event) =>
                handleOwnerChange(
                  "propertyAddress.postalCode",
                  event.target.value
                )
              }
              placeholder="Code postal"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.country}
              onChange={(event) =>
                handleOwnerChange("propertyAddress.country", event.target.value)
              }
              placeholder="Pays"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      ),
    },
    {
      id: "owner-personal",
      title: "Informations du propriétaire",
      description:
        "Nous collectons ces informations pour sécuriser la mise en location et préparer le contrat de mandat.",
      icon: "User",
      isComplete: ownerModuleStatus.owner,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">Nom</label>
            <input
              type="text"
              value={ownerForm.owner.lastName}
              onChange={(event) =>
                handleOwnerChange(["owner", "lastName"], event.target.value)
              }
              placeholder="Nom de famille"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Prénom
            </label>
            <input
              type="text"
              value={ownerForm.owner.firstName}
              onChange={(event) =>
                handleOwnerChange(["owner", "firstName"], event.target.value)
              }
              placeholder="Prénom"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Date de naissance
            </label>
            <input
              type="date"
              value={ownerForm.owner.birthDate}
              onChange={(event) =>
                handleOwnerChange(["owner", "birthDate"], event.target.value)
              }
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              type="email"
              value={ownerForm.owner.email}
              onChange={(event) =>
                handleOwnerChange(["owner", "email"], event.target.value)
              }
              placeholder="vous@exemple.com"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Téléphone
            </label>
            <input
              type="tel"
              value={ownerForm.owner.phone}
              onChange={(event) =>
                handleOwnerChange(["owner", "phone"], event.target.value)
              }
              placeholder="+33 6 00 00 00 00"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-neutral-800">Mot de passe</label>
            <input
              type="password"
              value={ownerForm.owner.password}
              onChange={(event) => handleOwnerChange(['owner', 'password'], event.target.value)}
              placeholder="Choisissez un mot de passe sécurisé"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <p className="text-xs text-neutral-500">Il vous permettra d'accéder à votre espace personnel.</p>
          </div>
        </div>
      ),
    },
    {
      id: "owner-documents",
      title: "Documents justificatifs",
      description:
        "Transmettez les pièces nécessaires pour vérifier votre identité et la propriété du chalet.",
      icon: "Folder",
      isComplete: ownerModuleStatus.documents,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FileDropzone
            label="Pièce d'identité"
            description="Téléchargez un document officiel (CNI, passeport...)."
            onFilesChange={(files) =>
              handleOwnerChange("identityDocument", files)
            }
            accept="image/jpeg,image/png,application/pdf"
            helperText="2 fichiers max"
          />

          <FileDropzone
            label="Acte de propriété"
            description="Téléchargez un justificatif attestant votre statut de propriétaire."
            onFilesChange={(files) =>
              handleOwnerChange("ownershipProof", files)
            }
            accept="image/jpeg,image/png,application/pdf"
          />
        </div>
      ),
    },
    {
      id: "owner-address",
      title: "Adresse principale du propriétaire",
      description:
        "Ces informations nous permettent de préparer vos documents fiscaux et administratifs.",
      icon: "Map",
      isComplete: ownerModuleStatus.mainAddress,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Numéro de rue
            </label>
            <input
              type="text"
              value={ownerForm.mainAddress.streetNumber}
              onChange={(event) =>
                handleOwnerChange(
                  "mainAddress.streetNumber",
                  event.target.value
                )
              }
              placeholder="Ex. 18"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">Rue</label>
            <input
              type="text"
              value={ownerForm.mainAddress.streetName}
              onChange={(event) =>
                handleOwnerChange("mainAddress.streetName", event.target.value)
              }
              placeholder="Nom de la rue"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.mainAddress.line2}
              onChange={(event) =>
                handleOwnerChange("mainAddress.line2", event.target.value)
              }
              placeholder="Complément d'adresse (facultatif)"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.mainAddress.city}
              onChange={(event) =>
                handleOwnerChange("mainAddress.city", event.target.value)
              }
              placeholder="Ville"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.mainAddress.postalCode}
              onChange={(event) =>
                handleOwnerChange("mainAddress.postalCode", event.target.value)
              }
              placeholder="Code postal"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.mainAddress.country}
              onChange={(event) =>
                handleOwnerChange("mainAddress.country", event.target.value)
              }
              placeholder="Pays"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      ),
    },
  ];

  const tenantModules = [
    {
      id: "tenant-profile",
      title: "Vos informations",
      description:
        "Dites-nous qui vous êtes et comment vous contacter pour recevoir des propositions personnalisées.",
      icon: "User",
      isComplete: tenantModuleStatus.profile,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">Nom</label>
            <input
              type="text"
              name="lastName"
              value={tenantForm.lastName}
              onChange={handleTenantChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={tenantForm.firstName}
              onChange={handleTenantChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={tenantForm.email}
              onChange={handleTenantChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={tenantForm.phone}
              onChange={handleTenantChange}
              placeholder="Optionnel"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      ),
    },
    {
      id: "tenant-project",
      title: "Votre projet saisonnier",
      description:
        "Partagez vos critères pour recevoir des propositions parfaitement adaptées.",
      icon: "Calendar",
      isComplete: tenantModuleStatus.project,
      content: (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-neutral-800">
              Destination recherchée
            </label>
            <input
              type="text"
              name="preferredRegion"
              value={tenantForm.preferredRegion}
              onChange={handleTenantChange}
              placeholder="Ex. Chamonix, Megève, Val d'Isère..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Période souhaitée
            </label>
            <input
              type="text"
              name="desiredDates"
              value={tenantForm.desiredDates}
              onChange={handleTenantChange}
              placeholder="Ex. Décembre 2024 - Mars 2025"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Nombre de voyageurs
            </label>
            <input
              type="number"
              min="1"
              name="guests"
              value={tenantForm.guests}
              onChange={handleTenantChange}
              placeholder="Ex. 6"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
           <label className="text-sm font-medium text-neutral-800">
              Budget estimé
            </label>
            <input
              type="text"
              name="budget"
              value={tenantForm.budget}
              onChange={handleTenantChange}
              placeholder="Ex. 25 000 € la saison"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
           <label className="text-sm font-medium text-neutral-800">
              Précisions complémentaires
            </label>
            <textarea
              name="requirements"
              value={tenantForm.requirements}
              onChange={handleTenantChange}
              rows={4}
              placeholder="Services souhaités, équipements indispensables, ambiance recherchée..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      ),
    },
  ];

  const renderAccordion = (modules, activeModule, setActiveModule) => (
    <div className="space-y-4">
      {modules.map((module) => {
        const isOpen = activeModule === module.id;

        return (
          <div
            key={module.id}
            className={`rounded-3xl border transition ${
              isOpen
                ? "border-primary-200 bg-white/90 shadow-lg"
                : "border-neutral-200 bg-white/70 hover:border-primary-100"
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveModule(isOpen ? "" : module.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    isOpen
                      ? "bg-primary-500/10 text-primary-500"
                      : "bg-primary-50 text-primary-600"
                  }`}
                >
                  <ClientIcon name={module.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-[30px] uppercase font-thin text-neutral-900">
                    {module.title}
                  </h2>
                  <p className="mt-1 text-[10px] uppercase text-neutral-500">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {module.isComplete && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                    <ClientIcon name="CheckCircle2" className="h-4 w-4" />
                    Complété
                  </span>
                )}
                <ClientIcon
                  name={isOpen ? "ChevronUp" : "ChevronDown"}
                  className="h-5 w-5 text-neutral-400"
                />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-neutral-100 px-6 pb-8 pt-6">
             
                {module.content}
                   <div className="mb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveModule("")}
                    className="inline-flex mt-6 items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:text-orange-200 "
                  >
                    <ClientIcon name="Minus" className="h-4 w-4" />
                    Masquer la section
                  </button>
                </div>
              </div>

            )}
          </div>
        );
      })}
    </div>
  );

  const renderOwnerForm = () => (
    <form onSubmit={handleOwnerSubmit} className="space-y-10">
      {renderAccordion(ownerModules, ownerActiveModule, setOwnerActiveModule)}

      {isOwnerFormValid && (
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary-700">
              Validation de votre candidature
            </h3>
            <p className="mt-1 text-sm text-primary-600">
              Notre équipe analysera les informations fournies et vous
              recontactera rapidement pour finaliser l'onboarding de votre chalet.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              <ClientIcon name="CheckCircle2" className="h-4 w-4" />
              Complété
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-3 md:w-auto">
            <label className="flex items-start gap-3 text-sm text-primary-700">
              <input
                type="checkbox"
                checked={ownerAcceptedCGV}
                onChange={(event) => {
                  if (!event.target.checked) {
                    setOwnerAcceptedCGV(false);
                    return;
                  }

                  if (!ownerAcceptedCGV) {
                    openCGVModal("owner");
                  }
                }}
                className="mt-1 h-5 w-5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <span>
                J'ai lu et j'accepte les Conditions Générales de Vente.
                <button
                  type="button"
                  onClick={() => openCGVModal("owner")}
                  className="ml-2 text-primary-700 underline underline-offset-4 hover:text-primary-800"
                >
                  Consulter les CGV
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={ownerSubmitting || !ownerAcceptedCGV}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
                ownerSubmitting || !ownerAcceptedCGV
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              <ClientIcon name="Send" className="h-4 w-4" />
              {ownerSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
          </div>
        </div>
      )}
    </form>
  );

  const renderTenantForm = () => (
    <form onSubmit={handleTenantSubmit} className="space-y-10">
      {renderAccordion(
        tenantModules,
        tenantActiveModule,
        setTenantActiveModule
      )}

      {isTenantFormValid && (
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-primary-700">
              Recevoir ma sélection personnalisée
            </h3>
            <p className="mt-1 text-sm text-primary-600">
              Nous vous enverrons une première sélection de chalets correspondant
              à vos critères dans les plus brefs délais.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              <ClientIcon name="CheckCircle2" className="h-4 w-4" />
              Complété
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-3 md:w-auto">
            <label className="flex items-start gap-3 text-sm text-primary-700">
              <input
                type="checkbox"
                checked={tenantAcceptedCGV}
                onChange={(event) => {
                  if (!event.target.checked) {
                    setTenantAcceptedCGV(false);
                    return;
                  }

                  if (!tenantAcceptedCGV) {
                    openCGVModal("tenant");
                  }
                }}
                className="mt-1 h-5 w-5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <span>
                J'ai lu et j'accepte les Conditions Générales de Vente.
                <button
                  type="button"
                  onClick={() => openCGVModal("tenant")}
                  className="ml-2 text-primary-700 underline underline-offset-4 hover:text-primary-800"
                >
                  Consulter les CGV
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={tenantSubmitting || !tenantAcceptedCGV}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
                tenantSubmitting || !tenantAcceptedCGV
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              <ClientIcon name="Send" className="h-4 w-4" />
              {tenantSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>
          </div>
        </div>
      )}
    </form>
  );

  return (
    <div className=" bg-neutral-50">
      <Header />

      <main className="pt-24 pb-16">
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 px-8 py-16 text-white shadow-xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  <ClientIcon name="Sparkles" className="h-4 w-4" />
                  Rejoindre notre réseau
                </span>
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                  Inscription saisonnière : propriétaire ou locataire,
                  choisissez votre parcours.
                </h1>
                <p className="text-white/80">
                  Nous accompagnons aussi bien les propriétaires qui souhaitent
                  confier leur chalet que les voyageurs en quête d'un séjour
                  saisonnier d'exception.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <ClientIcon
                    name="ShieldCheck"
                    className="h-5 w-5 text-emerald-300"
                  />
                  Process sécurisé et conforme KYC
                </div>
                <div className="flex items-center gap-3">
                  <ClientIcon
                    name="Users"
                    className="h-5 w-5 text-emerald-300"
                  />
                  Accompagnement humain dédié
                </div>
                <div className="flex items-center gap-3">
                  <ClientIcon
                    name="Stars"
                    className="h-5 w-5 text-emerald-300"
                  />
                  Sélection premium de chalets
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {OPTIONS.map((option) => {
              const isActive = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedOption(option.id);
                    resetFeedback();
                    setOwnerAcceptedCGV(false);
                    setTenantAcceptedCGV(false);
                    if (option.id === "owner") {
                      setOwnerActiveModule("owner-chalet");
                    } else {
                      setTenantActiveModule("tenant-profile");
                    }
                  }}
                  className={`text-left transition ${
                    isActive
                      ? "rounded-3xl border-2 border-primary-500 bg-white shadow-xl shadow-primary-500/10"
                      : "rounded-3xl border border-neutral-200 bg-white/70 hover:border-primary-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4 p-6">
                    <div
                      className={`rounded-2xl p-4 ${
                        isActive
                          ? "bg-primary-500/10 text-primary-50"
                          : "bg-primary-50 text-primary-600"
                      }`}
                    >
                      <ClientIcon name={option.icon} className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl uppercase font-semibold text-neutral-900">
                        {option.title}
                      </h2>
                      <p className="text-[10px] uppercase text-neutral-600">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-6">
            {renderFeedback()}
            {!selectedOption && (
              <div className="rounded-3xl border border-dashed border-neutral-200 bg-white/60 p-8 text-center text-sm text-neutral-600">
                Sélectionnez le parcours qui correspond à votre situation pour commencer votre inscription.
              </div>
            )}
            {selectedOption === "owner" && renderOwnerForm()}
            {selectedOption === "tenant" && renderTenantForm()}
          </div>
        </section>
      </main>

      <Footer />

      {cgvModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={closeCGVModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 shadow-lg px-6 py-4">
              <div>
                <h2 className="text-3xl font-thin text-neutral-900 ">
                  Conditions Générales de Vente
                </h2>
                <p className="text-[10px] uppercase text-primary-700 mt-6 md:w-1/2">
                  Prenez quelques instants pour consulter nos conditions avant de poursuivre.  
                </p>
              </div>
              <button
                type="button"
                onClick={closeCGVModal}
                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Fermer la fenêtre des CGV"
              >
                <ClientIcon name="X" className="h-4 w-4" />
              </button>
            </div>

            <div className="h-[420px] w-full border-b border-neutral-100 bg-neutral-50">
              <iframe
                src={`${CGV_URLS[cgvModal.type] ?? "/cgv-proprietaires"}`}
                title="Conditions Générales de Vente"
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
              <a
                href={CGV_URLS[cgvModal.type] ?? "/cgv-proprietaires"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase italic font-light text-primary-600  hover:text-primary-700"
              >
                Ouvrir les CGV dans un nouvel onglet
              </a>
              <button
                type="button"
                onClick={handleCGVAcceptance}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 font-light text-[12px] text-white transition hover:bg-primary-700"
              >
                
                J'accepte les CGV
              </button>
            </div>
          </div>
        </div>
      )}

      {successModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={handleSuccessModalClose}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <ClientIcon name="CheckCircle2" className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-neutral-900">
              Merci pour votre confiance !
            </h3>
            <p className="mt-3 text-sm text-neutral-600">
              {successModal.message ||
                "Votre demande a bien été prise en compte. Nous revenons vers vous très prochainement."}
            </p>
            <button
              type="button"
              onClick={handleSuccessModalClose}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

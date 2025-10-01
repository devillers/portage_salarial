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

    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    password: ''

    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phone: "",

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
    id: "renting",
    title: "J'ai un chalet à louer à la saison",
    description:
      "Partagez les informations essentielles de votre bien pour rejoindre notre réseau et bénéficier de notre accompagnement complet.",
    icon: "Home",
  },
  {
    id: "looking",
    title: "Je recherche une location à la saison",
    description:
      "Indiquez vos critères afin que notre équipe vous propose les chalets correspondant parfaitement à vos attentes.",
    icon: "Search",
  },
];

const serializeFiles = (files) =>
  Array.isArray(files)
    ? files.map((file) => ({
        name: file?.name ?? "",
        size: file?.size ?? 0,
        type: file?.type ?? "",
        lastModified: file?.lastModified ?? null,
      }))
    : [];

const serializeOwnerForm = (form) => ({
  title: form.title,
  slug: form.slug,
  shortDescription: form.shortDescription,
  longDescription: form.longDescription,
  heroPhoto: serializeFiles(form.heroPhoto),
  gallery: serializeFiles(form.gallery),
  rooms: form.rooms.map((room) => ({
    name: room.name,
    description: room.description,
    photos: serializeFiles(room.photos),
  })),
  propertyAddress: form.propertyAddress,
  mainAddress: form.mainAddress,
  owner: form.owner,
  identityDocument: serializeFiles(form.identityDocument),
  ownershipProof: serializeFiles(form.ownershipProof),
});

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
  const [selectedOption, setSelectedOption] = useState("owner");
  const [ownerForm, setOwnerForm] = useState(createOwnerInitial);
  const [tenantForm, setTenantForm] = useState(createTenantInitial);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [ownerActiveModule, setOwnerActiveModule] = useState("owner-chalet");
  const [tenantActiveModule, setTenantActiveModule] =
    useState("tenant-profile");
  const [ownerSubmitting, setOwnerSubmitting] = useState(false);
  const [tenantSubmitting, setTenantSubmitting] = useState(false);
  const [ownerExpandedRooms, setOwnerExpandedRooms] = useState([true]);

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
      ownerForm.owner.password.trim();
    const hasDocuments = ownerForm.identityDocument.length > 0 && ownerForm.ownershipProof.length > 0;

      ownerForm.owner.email.trim();
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

    try {
      setOwnerSubmitting(true);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "owner",
          data: serializeOwnerForm(ownerForm),
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
      setOwnerForm(createOwnerInitial());
      setOwnerActiveModule("owner-chalet");
      setOwnerExpandedRooms([true]);
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
          "Merci pour votre demande. Nous reviendrons vers vous avec une sélection personnalisée de chalets saisonniers.",
      });
      setTenantForm(createTenantInitial());
      setTenantActiveModule("tenant-profile");
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
          <label className="text-[11px] uppercase font-bold text-neutral-600">
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
              <label className="text-[11px] uppercase font-bold text-neutral-600">
                Description courte
              </label>
              <textarea
                value={ownerForm.shortDescription}
                onChange={(event) =>
                  handleOwnerChange("shortDescription", event.target.value)
                }
                rows={3}
                placeholder="Quelques phrases pour résumer l'expérience offerte par votre chalet."
                className="w-full rounded-2xl border-b border-b-neutral-200 bg-white px-4 py-3 text-[11px] italic font-loose text-neutral-800 hover:shadow-sm "
              />
            </>

            <>
              <label className="text-[11px] uppercase font-bold text-neutral-600">
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
                    <h3 className="text-lg font-semibold text-neutral-800">
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
                      <label className="text-sm font-medium text-neutral-800">
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
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 transition hover:border-primary-200 hover:text-primary-600"
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

      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">
            Validation de votre candidature
          </h3>
          <p className="mt-1 text-sm text-primary-600">
            Notre équipe analysera les informations fournies et vous
            recontactera rapidement pour finaliser l'onboarding de votre chalet.
          </p>
        </div>

        <button
          type="submit"
          disabled={ownerSubmitting}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
            ownerSubmitting
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          <ClientIcon name="Send" className="h-4 w-4" />
          {ownerSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
        </button>
      </div>
    </form>
  );

  const renderTenantForm = () => (
    <form onSubmit={handleTenantSubmit} className="space-y-10">
      {renderAccordion(
        tenantModules,
        tenantActiveModule,
        setTenantActiveModule
      )}

      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">
            Recevoir ma sélection personnalisée
          </h3>
          <p className="mt-1 text-sm text-primary-600">
            Nous vous enverrons une première sélection de chalets correspondant
            à vos critères dans les plus brefs délais.
          </p>
        </div>

        <button
          type="submit"
          disabled={tenantSubmitting}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
            tenantSubmitting
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          <ClientIcon name="Send" className="h-4 w-4" />
          {tenantSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
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
            {selectedOption === "owner"
              ? renderOwnerForm()
              : renderTenantForm()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

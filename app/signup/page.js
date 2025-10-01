'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ClientIcon from '../../components/ClientIcon';
import FileDropzone from '../../components/forms/FileDropzone';

const OWNER_INITIAL = {
  title: '',
  slug: '',
  shortDescription: '',
  longDescription: '',
  heroPhoto: [],
  gallery: [],
  rooms: [
    {
      name: '',
      description: '',
      photos: []
    }
  ],
  propertyAddress: {
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: ''
  },
  mainAddress: {
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    country: ''
  },
  owner: {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: ''
  },
  identityDocument: [],
  ownershipProof: []
};

const SEEKER_INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredRegion: '',
  desiredDates: '',
  guests: '',
  budget: '',
  requirements: ''
};

const OPTIONS = [
  {
    id: 'owner',
    title: "J'ai un chalet à louer à la saison",
    description:
      'Partagez les informations essentielles de votre bien pour rejoindre notre réseau et bénéficier de notre accompagnement complet.',
    icon: 'Home'
  },
  {
    id: 'seeker',
    title: 'Je recherche une location à la saison',
    description:
      'Indiquez vos critères afin que notre équipe vous propose les chalets correspondant parfaitement à vos attentes.',
    icon: 'Search'
  }
];

export default function SignUpPage() {
  const [selectedOption, setSelectedOption] = useState('owner');
  const [ownerForm, setOwnerForm] = useState(OWNER_INITIAL);
  const [seekerForm, setSeekerForm] = useState(SEEKER_INITIAL);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const isOwnerFormValid = useMemo(() => {
    const hasBaseInfo = ownerForm.title.trim() && ownerForm.shortDescription.trim() && ownerForm.longDescription.trim();
    const hasAddresses =
      ownerForm.propertyAddress.line1.trim() &&
      ownerForm.propertyAddress.city.trim() &&
      ownerForm.propertyAddress.country.trim() &&
      ownerForm.mainAddress.line1.trim() &&
      ownerForm.mainAddress.city.trim() &&
      ownerForm.mainAddress.country.trim();
    const hasOwnerInfo = ownerForm.owner.firstName.trim() && ownerForm.owner.lastName.trim() && ownerForm.owner.birthDate;

    return hasBaseInfo && hasAddresses && hasOwnerInfo;
  }, [ownerForm]);

  const isSeekerFormValid = useMemo(() => {
    return (
      seekerForm.firstName.trim() &&
      seekerForm.lastName.trim() &&
      seekerForm.email.trim() &&
      seekerForm.preferredRegion.trim()
    );
  }, [seekerForm]);

  const resetFeedback = () => setFeedback({ type: '', message: '' });

  const handleOwnerChange = (path, value) => {
    resetFeedback();

    setOwnerForm((prev) => {
      const updated = structuredClone(prev);

      const segments = Array.isArray(path) ? path : path.split('.');
      let pointer = updated;

      segments.slice(0, -1).forEach((segment) => {
        if (typeof pointer[segment] === 'undefined') {
          pointer[segment] = {};
        }
        pointer = pointer[segment];
      });

      pointer[segments.at(-1)] = value;

      if (segments[0] === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/[^\w\s-]+/g, '')
          .trim()
          .replace(/\s+/g, '-');
      }

      return updated;
    });
  };

  const handleRoomChange = (index, key, value) => {
    setOwnerForm((prev) => {
      const updated = structuredClone(prev);
      updated.rooms[index][key] = value;
      return updated;
    });
  };

  const handleRoomPhotosChange = (index, files) => {
    setOwnerForm((prev) => {
      const updated = structuredClone(prev);
      updated.rooms[index].photos = files;
      return updated;
    });
  };

  const addRoom = () => {
    setOwnerForm((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          name: '',
          description: '',
          photos: []
        }
      ]
    }));
  };

  const removeRoom = (index) => {
    setOwnerForm((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const handleOwnerSubmit = (event) => {
    event.preventDefault();

    if (!isOwnerFormValid) {
      setFeedback({ type: 'error', message: 'Merci de compléter les informations obligatoires avant de valider.' });
      return;
    }

    setFeedback({
      type: 'success',
      message:
        'Votre demande a bien été enregistrée. Notre équipe vous contactera sous 48h pour finaliser la mise en location de votre chalet.'
    });
    setOwnerForm(OWNER_INITIAL);
  };

  const handleSeekerChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setSeekerForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeekerSubmit = (event) => {
    event.preventDefault();

    if (!isSeekerFormValid) {
      setFeedback({ type: 'error', message: 'Merci de renseigner les informations principales pour que nous puissions vous répondre.' });
      return;
    }

    setFeedback({
      type: 'success',
      message: 'Merci pour votre demande. Nous reviendrons vers vous avec une sélection personnalisée de chalets saisonniers.'
    });
    setSeekerForm(SEEKER_INITIAL);
  };

  const renderFeedback = () => {
    if (!feedback.message) return null;

    const isSuccess = feedback.type === 'success';

    return (
      <div
        className={`rounded-xl border p-4 text-sm ${
          isSuccess
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}
      >
        {feedback.message}
      </div>
    );
  };

  const renderOwnerForm = () => (
    <form onSubmit={handleOwnerSubmit} className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Informations sur le chalet</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Présentez votre bien en détail pour que nous puissions créer une fiche attrayante et complète.
            </p>
          </div>
          <ClientIcon name="Home" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Titre du chalet</label>
            <input
              type="text"
              value={ownerForm.title}
              onChange={(event) => handleOwnerChange('title', event.target.value)}
              placeholder="Ex. Chalet Horizon Mont-Blanc"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Slug généré</label>
            <input
              type="text"
              value={ownerForm.slug}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Description courte</label>
            <textarea
              value={ownerForm.shortDescription}
              onChange={(event) => handleOwnerChange('shortDescription', event.target.value)}
              rows={3}
              placeholder="Quelques phrases pour résumer l'expérience offerte par votre chalet."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Description détaillée</label>
            <textarea
              value={ownerForm.longDescription}
              onChange={(event) => handleOwnerChange('longDescription', event.target.value)}
              rows={6}
              placeholder="Détaillez les atouts du chalet, ses prestations, les services inclus..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FileDropzone
            label="Photo principale"
            description="Sélectionnez la photo phare qui met le mieux en valeur votre chalet."
            onFilesChange={(files) => handleOwnerChange('heroPhoto', files)}
            accept="image/jpeg,image/png"
            helperText="1 fichier"
          />

          <FileDropzone
            label="Galerie photos"
            description="Ajoutez plusieurs visuels pour présenter chaque pièce et ambiance."
            multiple
            onFilesChange={(files) => handleOwnerChange('gallery', files)}
            accept="image/jpeg,image/png"
            helperText="Jusqu'à 12 fichiers"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Pièces et ambiances</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Décrivez chaque pièce clé avec des visuels dédiés pour aider nos visiteurs à se projeter.
            </p>
          </div>
          <ClientIcon name="Layout" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 space-y-8">
          {ownerForm.rooms.map((room, index) => (
            <div key={index} className="rounded-2xl border border-neutral-200 bg-white/60 p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-neutral-800">Pièce {index + 1}</h3>
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

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-800">Nom de la pièce</label>
                  <input
                    type="text"
                    value={room.name}
                    onChange={(event) => handleRoomChange(index, 'name', event.target.value)}
                    placeholder="Ex. Suite parentale, Salon cathédrale..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-neutral-800">Description</label>
                  <textarea
                    value={room.description}
                    onChange={(event) => handleRoomChange(index, 'description', event.target.value)}
                    rows={3}
                    placeholder="Détaillez les prestations, la vue, les équipements disponibles..."
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <FileDropzone
                  label="Photos de la pièce"
                  description="Ajoutez plusieurs photos mettant en valeur cette pièce."
                  multiple
                  onFilesChange={(files) => handleRoomPhotosChange(index, files)}
                  accept="image/jpeg,image/png"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addRoom}
            className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/60 px-5 py-3 text-sm font-medium text-primary-600 transition hover:bg-primary-100"
          >
            <ClientIcon name="Plus" className="h-4 w-4" />
            Ajouter une pièce
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Localisation du bien</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Précisez l'adresse du chalet afin que nous puissions vérifier sa zone de chalandise.
            </p>
          </div>
          <ClientIcon name="MapPin" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Adresse du bien</label>
            <input
              type="text"
              value={ownerForm.propertyAddress.line1}
              onChange={(event) => handleOwnerChange('propertyAddress.line1', event.target.value)}
              placeholder="Numéro et rue"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.line2}
              onChange={(event) => handleOwnerChange('propertyAddress.line2', event.target.value)}
              placeholder="Complément (facultatif)"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.city}
              onChange={(event) => handleOwnerChange('propertyAddress.city', event.target.value)}
              placeholder="Ville"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.postalCode}
              onChange={(event) => handleOwnerChange('propertyAddress.postalCode', event.target.value)}
              placeholder="Code postal"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.propertyAddress.country}
              onChange={(event) => handleOwnerChange('propertyAddress.country', event.target.value)}
              placeholder="Pays"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Informations du propriétaire</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Nous collectons ces informations pour sécuriser la mise en location et préparer le contrat de mandat.
            </p>
          </div>
          <ClientIcon name="User" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Nom</label>
            <input
              type="text"
              value={ownerForm.owner.lastName}
              onChange={(event) => handleOwnerChange(['owner', 'lastName'], event.target.value)}
              placeholder="Nom de famille"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Prénom</label>
            <input
              type="text"
              value={ownerForm.owner.firstName}
              onChange={(event) => handleOwnerChange(['owner', 'firstName'], event.target.value)}
              placeholder="Prénom"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Date de naissance</label>
            <input
              type="date"
              value={ownerForm.owner.birthDate}
              onChange={(event) => handleOwnerChange(['owner', 'birthDate'], event.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Email</label>
            <input
              type="email"
              value={ownerForm.owner.email}
              onChange={(event) => handleOwnerChange(['owner', 'email'], event.target.value)}
              placeholder="vous@exemple.com"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Téléphone</label>
            <input
              type="tel"
              value={ownerForm.owner.phone}
              onChange={(event) => handleOwnerChange(['owner', 'phone'], event.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <FileDropzone
            label="Pièce d'identité"
            description="Joignez une photo de votre CNI ou passeport (recto/verso)."
            onFilesChange={(files) => handleOwnerChange('identityDocument', files)}
            accept="image/jpeg,image/png,application/pdf"
            helperText="2 fichiers max"
          />

          <FileDropzone
            label="Acte de propriété"
            description="Téléchargez un justificatif attestant votre statut de propriétaire."
            onFilesChange={(files) => handleOwnerChange('ownershipProof', files)}
            accept="image/jpeg,image/png,application/pdf"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Adresse principale du propriétaire</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Ces informations nous permettent de préparer vos documents fiscaux et administratifs.
            </p>
          </div>
          <ClientIcon name="Map" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Adresse principale</label>
            <input
              type="text"
              value={ownerForm.mainAddress.line1}
              onChange={(event) => handleOwnerChange('mainAddress.line1', event.target.value)}
              placeholder="Numéro et rue"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.mainAddress.line2}
              onChange={(event) => handleOwnerChange('mainAddress.line2', event.target.value)}
              placeholder="Complément (facultatif)"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.mainAddress.city}
              onChange={(event) => handleOwnerChange('mainAddress.city', event.target.value)}
              placeholder="Ville"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={ownerForm.mainAddress.postalCode}
              onChange={(event) => handleOwnerChange('mainAddress.postalCode', event.target.value)}
              placeholder="Code postal"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <input
              type="text"
              value={ownerForm.mainAddress.country}
              onChange={(event) => handleOwnerChange('mainAddress.country', event.target.value)}
              placeholder="Pays"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">Validation de votre candidature</h3>
          <p className="mt-1 text-sm text-primary-600">
            Notre équipe analysera les informations fournies et vous recontactera rapidement pour finaliser l'onboarding de votre chalet.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <ClientIcon name="Send" className="h-4 w-4" />
          Envoyer ma candidature
        </button>
      </div>
    </form>
  );

  const renderSeekerForm = () => (
    <form onSubmit={handleSeekerSubmit} className="space-y-10">
      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Vos informations</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Dites-nous qui vous êtes et comment vous contacter pour recevoir des propositions personnalisées.
            </p>
          </div>
          <ClientIcon name="User" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Nom</label>
            <input
              type="text"
              name="lastName"
              value={seekerForm.lastName}
              onChange={handleSeekerChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={seekerForm.firstName}
              onChange={handleSeekerChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Email</label>
            <input
              type="email"
              name="email"
              value={seekerForm.email}
              onChange={handleSeekerChange}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={seekerForm.phone}
              onChange={handleSeekerChange}
              placeholder="Optionnel"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Votre projet de séjour</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Partagez vos critères pour que nous sélectionnions les chalets les plus adaptés à vos attentes.
            </p>
          </div>
          <ClientIcon name="Calendar" className="h-8 w-8 text-primary-500" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Destination recherchée</label>
            <input
              type="text"
              name="preferredRegion"
              value={seekerForm.preferredRegion}
              onChange={handleSeekerChange}
              placeholder="Ex. Chamonix, Megève, Val d'Isère..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Période souhaitée</label>
            <input
              type="text"
              name="desiredDates"
              value={seekerForm.desiredDates}
              onChange={handleSeekerChange}
              placeholder="Ex. Décembre 2024 - Mars 2025"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Nombre de voyageurs</label>
            <input
              type="number"
              min="1"
              name="guests"
              value={seekerForm.guests}
              onChange={handleSeekerChange}
              placeholder="Ex. 6"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-800">Budget estimé</label>
            <input
              type="text"
              name="budget"
              value={seekerForm.budget}
              onChange={handleSeekerChange}
              placeholder="Ex. 25 000 € la saison"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-neutral-800">Précisions complémentaires</label>
            <textarea
              name="requirements"
              value={seekerForm.requirements}
              onChange={handleSeekerChange}
              rows={4}
              placeholder="Services souhaités, équipements indispensables, ambiance recherchée..."
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-primary-200 bg-primary-50/70 px-6 py-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-primary-700">Recevoir ma sélection personnalisée</h3>
          <p className="mt-1 text-sm text-primary-600">
            Nous vous enverrons une première sélection de chalets correspondant à vos critères dans les plus brefs délais.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
        >
          <ClientIcon name="Send" className="h-4 w-4" />
          Envoyer ma demande
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
                  Inscription saisonnière : propriétaire ou locataire, choisissez votre parcours.
                </h1>
                <p className="text-white/80">
                  Nous accompagnons aussi bien les propriétaires qui souhaitent confier leur chalet que les voyageurs en quête d'un séjour saisonnier d'exception.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-white/85">
                <div className="flex items-center gap-3">
                  <ClientIcon name="ShieldCheck" className="h-5 w-5 text-emerald-300" />
                  Process sécurisé et conforme KYC
                </div>
                <div className="flex items-center gap-3">
                  <ClientIcon name="Users" className="h-5 w-5 text-emerald-300" />
                  Accompagnement humain dédié
                </div>
                <div className="flex items-center gap-3">
                  <ClientIcon name="Stars" className="h-5 w-5 text-emerald-300" />
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
                  }}
                  className={`text-left transition ${
                    isActive
                      ? 'rounded-3xl border-2 border-primary-500 bg-white shadow-xl shadow-primary-500/10'
                      : 'rounded-3xl border border-neutral-200 bg-white/70 hover:border-primary-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-4 p-6">
                    <div className={`rounded-2xl p-4 ${isActive ? 'bg-primary-500/10 text-primary-50' : 'bg-primary-50 text-primary-600'}`}>
                      <ClientIcon name={option.icon} className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl font-semibold text-neutral-900">{option.title}</h2>
                      <p className="text-sm text-neutral-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-6">
            {renderFeedback()}
            {selectedOption === 'owner' ? renderOwnerForm() : renderSeekerForm()}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

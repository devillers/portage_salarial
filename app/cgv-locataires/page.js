import PageWrapper from '../../components/layout/PageWrapper';

export const metadata = {
  title: 'Conditions Générales de Vente - Locataires',
  description:
    'Conditions générales de vente destinées aux locataires utilisant les services de Chalet Manager pour réserver un séjour en montagne.',
};

const sections = [
  {
    title: '1. Champ d’application',
    paragraphs: [
      "Les présentes Conditions Générales de Vente (CGV) régissent les réservations de séjours effectuées via Chalet Manager, que ce soit sur notre site internet, par téléphone ou par l’intermédiaire de nos partenaires.",
      "Toute réservation implique l’acceptation pleine et entière des présentes CGV par le locataire.",
    ],
  },
  {
    title: '2. Processus de réservation',
    paragraphs: [
      "Le locataire sélectionne le bien et les dates souhaités puis complète le formulaire de réservation.",
      "La réservation est confirmée après versement d’un acompte de 30 % du montant total et réception du contrat signé. À défaut de paiement dans les 72 heures, l’option est automatiquement annulée.",
      "Le solde est exigible 30 jours avant l’arrivée. Pour les réservations de dernière minute (moins de 30 jours), le paiement intégral est requis à la confirmation.",
    ],
  },
  {
    title: '3. Prix et taxes',
    paragraphs: [
      "Les tarifs affichés incluent la mise à disposition du bien, le linge de maison de base, l’accueil personnalisé et l’assistance Chalet Manager.",
      "Ne sont pas inclus : la taxe de séjour (facturée selon le tarif en vigueur), les prestations optionnelles (ménage quotidien, chef privé, transferts, etc.) et le dépôt de garantie.",
      "La taxe de séjour est collectée par Chalet Manager au nom de la collectivité et figure distinctement sur la facture.",
    ],
  },
  {
    title: '4. Dépôt de garantie',
    paragraphs: [
      "Un dépôt de garantie compris entre 1 500 € et 5 000 € selon le bien est exigé avant l’entrée dans les lieux. Il peut être prélevé par empreinte bancaire ou virement.",
      "Il est restitué dans un délai maximal de 14 jours après le départ, déduction faite des retenues justifiées par des dégradations, pertes ou prestations supplémentaires.",
    ],
  },
  {
    title: '5. Conditions d’annulation',
    paragraphs: [
      "Toute demande d’annulation doit être formulée par écrit. Les frais appliqués sont les suivants :",
    ],
    list: [
      'Annulation plus de 60 jours avant l’arrivée : remboursement de l’acompte moins 150 € de frais de dossier;',
      'Entre 60 et 30 jours avant l’arrivée : acompte conservé;',
      'Moins de 30 jours avant l’arrivée ou non-présentation : 100 % du séjour dû;',
    ],
    paragraphsAfterList: [
      "Certaines offres spéciales peuvent prévoir des conditions d’annulation plus strictes signalées au moment de la réservation.",
      "En cas de fermeture administrative ou de force majeure rendant le séjour impossible, Chalet Manager proposera un report ou un avoir équivalent aux sommes versées.",
    ],
  },
  {
    title: '6. Arrivée, séjour et départ',
    paragraphs: [
      "Les arrivées sont généralement prévues entre 16h00 et 20h00 et les départs avant 10h00, sauf accord écrit contraire.",
      "Le locataire s’engage à respecter les lieux, le voisinage et le règlement intérieur remis à l’arrivée.",
      "Toute fête ou sous-location non autorisée est strictement interdite. Chalet Manager se réserve le droit d’interrompre le séjour sans remboursement en cas de manquement grave.",
    ],
  },
  {
    title: '7. Obligations du locataire',
    paragraphs: [
      "Pendant toute la durée du séjour, le locataire doit :",
    ],
    list: [
      'Occuper les lieux en bon père de famille et signaler toute anomalie constatée;',
      'Limiter l’occupation au nombre de personnes prévu au contrat;',
      'Ne pas fumer à l’intérieur des biens lorsque cela est stipulé;',
      'Informer Chalet Manager de tout dommage occasionné et faciliter l’accès des prestataires pour les réparations;',
      'Respecter les consignes d’utilisation des équipements (spa, cheminée, appareils électriques).',
    ],
  },
  {
    title: '8. Responsabilités et assurances',
    paragraphs: [
      "Chalet Manager agit en tant qu’intermédiaire entre le propriétaire et le locataire. Sa responsabilité ne peut être engagée en cas de force majeure, de fait d’un tiers ou d’utilisation anormale des installations.",
      "Le locataire est tenu de disposer d’une assurance responsabilité civile villégiature couvrant les dommages corporels, matériels et immatériels causés pendant le séjour.",
    ],
  },
  {
    title: '9. Données personnelles',
    paragraphs: [
      "Les informations collectées lors de la réservation sont nécessaires au traitement de la demande et à la gestion du séjour.",
      "Elles sont destinées à Chalet Manager et à ses partenaires techniques (prestataires de conciergerie, assureurs). Conformément au RGPD, chaque locataire dispose d’un droit d’accès, de rectification et d’opposition en écrivant à privacy@chaletmanager.com.",
    ],
  },
  {
    title: '10. Réclamations et médiation',
    paragraphs: [
      "Toute réclamation doit être adressée par écrit à Chalet Manager dans un délai de 7 jours après la fin du séjour.",
      "À défaut de résolution amiable, le locataire peut saisir gratuitement le médiateur de la consommation MEDICYS (www.medicys.fr) ou toute plateforme européenne de règlement en ligne des litiges.",
    ],
  },
  {
    title: '11. Droit applicable',
    paragraphs: [
      "Les présentes CGV sont soumises au droit français. Tout litige relève des tribunaux compétents du lieu de situation du bien loué.",
    ],
  },
];

export default function CgvLocatairesPage() {
  const lastUpdated = '1er mars 2024';

  return (
    <PageWrapper mainClassName="bg-neutral-50 pt-0 md:pt-6 pb-20">
      <section className="bg-primary-900 text-white shadow-xl sm:mx-6 sm:rounded-3xl">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-primary-200">Conditions Générales de Vente</p>
          <h1 className="text-3xl font-light uppercase md:text-5xl">CGV locataires</h1>
          <p className="mt-6 max-w-3xl text-sm italic text-primary-100 md:w-3/5 md:text-base">
            Ce document précise les règles applicables à toute réservation de séjour réalisée auprès de Chalet Manager.
          </p>
          <p className="mt-6 text-[10px] uppercase text-primary-200">Dernière mise à jour : {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 sm:mx-6">
        <div className="mx-auto max-w-5xl space-y-12 rounded-3xl bg-white px-6 py-12 shadow-sm">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="mb-4 text-xl font-light uppercase text-neutral-900 md:text-2xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-justify text-xs leading-relaxed text-neutral-700">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 list-inside list-disc text-justify text-xs leading-relaxed text-neutral-700">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.paragraphsAfterList &&
                section.paragraphsAfterList.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-justify text-xs leading-relaxed text-neutral-700">
                    {paragraph}
                  </p>
                ))}
            </article>
          ))}

          <div className="rounded-xl border border-primary-100 bg-primary-50 p-6 text-primary-900">
            <h3 className="text-lg font-semibold">Service client Chalet Manager</h3>
            <p className="mt-3 text-sm text-primary-900/80">
              Pour toute question concernant votre réservation, votre arrivée ou un séjour en cours, notre équipe est joignable 7j/7.
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row">
              <span className="font-medium">Assistance :</span>
              <a href="mailto:guests@chaletmanager.com" className="text-primary-700 hover:text-primary-800">
                guests@chaletmanager.com
              </a>
              <span className="hidden sm:block">•</span>
              <a href="tel:+33456781234" className="text-primary-700 hover:text-primary-800">
                +33 4 56 78 12 34
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}


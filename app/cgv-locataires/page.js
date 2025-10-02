import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

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
    <>
      <Header />
      <main className="bg-neutral-50 pt-24">
        <section className="bg-primary-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="uppercase tracking-widest text-primary-200 text-xs mb-4">Conditions Générales de Vente</p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-6">
              CGV locataires
            </h1>
            <p className="text-base md:text-lg text-primary-100 max-w-3xl">
              Ce document précise les règles applicables à toute réservation de séjour réalisée auprès de Chalet Manager.
            </p>
            <p className="mt-6 text-sm text-primary-200">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 space-y-12">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-4">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-neutral-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc list-inside text-neutral-700 space-y-2">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.paragraphsAfterList &&
                  section.paragraphsAfterList.map((paragraph) => (
                    <p key={paragraph} className="text-neutral-700 leading-relaxed mt-4">
                      {paragraph}
                    </p>
                  ))}
              </article>
            ))}

            <div className="border border-primary-100 bg-primary-50 text-primary-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Service client Chalet Manager</h3>
              <p className="text-sm text-primary-900/80 mb-4">
                Pour toute question concernant votre réservation, votre arrivée ou un séjour en cours, notre équipe est joignable 7j/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm">
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
      </main>
      <Footer />
    </>
  );
}

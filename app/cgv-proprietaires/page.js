import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export const metadata = {
  title: 'Conditions Générales de Vente - Propriétaires',
  description:
    'Conditions générales de vente applicables aux propriétaires partenaires de Chalet Manager pour la gestion et la commercialisation de leurs biens.',
};

const sections = [
  {
    title: '1. Objet du contrat',
    paragraphs: [
      "Les présentes Conditions Générales de Vente (CGV) définissent les modalités dans lesquelles Chalet Manager assure la gestion, la commercialisation et l'exploitation locative des biens confiés par leurs propriétaires.",
      "En signant le mandat de gestion ou en utilisant les services proposés par Chalet Manager, le propriétaire reconnaît avoir pris connaissance des présentes CGV et les accepte sans réserve.",
    ],
  },
  {
    title: '2. Définitions',
    paragraphs: [
      "• \"Chalet Manager\" : la société éditrice du présent site et prestataire de services de gestion locative.",
      "• \"Propriétaire\" : toute personne physique ou morale confiant un bien immobilier à Chalet Manager.",
      "• \"Bien\" : chalet, appartement ou toute propriété située en zone de montagne confiée à Chalet Manager.",
      "• \"Locataire\" : client final concluant un contrat de location pour le bien géré.",
    ],
  },
  {
    title: '3. Prestations de Chalet Manager',
    paragraphs: [
      "Chalet Manager fournit, selon le niveau d'accompagnement défini avec le propriétaire, les services suivants :",
    ],
    list: [
      'Analyse de rentabilité et définition de la stratégie commerciale du bien;',
      'Création, diffusion et optimisation des annonces sur les canaux partenaires et le site Chalet Manager;',
      'Gestion des demandes, réservations, encaissements et contrats de location;',
      'Accueil des locataires, conciergerie, intendance et suivi de la satisfaction;',
      'Organisation de la maintenance préventive et curative, gestion des prestataires techniques;',
      'Reporting financier, reversements et assistance administrative (taxes de séjour, fiscalité).',
    ],
  },
  {
    title: '4. Obligations du propriétaire',
    paragraphs: [
      "Le propriétaire s'engage à :",
    ],
    list: [
      'Fournir un bien conforme aux normes de sécurité, d’hygiène et de décence en vigueur;',
      'Déclarer la propriété auprès des autorités compétentes et disposer des autorisations nécessaires;',
      'Informer Chalet Manager de toute particularité juridique ou technique susceptible d’affecter l’exploitation du bien;',
      'Souscrire et maintenir une assurance multirisque habitation couvrant la location saisonnière;',
      'Régler les charges de copropriété, taxes foncières et autres frais non imputables à Chalet Manager;',
      'Faciliter l’accès au bien pour les opérations d’entretien et de contrôle convenues.'
    ],
  },
  {
    title: '5. Obligations de Chalet Manager',
    paragraphs: [
      "Chalet Manager s’engage à :",
    ],
    list: [
      'Mettre en œuvre les moyens nécessaires pour optimiser le taux d’occupation et la rentabilité du bien;',
      'Assurer une communication transparente via un reporting périodique (planning d’occupation, revenus, interventions);',
      'Respecter les lois et règlements applicables à la location meublée de tourisme;',
      'Sélectionner des locataires fiables et veiller au bon déroulement des séjours;',
      'Réagir dans les meilleurs délais en cas d’incident nécessitant une intervention;',
      'Conserver la confidentialité des informations communiquées par le propriétaire.'
    ],
  },
  {
    title: '6. Conditions financières',
    paragraphs: [
      "Les honoraires de Chalet Manager sont calculés sur la base du chiffre d’affaires locatif généré. Le pourcentage appliqué, les forfaits de conciergerie et les frais d’entretien sont précisés dans le mandat ou l’offre commerciale signée.",
      "Le reversement des loyers nets intervient mensuellement, déduction faite des commissions, frais engagés et taxes collectées. Un relevé détaillé est transmis à chaque échéance.",
      "Toute prestation additionnelle validée par le propriétaire fera l’objet d’un devis et d’une facturation complémentaire.",
    ],
  },
  {
    title: '7. Durée et résiliation',
    paragraphs: [
      "Le mandat de gestion est conclu pour une durée initiale d’un an renouvelable tacitement, sauf dispositions contraires.",
      "Chaque partie peut y mettre fin à l’expiration de la période en cours, moyennant un préavis écrit de 60 jours. La résiliation anticipée est possible en cas de manquement grave avéré, après mise en demeure restée sans effet pendant 30 jours.",
      "Les réservations confirmées avant la date effective de résiliation doivent être honorées. Chalet Manager percevra la rémunération due au titre de ces séjours.",
    ],
  },
  {
    title: '8. Responsabilité et assurances',
    paragraphs: [
      "Chalet Manager agit en qualité de mandataire. Sa responsabilité ne saurait être engagée en cas de force majeure ou de dommages imputables aux locataires, sous-traitants ou à un défaut structurel du bien.",
      "Le propriétaire demeure responsable des sinistres non couverts par l’assurance de Chalet Manager ou par celle des locataires. Il appartient au propriétaire de déclarer tout sinistre à son assureur et de coopérer avec Chalet Manager pour la constitution du dossier.",
    ],
  },
  {
    title: '9. Données personnelles',
    paragraphs: [
      "Chalet Manager collecte et traite les données personnelles nécessaires à l’exécution du mandat (coordonnées, informations bancaires, documents administratifs).",
      "Ces données sont conservées pendant toute la durée de la collaboration et archivées pendant la période légale. Conformément à la réglementation RGPD, le propriétaire dispose d’un droit d’accès, de rectification, d’opposition et de suppression en écrivant à privacy@chaletmanager.com.",
    ],
  },
  {
    title: '10. Droit applicable et litiges',
    paragraphs: [
      "Les présentes CGV sont soumises au droit français. Tout différend relatif à leur interprétation ou exécution qui ne pourrait être résolu à l’amiable sera soumis aux tribunaux compétents du ressort de la Cour d’appel d’Annecy.",
      "Pour toute question relative aux présentes CGV, le propriétaire peut contacter Chalet Manager à l’adresse suivante : legal@chaletmanager.com.",
    ],
  },
];

export default function CgvProprietairesPage() {
  const lastUpdated = '1er mars 2024';

  return (
    <>
      <Header />
      <main className="bg-neutral-50 pt-24">
        <section className="bg-primary-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6">
            <p className="uppercase tracking-widest text-primary-200 text-xs mb-4">Conditions Générales de Vente</p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-6">
              CGV propriétaires partenaires
            </h1>
            <p className="text-base md:text-lg text-primary-100 max-w-3xl">
              Ce document encadre la collaboration entre Chalet Manager et les propriétaires qui nous confient la gestion locative de leur bien.
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
              </article>
            ))}

            <div className="border border-primary-100 bg-primary-50 text-primary-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Besoin d’un complément d’information ?</h3>
              <p className="text-sm text-primary-900/80 mb-4">
                Notre équipe reste à votre disposition pour adapter un mandat sur-mesure et répondre à toutes vos questions juridiques, financières ou opérationnelles.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm">
                <span className="font-medium">Contact :</span>
                <a href="mailto:owners@chaletmanager.com" className="text-primary-700 hover:text-primary-800">
                  owners@chaletmanager.com
                </a>
                <span className="hidden sm:block">•</span>
                <a href="tel:+33123456789" className="text-primary-700 hover:text-primary-800">
                  +33 1 23 45 67 89
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

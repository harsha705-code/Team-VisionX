/**
 * Genetic Disorders Registry & Translation Engine
 * Uses crystal-clear, human-friendly explanations so anyone can easily understand.
 */

// Universal Genetic Code (RNA Codon -> Amino Acid)
export const CODON_TABLE = {
  'UUU': { code: 'Phe', name: 'Phenylalanine', type: 'Building Block', color: '#60a5fa' },
  'UUC': { code: 'Phe', name: 'Phenylalanine', type: 'Building Block', color: '#60a5fa' },
  'UUA': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'UUG': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'CUU': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'CUC': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'CUA': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'CUG': { code: 'Leu', name: 'Leucine', type: 'Building Block', color: '#60a5fa' },
  'AUU': { code: 'Ile', name: 'Isoleucine', type: 'Building Block', color: '#60a5fa' },
  'AUC': { code: 'Ile', name: 'Isoleucine', type: 'Building Block', color: '#60a5fa' },
  'AUA': { code: 'Ile', name: 'Isoleucine', type: 'Building Block', color: '#60a5fa' },
  'AUG': { code: 'Met', name: 'Methionine (START)', type: 'Start Signal', color: '#34d399' },
  'GUU': { code: 'Val', name: 'Valine', type: 'Water-Hating (Sticky)', color: '#f87171' },
  'GUC': { code: 'Val', name: 'Valine', type: 'Water-Hating (Sticky)', color: '#f87171' },
  'GUA': { code: 'Val', name: 'Valine', type: 'Water-Hating (Sticky)', color: '#f87171' },
  'GUG': { code: 'Val', name: 'Valine (MUTANT)', type: 'Water-Hating (Causes Sickling)', color: '#f87171' },
  'UCU': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'UCC': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'UCA': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'UCG': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'CCU': { code: 'Pro', name: 'Proline', type: 'Kink / Bender', color: '#94a3b8' },
  'CCC': { code: 'Pro', name: 'Proline', type: 'Kink / Bender', color: '#94a3b8' },
  'CCA': { code: 'Pro', name: 'Proline', type: 'Kink / Bender', color: '#94a3b8' },
  'CCG': { code: 'Pro', name: 'Proline', type: 'Kink / Bender', color: '#94a3b8' },
  'ACU': { code: 'Thr', name: 'Threonine', type: 'Building Block', color: '#a78bfa' },
  'ACC': { code: 'Thr', name: 'Threonine', type: 'Building Block', color: '#a78bfa' },
  'ACA': { code: 'Thr', name: 'Threonine', type: 'Building Block', color: '#a78bfa' },
  'ACG': { code: 'Thr', name: 'Threonine', type: 'Building Block', color: '#a78bfa' },
  'GCU': { code: 'Ala', name: 'Alanine', type: 'Building Block', color: '#60a5fa' },
  'GCC': { code: 'Ala', name: 'Alanine', type: 'Building Block', color: '#60a5fa' },
  'GCA': { code: 'Ala', name: 'Alanine', type: 'Building Block', color: '#60a5fa' },
  'GCG': { code: 'Ala', name: 'Alanine', type: 'Building Block', color: '#60a5fa' },
  'UAU': { code: 'Tyr', name: 'Tyrosine', type: 'Building Block', color: '#a78bfa' },
  'UAC': { code: 'Tyr', name: 'Tyrosine', type: 'Building Block', color: '#a78bfa' },
  'UAA': { code: 'STOP', name: 'STOP (End)', type: 'Stop Signal', color: '#ef4444' },
  'UAG': { code: 'STOP', name: 'STOP (End)', type: 'Stop Signal', color: '#ef4444' },
  'CAU': { code: 'His', name: 'Histidine', type: 'Building Block', color: '#38bdf8' },
  'CAC': { code: 'His', name: 'Histidine', type: 'Building Block', color: '#38bdf8' },
  'CAA': { code: 'Gln', name: 'Glutamine', type: 'Building Block', color: '#c084fc' },
  'CAG': { code: 'Gln', name: 'Glutamine (Repeated)', type: 'Repeats in Huntingtons', color: '#c084fc' },
  'AAU': { code: 'Asn', name: 'Asparagine', type: 'Building Block', color: '#c084fc' },
  'AAC': { code: 'Asn', name: 'Asparagine', type: 'Building Block', color: '#c084fc' },
  'AAA': { code: 'Lys', name: 'Lysine', type: 'Building Block', color: '#38bdf8' },
  'AAG': { code: 'Lys', name: 'Lysine', type: 'Building Block', color: '#38bdf8' },
  'GAU': { code: 'Asp', name: 'Aspartic Acid', type: 'Building Block', color: '#10b981' },
  'GAC': { code: 'Asp', name: 'Aspartic Acid', type: 'Building Block', color: '#10b981' },
  'GAA': { code: 'Glu', name: 'Glutamic Acid (HEALTHY)', type: 'Water-Loving (Smooth)', color: '#10b981' },
  'GAG': { code: 'Glu', name: 'Glutamic Acid (HEALTHY)', type: 'Water-Loving (Smooth)', color: '#10b981' },
  'UGU': { code: 'Cys', name: 'Cysteine', type: 'Building Block', color: '#fbbf24' },
  'UGC': { code: 'Cys', name: 'Cysteine', type: 'Building Block', color: '#fbbf24' },
  'UGA': { code: 'STOP', name: 'STOP (End)', type: 'Stop Signal', color: '#ef4444' },
  'UGG': { code: 'Trp', name: 'Tryptophan', type: 'Building Block', color: '#60a5fa' },
  'CGU': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'CGC': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'CGA': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'CGG': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'AGU': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'AGC': { code: 'Ser', name: 'Serine', type: 'Building Block', color: '#a78bfa' },
  'AGA': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'AGG': { code: 'Arg', name: 'Arginine', type: 'Building Block', color: '#38bdf8' },
  'GGU': { code: 'Gly', name: 'Glycine', type: 'Flexible', color: '#94a3b8' },
  'GGC': { code: 'Gly', name: 'Glycine', type: 'Flexible', color: '#94a3b8' },
  'GGA': { code: 'Gly', name: 'Glycine', type: 'Flexible', color: '#94a3b8' },
  'GGG': { code: 'Gly', name: 'Glycine', type: 'Flexible', color: '#94a3b8' }
};

export const COMPLEMENTS = {
  'A': 'T',
  'T': 'A',
  'C': 'G',
  'G': 'C'
};

export const BASE_METADATA = {
  'A': { name: 'Adenine', ring: 'Double Ring (Purine)', bonds: 2, color: 0xf59e0b, hex: '#f59e0b', complement: 'T' },
  'T': { name: 'Thymine', ring: 'Single Ring (Pyrimidine)', bonds: 2, color: 0x06b6d4, hex: '#06b6d4', complement: 'A' },
  'C': { name: 'Cytosine', ring: 'Single Ring (Pyrimidine)', bonds: 3, color: 0x10b981, hex: '#10b981', complement: 'G' },
  'G': { name: 'Guanine', ring: 'Double Ring (Purine)', bonds: 3, color: 0xf43f5e, hex: '#f43f5e', complement: 'C' }
};

// Reference Sequences
export const WILDTYPE_HBB_DNA = [
  'A', 'T', 'G', // Codon 1: Met
  'G', 'T', 'G', // Codon 2: Val
  'C', 'A', 'C', // Codon 3: His
  'C', 'T', 'G', // Codon 4: Leu
  'A', 'C', 'T', // Codon 5: Thr
  'C', 'C', 'T', // Codon 6: Pro
  'G', 'A', 'G', // Codon 7: GAG -> Glu (Healthy)
  'G', 'A', 'G', // Codon 8: GAG -> Glu
  'A', 'A', 'G', // Codon 9: Lys
  'T', 'C', 'T', // Codon 10: Ser
  'G', 'C', 'C', // Codon 11: Ala
  'G', 'T', 'T'  // Codon 12: Val
];

export const DISORDERS_DB = {
  'sickle_cell': {
    id: 'sickle_cell',
    name: 'Sickle Cell Anemia (Stiff Blood Cells)',
    gene: 'HBB Gene (Blood & Oxygen)',
    chromosome: 'Chromosome 11',
    mutationType: '1-Letter DNA Spelling Mistake (A swapped to T)',
    statusClass: 'status-disease',
    statusLabel: 'Disease Detected',
    sequence: (() => {
      const seq = [...WILDTYPE_HBB_DNA];
      seq[19] = 'T'; // GAG -> GTG
      return seq;
    })(),
    mutatedIndex: 19,
    shiftSummary: 'GAG became GTG (Letter A &rarr; T)',
    simpleExplain: 'Normally, red blood cells are soft, round donuts that carry oxygen smoothly through your body. In Sickle Cell, just ONE wrong letter in the DNA causes the cells to turn stiff and bent like bananas (sickles). They get stuck in tiny blood vessels, blocking blood flow and causing intense pain and exhaustion.',
    clinicalDescription: 'A single DNA letter mistake (A replaced by T) turns soft Glutamic Acid into sticky Valine. In low oxygen, the hemoglobin sticks together into hard rods, twisting the round red blood cell into a rigid crescent banana shape that jams blood vessels.',
    phenotypeModel: 'sickle_rbc',
    phenotypeTitle: 'Stiff Sickle Crescent Blood Cell',
    phenotypeDesc: 'Hard and bent like a crescent banana. Gets jammed in tiny blood pipes.',
    phenotypeBullets: [
      'Lasts only 10-20 days (causes severe tiredness/anemia)',
      'Gets stuck in blood vessels, causing sudden severe pain',
      'Can damage organs due to lack of oxygen delivery'
    ]
  },

  'cystic_fibrosis': {
    id: 'cystic_fibrosis',
    name: 'Cystic Fibrosis (Clogged Mucus Doors)',
    gene: 'CFTR Gene (Salt & Water Doorway)',
    chromosome: 'Chromosome 7',
    mutationType: '3-Letter DNA Deletion (Letters C-T-T erased)',
    statusClass: 'status-disease',
    statusLabel: 'Disease Detected',
    sequence: [
      'A', 'T', 'C', // Ile
      'A', 'T', 'C', // Ile
      'G', 'G', 'T', // Gly (TTT deleted)
      'G', 'T', 'T', // Val
      'T', 'C', 'C', // Ser
      'T', 'C', 'A', // Ser
      'A', 'A', 'A', // Lys
      'C', 'T', 'C', // Leu
      'T', 'T', 'C', // Phe
      'T', 'T', 'C', // Phe
      'A', 'C', 'C'  // Thr
    ],
    mutatedIndex: 6,
    shiftSummary: '3 Letters (CTT) Erased',
    simpleExplain: 'Your lungs have millions of microscopic doorway pumps that move salt and water to keep mucus thin and slippery. In Cystic Fibrosis, 3 letters of DNA got accidentally erased. Without those letters, the cell destroys the doorways before they ever reach the surface. As a result, thick sticky mucus builds up, clogging your lungs and making breathing very difficult.',
    clinicalDescription: 'Three DNA letters (CTT) are missing. This makes the salt doorway protein fold incorrectly, so the cell throws it away. Without salt doorways, mucus turns into thick sticky glue that traps bacteria and blocks air.',
    phenotypeModel: 'cystic_fibrosis_channel',
    phenotypeTitle: 'Missing Salt Doorway Channel',
    phenotypeDesc: 'Salt doorways never reach the cell surface, causing dry, sticky mucus.',
    phenotypeBullets: [
      'Thick, sticky mucus plugs the lungs, causing coughing and breathing trouble',
      'Traps bacteria, causing frequent lung infections',
      'Blocks digestive enzymes from reaching the stomach'
    ]
  },

  'huntington': {
    id: 'huntington',
    name: "Huntington's Disease (Brain DNA Stutter)",
    gene: 'HTT Gene (Brain Nerve Health)',
    chromosome: 'Chromosome 4',
    mutationType: 'DNA Stutter (>40 repeats of "CAG")',
    statusClass: 'status-disease',
    statusLabel: 'Disease Detected',
    sequence: [
      'A', 'T', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'A', 'G',
      'C', 'C', 'T'
    ],
    mutatedIndex: 3,
    shiftSummary: '"CAG" repeated over 40 times!',
    simpleExplain: 'Healthy people have the letters "CAG" repeated 10 to 26 times in their brain DNA. In Huntingtons disease, the DNA stutters and repeats "CAG" more than 40 times! This creates sticky, toxic protein clumps that slowly damage brain cells that control walking, thinking, and talking.',
    clinicalDescription: 'An unstable stutter repeats "CAG" way too many times. This creates long sticky protein tails that clump together inside brain cells, slowly causing nerve cells in the movement center of the brain to die.',
    phenotypeModel: 'huntington_aggregate',
    phenotypeTitle: 'Toxic Brain Protein Clumps',
    phenotypeDesc: 'Sticky protein knots accumulate and damage brain cells over time.',
    phenotypeBullets: [
      'Involuntary twitching and jerking movements (chorea)',
      'Memory loss and difficulty organizing thoughts',
      'Passes down families with increasing repeats each generation'
    ]
  },

  'down_syndrome': {
    id: 'down_syndrome',
    name: 'Down Syndrome (Extra 3rd Chromosome)',
    gene: 'Chromosome 21 (Whole Extra Copy)',
    chromosome: 'Chromosome 21 (3 copies instead of 2)',
    mutationType: 'Chromosome Copy Error (Trisomy 21)',
    statusClass: 'status-disease',
    statusLabel: 'Extra Chromosome',
    sequence: [...WILDTYPE_HBB_DNA],
    mutatedIndex: -1,
    shiftSummary: '3 copies of Chromosome 21 instead of 2',
    simpleExplain: 'Humans normally have 23 pairs of chromosomes (46 total — two copies of each). In Down Syndrome, an egg or sperm cell accidentally gives an extra 3rd copy of Chromosome 21. Having 3 copies instead of 2 is like having too many cooks following the recipe book; it changes how a childs body and brain grow.',
    clinicalDescription: 'A natural copying slip during cell division leaves a person with three copies of Chromosome 21. The extra instructions produce 50% more proteins than usual, leading to distinctive features, heart differences, and learning styles.',
    phenotypeModel: 'karyotype_trisomy',
    phenotypeTitle: 'Three Copies of Chromosome 21',
    phenotypeDesc: 'An extra chromosome produces an overdose of genetic instructions.',
    phenotypeBullets: [
      'Distinctive facial features and softer muscle tone',
      'Slower developmental pace and unique learning styles',
      'Higher chance of heart differences at birth'
    ]
  },

  'wildtype': {
    id: 'wildtype',
    name: 'Healthy Human DNA (No Mistakes)',
    gene: 'Normal Healthy Genes',
    chromosome: 'All 23 Pairs Intact',
    mutationType: 'None (Healthy & Normal)',
    statusClass: 'status-healthy',
    statusLabel: '100% Healthy',
    sequence: [...WILDTYPE_HBB_DNA],
    mutatedIndex: -1,
    shiftSummary: 'Standard DNA (Glutamic Acid Glu)',
    simpleExplain: 'This is healthy human DNA! All letters are spelled correctly, chromosomes come in standard pairs of two, and body cells produce smooth, properly folded proteins that keep organs running at peak performance.',
    clinicalDescription: 'Standard healthy genetic sequence. Red blood cells are round and flexible, lung mucus doorways work properly, and brain proteins fold without toxic clumping.',
    phenotypeModel: 'normal_rbc',
    phenotypeTitle: 'Healthy Round Blood Cell',
    phenotypeDesc: 'Soft, round donut disc that flexes smoothly through any blood pipe.',
    phenotypeBullets: [
      'Normal 120-day lifespan in your bloodstream',
      'Effortlessly delivers oxygen to your brain, muscles, and organs',
      'Never blocks blood pipes or causes pain crises'
    ]
  }
};

export function translateSequence(dnaBases) {
  const codons = [];
  for (let i = 0; i < dnaBases.length; i += 3) {
    const tripletDNA = dnaBases.slice(i, i + 3).join('');
    if (tripletDNA.length < 3) {
      codons.push({
        index: Math.floor(i / 3) + 1,
        dna: tripletDNA,
        mrna: tripletDNA.replace(/T/g, 'U'),
        amino: { code: '...', name: 'Incomplete', type: 'Fragment', color: '#94a3b8' }
      });
      break;
    }

    const mrna = tripletDNA.replace(/T/g, 'U');
    const amino = CODON_TABLE[mrna] || { code: '???', name: 'Unknown', type: 'Unrecognized', color: '#f43f5e' };

    codons.push({
      index: Math.floor(i / 3) + 1,
      startIndex: i,
      dna: tripletDNA,
      mrna: mrna,
      amino: amino
    });
  }
  return codons;
}

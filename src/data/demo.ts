/* ============================================================
   LADDI — Demo Data
   Realistic sample data for local demonstration mode.
   All records are clearly identified as demo/sample data.
   ============================================================ */

import type {
  Product,
  Category,
  Collection,
  Vendor,
  PurchaseOrder,
  Order,
  Shipment,
  CodSettlement,
} from '@/types';

// ── Categories ───────────────────────────────────────────────

export const demoCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Kurtis',
    slug: 'kurtis',
    description: 'Elegant everyday kurtis crafted with premium fabrics and contemporary silhouettes.',
    position: 1,
    isActive: true,
  },
  {
    id: 'cat-002',
    name: 'Co-ord Sets',
    slug: 'co-ord-sets',
    description: 'Effortlessly styled matching sets for the modern woman.',
    position: 2,
    isActive: true,
  },
  {
    id: 'cat-003',
    name: 'Dresses',
    slug: 'dresses',
    description: 'From everyday ease to occasion-ready elegance.',
    position: 3,
    isActive: true,
  },
  {
    id: 'cat-004',
    name: 'Festive Wear',
    slug: 'festive-wear',
    description: 'Statement pieces for celebrations and special occasions.',
    position: 4,
    isActive: true,
  },
  {
    id: 'cat-005',
    name: 'Everyday Wear',
    slug: 'everyday-wear',
    description: 'Comfortable yet refined pieces for your daily wardrobe.',
    position: 5,
    isActive: true,
  },
];

// ── Collections ──────────────────────────────────────────────

export const demoCollections: Collection[] = [
  {
    id: 'col-001',
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'The latest additions to our curated collection.',
    isActive: true,
  },
  {
    id: 'col-002',
    name: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Most loved pieces from our collection.',
    isActive: true,
  },
  {
    id: 'col-003',
    name: 'The Festive Edit',
    slug: 'the-festive-edit',
    description: 'Curated for celebrations — rich fabrics, intricate details, and timeless silhouettes.',
    isActive: true,
  },
  {
    id: 'col-004',
    name: 'Summer Solstice',
    slug: 'summer-solstice',
    description: 'Light, breathable pieces designed for warmer days.',
    isActive: true,
  },
  {
    id: 'col-005',
    name: 'Ivory & Earth',
    slug: 'ivory-and-earth',
    description: 'A tonal palette inspired by nature — soft ivories, warm taupes, and grounded neutrals.',
    isActive: true,
  },
];

// ── Products ─────────────────────────────────────────────────

export const demoProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Anaya Chikankari Kurti',
    slug: 'anaya-chikankari-kurti',
    description: 'A hand-embroidered Chikankari kurti in soft cotton, featuring delicate floral motifs across the yoke and sleeves. The A-line silhouette and three-quarter sleeves make it an effortless choice for both work and weekend outings. Finished with shell buttons and a mandarin collar.',
    shortDescription: 'Hand-embroidered Chikankari cotton kurti with floral motifs.',
    fabric: '100% Cotton Cambric, hand-embroidered Chikankari work',
    careInstructions: 'Gentle hand wash or dry clean. Do not bleach. Iron on low heat inside-out.',
    categoryId: 'cat-001',
    categoryName: 'Kurtis',
    collectionIds: ['col-001', 'col-002'],
    images: [
      { id: 'img-001', url: '/demo/products/kurti-1a.jpg', alt: 'Anaya Chikankari Kurti front view', position: 1 },
      { id: 'img-002', url: '/demo/products/kurti-1b.jpg', alt: 'Anaya Chikankari Kurti detail view', position: 2 },
      { id: 'img-003', url: '/demo/products/kurti-1c.jpg', alt: 'Anaya Chikankari Kurti back view', position: 3 },
    ],
    variants: [
      { id: 'var-001', productId: 'prod-001', sku: 'LDI-ACK-WHT-XS', size: 'XS', color: 'White', colorHex: '#FAF8F5', price: 2499, compareAtPrice: 3299, quantity: 8, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-002', productId: 'prod-001', sku: 'LDI-ACK-WHT-S', size: 'S', color: 'White', colorHex: '#FAF8F5', price: 2499, compareAtPrice: 3299, quantity: 12, reservedQuantity: 1, lowStockThreshold: 3 },
      { id: 'var-003', productId: 'prod-001', sku: 'LDI-ACK-WHT-M', size: 'M', color: 'White', colorHex: '#FAF8F5', price: 2499, compareAtPrice: 3299, quantity: 15, reservedQuantity: 2, lowStockThreshold: 3 },
      { id: 'var-004', productId: 'prod-001', sku: 'LDI-ACK-WHT-L', size: 'L', color: 'White', colorHex: '#FAF8F5', price: 2499, compareAtPrice: 3299, quantity: 10, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-005', productId: 'prod-001', sku: 'LDI-ACK-WHT-XL', size: 'XL', color: 'White', colorHex: '#FAF8F5', price: 2499, compareAtPrice: 3299, quantity: 6, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-006', productId: 'prod-001', sku: 'LDI-ACK-SKY-S', size: 'S', color: 'Sky Blue', colorHex: '#B0D4E8', price: 2499, compareAtPrice: 3299, quantity: 9, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-007', productId: 'prod-001', sku: 'LDI-ACK-SKY-M', size: 'M', color: 'Sky Blue', colorHex: '#B0D4E8', price: 2499, compareAtPrice: 3299, quantity: 11, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-008', productId: 'prod-001', sku: 'LDI-ACK-SKY-L', size: 'L', color: 'Sky Blue', colorHex: '#B0D4E8', price: 2499, compareAtPrice: 3299, quantity: 7, reservedQuantity: 0, lowStockThreshold: 3 },
    ],
    tags: ['chikankari', 'cotton', 'handembroidered', 'casual', 'workwear'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'prod-002',
    name: 'Meera Block-Print Co-ord Set',
    slug: 'meera-block-print-co-ord-set',
    description: 'A relaxed-fit co-ord set featuring traditional Jaipur block-printing on breathable cotton. The short kurta top pairs beautifully with the wide-leg palazzo pants, creating a balanced silhouette that moves gracefully. Perfect for brunch, travel, or a creative workday.',
    shortDescription: 'Jaipur block-print cotton co-ord set with palazzo pants.',
    fabric: '100% Organic Cotton, hand block-printed with natural dyes',
    careInstructions: 'Hand wash separately in cold water. Colours may bleed on first wash. Dry in shade.',
    categoryId: 'cat-002',
    categoryName: 'Co-ord Sets',
    collectionIds: ['col-001', 'col-004'],
    images: [
      { id: 'img-004', url: '/demo/products/coord-1a.jpg', alt: 'Meera Block-Print Co-ord Set front view', position: 1 },
      { id: 'img-005', url: '/demo/products/coord-1b.jpg', alt: 'Meera Block-Print Co-ord Set detail', position: 2 },
    ],
    variants: [
      { id: 'var-009', productId: 'prod-002', sku: 'LDI-MBC-IND-S', size: 'S', color: 'Indigo', colorHex: '#3F5277', price: 3299, quantity: 10, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-010', productId: 'prod-002', sku: 'LDI-MBC-IND-M', size: 'M', color: 'Indigo', colorHex: '#3F5277', price: 3299, quantity: 14, reservedQuantity: 1, lowStockThreshold: 3 },
      { id: 'var-011', productId: 'prod-002', sku: 'LDI-MBC-IND-L', size: 'L', color: 'Indigo', colorHex: '#3F5277', price: 3299, quantity: 8, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-012', productId: 'prod-002', sku: 'LDI-MBC-IND-XL', size: 'XL', color: 'Indigo', colorHex: '#3F5277', price: 3299, quantity: 5, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-013', productId: 'prod-002', sku: 'LDI-MBC-RST-S', size: 'S', color: 'Rust', colorHex: '#B86B4A', price: 3299, quantity: 7, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-014', productId: 'prod-002', sku: 'LDI-MBC-RST-M', size: 'M', color: 'Rust', colorHex: '#B86B4A', price: 3299, quantity: 12, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-015', productId: 'prod-002', sku: 'LDI-MBC-RST-L', size: 'L', color: 'Rust', colorHex: '#B86B4A', price: 3299, quantity: 9, reservedQuantity: 0, lowStockThreshold: 3 },
    ],
    tags: ['blockprint', 'coord', 'cotton', 'jaipur', 'casual'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'prod-003',
    name: 'Zara Silk Anarkali Dress',
    slug: 'zara-silk-anarkali-dress',
    description: 'A floor-length Anarkali dress in lustrous chanderi silk, featuring a fitted bodice with delicate gota patti work and a flowing, flared skirt. The V-neckline and three-quarter sleeves add a contemporary touch to this classic silhouette. Includes a matching dupatta.',
    shortDescription: 'Chanderi silk Anarkali with gota patti work and dupatta.',
    fabric: 'Chanderi Silk with gota patti embroidery. Lining: Cotton.',
    careInstructions: 'Dry clean only. Store on padded hanger. Do not iron directly on embroidery.',
    categoryId: 'cat-004',
    categoryName: 'Festive Wear',
    collectionIds: ['col-003', 'col-002'],
    images: [
      { id: 'img-006', url: '/demo/products/anarkali-1a.jpg', alt: 'Zara Silk Anarkali Dress front view', position: 1 },
      { id: 'img-007', url: '/demo/products/anarkali-1b.jpg', alt: 'Zara Silk Anarkali Dress embroidery detail', position: 2 },
      { id: 'img-008', url: '/demo/products/anarkali-1c.jpg', alt: 'Zara Silk Anarkali Dress with dupatta', position: 3 },
    ],
    variants: [
      { id: 'var-016', productId: 'prod-003', sku: 'LDI-ZSA-DRO-XS', size: 'XS', color: 'Dusty Rose', colorHex: '#D4A5A5', price: 5999, quantity: 4, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-017', productId: 'prod-003', sku: 'LDI-ZSA-DRO-S', size: 'S', color: 'Dusty Rose', colorHex: '#D4A5A5', price: 5999, quantity: 6, reservedQuantity: 1, lowStockThreshold: 2 },
      { id: 'var-018', productId: 'prod-003', sku: 'LDI-ZSA-DRO-M', size: 'M', color: 'Dusty Rose', colorHex: '#D4A5A5', price: 5999, quantity: 8, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-019', productId: 'prod-003', sku: 'LDI-ZSA-DRO-L', size: 'L', color: 'Dusty Rose', colorHex: '#D4A5A5', price: 5999, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-020', productId: 'prod-003', sku: 'LDI-ZSA-SGR-S', size: 'S', color: 'Sage Green', colorHex: '#A8B5A0', price: 5999, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-021', productId: 'prod-003', sku: 'LDI-ZSA-SGR-M', size: 'M', color: 'Sage Green', colorHex: '#A8B5A0', price: 5999, quantity: 7, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-022', productId: 'prod-003', sku: 'LDI-ZSA-SGR-L', size: 'L', color: 'Sage Green', colorHex: '#A8B5A0', price: 5999, quantity: 3, reservedQuantity: 0, lowStockThreshold: 2 },
    ],
    tags: ['silk', 'anarkali', 'festive', 'gotapatti', 'wedding'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z',
  },
  {
    id: 'prod-004',
    name: 'Priya Linen A-Line Dress',
    slug: 'priya-linen-a-line-dress',
    description: 'A minimalist A-line dress cut from premium European linen. Features a boat neckline, concealed side pockets, and a relaxed yet structured fit that drapes beautifully. The kind of dress that becomes a weekday staple and a weekend favourite.',
    shortDescription: 'Premium linen A-line dress with pockets and boat neckline.',
    fabric: '100% European Linen',
    careInstructions: 'Machine wash cold on gentle cycle. Tumble dry low or line dry. Iron while slightly damp.',
    categoryId: 'cat-003',
    categoryName: 'Dresses',
    collectionIds: ['col-004', 'col-005'],
    images: [
      { id: 'img-009', url: '/demo/products/dress-1a.jpg', alt: 'Priya Linen A-Line Dress front view', position: 1 },
      { id: 'img-010', url: '/demo/products/dress-1b.jpg', alt: 'Priya Linen A-Line Dress side view', position: 2 },
    ],
    variants: [
      { id: 'var-023', productId: 'prod-004', sku: 'LDI-PLD-OAT-XS', size: 'XS', color: 'Oatmeal', colorHex: '#D4C9B0', price: 3799, quantity: 6, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-024', productId: 'prod-004', sku: 'LDI-PLD-OAT-S', size: 'S', color: 'Oatmeal', colorHex: '#D4C9B0', price: 3799, quantity: 10, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-025', productId: 'prod-004', sku: 'LDI-PLD-OAT-M', size: 'M', color: 'Oatmeal', colorHex: '#D4C9B0', price: 3799, quantity: 13, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-026', productId: 'prod-004', sku: 'LDI-PLD-OAT-L', size: 'L', color: 'Oatmeal', colorHex: '#D4C9B0', price: 3799, quantity: 9, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-027', productId: 'prod-004', sku: 'LDI-PLD-OAT-XL', size: 'XL', color: 'Oatmeal', colorHex: '#D4C9B0', price: 3799, quantity: 5, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-028', productId: 'prod-004', sku: 'LDI-PLD-OLV-S', size: 'S', color: 'Olive', colorHex: '#8B8B6A', price: 3799, quantity: 8, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-029', productId: 'prod-004', sku: 'LDI-PLD-OLV-M', size: 'M', color: 'Olive', colorHex: '#8B8B6A', price: 3799, quantity: 11, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-030', productId: 'prod-004', sku: 'LDI-PLD-OLV-L', size: 'L', color: 'Olive', colorHex: '#8B8B6A', price: 3799, quantity: 7, reservedQuantity: 0, lowStockThreshold: 3 },
    ],
    tags: ['linen', 'minimal', 'casual', 'summer', 'everyday'],
    isActive: true,
    isFeatured: false,
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-12T10:00:00Z',
  },
  {
    id: 'prod-005',
    name: 'Noor Embroidered Kurta Set',
    slug: 'noor-embroidered-kurta-set',
    description: 'A beautifully detailed kurta and pants set with intricate thread embroidery inspired by Mughal jaali patterns. The straight-cut kurta features a round neckline with a notch, side slits, and a matching pair of tapered pants. An elegant choice for festive gatherings and formal events.',
    shortDescription: 'Thread-embroidered kurta set with Mughal-inspired motifs.',
    fabric: 'Viscose Rayon with thread embroidery. Pants: Cotton Flex.',
    careInstructions: 'Dry clean recommended for first wash. Subsequent washes: gentle hand wash in cold water.',
    categoryId: 'cat-004',
    categoryName: 'Festive Wear',
    collectionIds: ['col-003'],
    images: [
      { id: 'img-011', url: '/demo/products/kurta-set-1a.jpg', alt: 'Noor Embroidered Kurta Set front view', position: 1 },
      { id: 'img-012', url: '/demo/products/kurta-set-1b.jpg', alt: 'Noor Embroidered Kurta Set embroidery detail', position: 2 },
      { id: 'img-013', url: '/demo/products/kurta-set-1c.jpg', alt: 'Noor Embroidered Kurta Set back view', position: 3 },
    ],
    variants: [
      { id: 'var-031', productId: 'prod-005', sku: 'LDI-NEK-MAR-S', size: 'S', color: 'Maroon', colorHex: '#6B2737', price: 4599, quantity: 6, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-032', productId: 'prod-005', sku: 'LDI-NEK-MAR-M', size: 'M', color: 'Maroon', colorHex: '#6B2737', price: 4599, quantity: 9, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-033', productId: 'prod-005', sku: 'LDI-NEK-MAR-L', size: 'L', color: 'Maroon', colorHex: '#6B2737', price: 4599, quantity: 7, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-034', productId: 'prod-005', sku: 'LDI-NEK-MAR-XL', size: 'XL', color: 'Maroon', colorHex: '#6B2737', price: 4599, quantity: 4, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-035', productId: 'prod-005', sku: 'LDI-NEK-NVY-S', size: 'S', color: 'Navy', colorHex: '#2C3E5A', price: 4599, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-036', productId: 'prod-005', sku: 'LDI-NEK-NVY-M', size: 'M', color: 'Navy', colorHex: '#2C3E5A', price: 4599, quantity: 8, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-037', productId: 'prod-005', sku: 'LDI-NEK-NVY-L', size: 'L', color: 'Navy', colorHex: '#2C3E5A', price: 4599, quantity: 6, reservedQuantity: 0, lowStockThreshold: 2 },
    ],
    tags: ['embroidered', 'festive', 'formal', 'kurta-set', 'mughal'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'prod-006',
    name: 'Riya Pintuck Cotton Kurti',
    slug: 'riya-pintuck-cotton-kurti',
    description: 'A versatile cotton kurti with pintuck detailing along the front yoke. The relaxed straight-cut silhouette, roll-up sleeves, and curved hem make this an ideal everyday piece. Pair it with jeans, palazzos, or leggings for an effortlessly put-together look.',
    shortDescription: 'Pintuck-detailed straight-cut cotton kurti for everyday wear.',
    fabric: '100% Cotton, pre-washed for softness',
    careInstructions: 'Machine wash cold. Tumble dry low. Iron on medium heat.',
    categoryId: 'cat-001',
    categoryName: 'Kurtis',
    collectionIds: ['col-005'],
    images: [
      { id: 'img-014', url: '/demo/products/kurti-2a.jpg', alt: 'Riya Pintuck Cotton Kurti front view', position: 1 },
      { id: 'img-015', url: '/demo/products/kurti-2b.jpg', alt: 'Riya Pintuck Cotton Kurti detail', position: 2 },
    ],
    variants: [
      { id: 'var-038', productId: 'prod-006', sku: 'LDI-RPC-MUS-S', size: 'S', color: 'Mustard', colorHex: '#C9A84C', price: 1899, quantity: 15, reservedQuantity: 0, lowStockThreshold: 5 },
      { id: 'var-039', productId: 'prod-006', sku: 'LDI-RPC-MUS-M', size: 'M', color: 'Mustard', colorHex: '#C9A84C', price: 1899, quantity: 20, reservedQuantity: 2, lowStockThreshold: 5 },
      { id: 'var-040', productId: 'prod-006', sku: 'LDI-RPC-MUS-L', size: 'L', color: 'Mustard', colorHex: '#C9A84C', price: 1899, quantity: 18, reservedQuantity: 0, lowStockThreshold: 5 },
      { id: 'var-041', productId: 'prod-006', sku: 'LDI-RPC-MUS-XL', size: 'XL', color: 'Mustard', colorHex: '#C9A84C', price: 1899, quantity: 12, reservedQuantity: 0, lowStockThreshold: 5 },
      { id: 'var-042', productId: 'prod-006', sku: 'LDI-RPC-ECR-S', size: 'S', color: 'Ecru', colorHex: '#E8DFC9', price: 1899, quantity: 14, reservedQuantity: 0, lowStockThreshold: 5 },
      { id: 'var-043', productId: 'prod-006', sku: 'LDI-RPC-ECR-M', size: 'M', color: 'Ecru', colorHex: '#E8DFC9', price: 1899, quantity: 22, reservedQuantity: 1, lowStockThreshold: 5 },
      { id: 'var-044', productId: 'prod-006', sku: 'LDI-RPC-ECR-L', size: 'L', color: 'Ecru', colorHex: '#E8DFC9', price: 1899, quantity: 16, reservedQuantity: 0, lowStockThreshold: 5 },
    ],
    tags: ['cotton', 'pintuck', 'everyday', 'casual', 'workwear'],
    isActive: true,
    isFeatured: false,
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'prod-007',
    name: 'Isha Ikat Co-ord Set',
    slug: 'isha-ikat-co-ord-set',
    description: 'Inspired by the ancient Ikat weaving tradition of Telangana, this co-ord set features a cropped boxy top with kimono sleeves and high-waisted culottes. The handloom fabric develops character with every wear, making each piece uniquely yours.',
    shortDescription: 'Handloom Ikat-weave co-ord set with cropped top and culottes.',
    fabric: 'Handloom Ikat Cotton, naturally dyed',
    careInstructions: 'Hand wash in cold water with mild detergent. Do not wring. Dry flat in shade.',
    categoryId: 'cat-002',
    categoryName: 'Co-ord Sets',
    collectionIds: ['col-001', 'col-005'],
    images: [
      { id: 'img-016', url: '/demo/products/coord-2a.jpg', alt: 'Isha Ikat Co-ord Set front view', position: 1 },
      { id: 'img-017', url: '/demo/products/coord-2b.jpg', alt: 'Isha Ikat Co-ord Set fabric detail', position: 2 },
    ],
    variants: [
      { id: 'var-045', productId: 'prod-007', sku: 'LDI-IIC-BLK-S', size: 'S', color: 'Black & Red', colorHex: '#2A2A2A', price: 3699, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-046', productId: 'prod-007', sku: 'LDI-IIC-BLK-M', size: 'M', color: 'Black & Red', colorHex: '#2A2A2A', price: 3699, quantity: 8, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-047', productId: 'prod-007', sku: 'LDI-IIC-BLK-L', size: 'L', color: 'Black & Red', colorHex: '#2A2A2A', price: 3699, quantity: 6, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-048', productId: 'prod-007', sku: 'LDI-IIC-TEL-S', size: 'S', color: 'Teal & Gold', colorHex: '#367588', price: 3699, quantity: 4, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-049', productId: 'prod-007', sku: 'LDI-IIC-TEL-M', size: 'M', color: 'Teal & Gold', colorHex: '#367588', price: 3699, quantity: 7, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-050', productId: 'prod-007', sku: 'LDI-IIC-TEL-L', size: 'L', color: 'Teal & Gold', colorHex: '#367588', price: 3699, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
    ],
    tags: ['ikat', 'handloom', 'coord', 'artisanal', 'telangana'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'prod-008',
    name: 'Kavya Floral Midi Dress',
    slug: 'kavya-floral-midi-dress',
    description: 'A romantic midi dress in flowing georgette with a watercolour floral print. Features a cinched waist, puff sleeves, and a tiered skirt that moves beautifully. The fitted bodice and V-neckline create an elegant yet relaxed silhouette perfect for garden parties and afternoon gatherings.',
    shortDescription: 'Watercolour floral georgette midi dress with tiered skirt.',
    fabric: 'Georgette with cotton lining',
    careInstructions: 'Gentle machine wash or hand wash cold. Do not tumble dry. Iron on low heat.',
    categoryId: 'cat-003',
    categoryName: 'Dresses',
    collectionIds: ['col-001', 'col-004'],
    images: [
      { id: 'img-018', url: '/demo/products/dress-2a.jpg', alt: 'Kavya Floral Midi Dress front view', position: 1 },
      { id: 'img-019', url: '/demo/products/dress-2b.jpg', alt: 'Kavya Floral Midi Dress floral detail', position: 2 },
      { id: 'img-020', url: '/demo/products/dress-2c.jpg', alt: 'Kavya Floral Midi Dress side view', position: 3 },
    ],
    variants: [
      { id: 'var-051', productId: 'prod-008', sku: 'LDI-KFM-BLU-XS', size: 'XS', color: 'Blue Floral', colorHex: '#6B8EAD', price: 2999, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-052', productId: 'prod-008', sku: 'LDI-KFM-BLU-S', size: 'S', color: 'Blue Floral', colorHex: '#6B8EAD', price: 2999, quantity: 9, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-053', productId: 'prod-008', sku: 'LDI-KFM-BLU-M', size: 'M', color: 'Blue Floral', colorHex: '#6B8EAD', price: 2999, quantity: 12, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-054', productId: 'prod-008', sku: 'LDI-KFM-BLU-L', size: 'L', color: 'Blue Floral', colorHex: '#6B8EAD', price: 2999, quantity: 8, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-055', productId: 'prod-008', sku: 'LDI-KFM-PNK-S', size: 'S', color: 'Pink Floral', colorHex: '#D4909C', price: 2999, quantity: 7, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-056', productId: 'prod-008', sku: 'LDI-KFM-PNK-M', size: 'M', color: 'Pink Floral', colorHex: '#D4909C', price: 2999, quantity: 10, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-057', productId: 'prod-008', sku: 'LDI-KFM-PNK-L', size: 'L', color: 'Pink Floral', colorHex: '#D4909C', price: 2999, quantity: 6, reservedQuantity: 0, lowStockThreshold: 2 },
    ],
    tags: ['floral', 'georgette', 'midi', 'romantic', 'party'],
    isActive: true,
    isFeatured: false,
    createdAt: '2026-10-12T10:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'prod-009',
    name: 'Tara Khadi Everyday Kurti',
    slug: 'tara-khadi-everyday-kurti',
    description: 'Woven on a handloom from Khadi cotton, this everyday kurti celebrates the beauty of imperfect textures. The relaxed-fit silhouette features a stand collar, rolled-up sleeves with tab closures, and a curved hemline. A conscious wardrobe essential.',
    shortDescription: 'Handspun Khadi cotton kurti with stand collar and rolled sleeves.',
    fabric: 'Handspun Khadi Cotton',
    careInstructions: 'Hand wash in cold water. Use mild soap. Dry flat. Iron while damp. Khadi fabric softens with every wash.',
    categoryId: 'cat-005',
    categoryName: 'Everyday Wear',
    collectionIds: ['col-005'],
    images: [
      { id: 'img-021', url: '/demo/products/kurti-3a.jpg', alt: 'Tara Khadi Everyday Kurti front view', position: 1 },
      { id: 'img-022', url: '/demo/products/kurti-3b.jpg', alt: 'Tara Khadi Everyday Kurti fabric texture', position: 2 },
    ],
    variants: [
      { id: 'var-058', productId: 'prod-009', sku: 'LDI-TKE-NAT-S', size: 'S', color: 'Natural', colorHex: '#E8DCC8', price: 2199, quantity: 10, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-059', productId: 'prod-009', sku: 'LDI-TKE-NAT-M', size: 'M', color: 'Natural', colorHex: '#E8DCC8', price: 2199, quantity: 14, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-060', productId: 'prod-009', sku: 'LDI-TKE-NAT-L', size: 'L', color: 'Natural', colorHex: '#E8DCC8', price: 2199, quantity: 11, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-061', productId: 'prod-009', sku: 'LDI-TKE-NAT-XL', size: 'XL', color: 'Natural', colorHex: '#E8DCC8', price: 2199, quantity: 8, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-062', productId: 'prod-009', sku: 'LDI-TKE-CHR-S', size: 'S', color: 'Charcoal', colorHex: '#4A4A4A', price: 2199, quantity: 9, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-063', productId: 'prod-009', sku: 'LDI-TKE-CHR-M', size: 'M', color: 'Charcoal', colorHex: '#4A4A4A', price: 2199, quantity: 12, reservedQuantity: 0, lowStockThreshold: 3 },
      { id: 'var-064', productId: 'prod-009', sku: 'LDI-TKE-CHR-L', size: 'L', color: 'Charcoal', colorHex: '#4A4A4A', price: 2199, quantity: 7, reservedQuantity: 0, lowStockThreshold: 3 },
    ],
    tags: ['khadi', 'handloom', 'everyday', 'sustainable', 'minimal'],
    isActive: true,
    isFeatured: false,
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
  {
    id: 'prod-010',
    name: 'Diya Mirror-Work Jacket',
    slug: 'diya-mirror-work-jacket',
    description: 'A statement jacket featuring Rajasthani mirror-work (Shisha embroidery) on handwoven cotton. The cropped length and boxy cut make it a versatile layering piece — throw it over a plain kurti, a simple dress, or even a classic white tee for instant elevation.',
    shortDescription: 'Rajasthani mirror-work embroidered cropped jacket.',
    fabric: 'Handwoven Cotton with mirror-work embroidery',
    careInstructions: 'Dry clean only. Do not iron directly on mirrors. Store flat.',
    categoryId: 'cat-005',
    categoryName: 'Everyday Wear',
    collectionIds: ['col-001', 'col-003'],
    images: [
      { id: 'img-023', url: '/demo/products/jacket-1a.jpg', alt: 'Diya Mirror-Work Jacket front view', position: 1 },
      { id: 'img-024', url: '/demo/products/jacket-1b.jpg', alt: 'Diya Mirror-Work Jacket mirror detail', position: 2 },
    ],
    variants: [
      { id: 'var-065', productId: 'prod-010', sku: 'LDI-DMJ-BLK-S', size: 'S', color: 'Black', colorHex: '#1A1A1A', price: 4299, quantity: 4, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-066', productId: 'prod-010', sku: 'LDI-DMJ-BLK-M', size: 'M', color: 'Black', colorHex: '#1A1A1A', price: 4299, quantity: 6, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-067', productId: 'prod-010', sku: 'LDI-DMJ-BLK-L', size: 'L', color: 'Black', colorHex: '#1A1A1A', price: 4299, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-068', productId: 'prod-010', sku: 'LDI-DMJ-IVR-S', size: 'S', color: 'Ivory', colorHex: '#F0EBE0', price: 4299, quantity: 3, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-069', productId: 'prod-010', sku: 'LDI-DMJ-IVR-M', size: 'M', color: 'Ivory', colorHex: '#F0EBE0', price: 4299, quantity: 5, reservedQuantity: 0, lowStockThreshold: 2 },
      { id: 'var-070', productId: 'prod-010', sku: 'LDI-DMJ-IVR-L', size: 'L', color: 'Ivory', colorHex: '#F0EBE0', price: 4299, quantity: 4, reservedQuantity: 0, lowStockThreshold: 2 },
    ],
    tags: ['mirrorwork', 'jacket', 'rajasthani', 'statement', 'layering'],
    isActive: true,
    isFeatured: true,
    createdAt: '2026-10-11T10:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
  },
];

// ── Helper functions ─────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return demoProducts.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return demoProducts.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = demoCategories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return demoProducts.filter(p => p.categoryId === category.id && p.isActive);
}

export function getProductsByCollection(collectionId: string): Product[] {
  return demoProducts.filter(p => p.collectionIds.includes(collectionId) && p.isActive);
}

export function getFeaturedProducts(): Product[] {
  return demoProducts.filter(p => p.isFeatured && p.isActive);
}

export function getNewArrivals(): Product[] {
  return [...demoProducts]
    .filter(p => p.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return demoProducts.filter(p =>
    p.isActive && (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.categoryName.toLowerCase().includes(q)
    )
  );
}

export function getMinPrice(product: Product): number {
  return Math.min(...product.variants.map(v => v.price));
}

export function getMaxPrice(product: Product): number {
  return Math.max(...product.variants.map(v => v.price));
}

export function getAvailableSizes(product: Product): string[] {
  const sizes = [...new Set(product.variants.filter(v => v.quantity > v.reservedQuantity).map(v => v.size))];
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
  return sizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
}

export function getAvailableColors(product: Product): { name: string; hex: string }[] {
  const colorMap = new Map<string, string>();
  product.variants
    .filter(v => v.quantity > v.reservedQuantity)
    .forEach(v => {
      if (!colorMap.has(v.color)) {
        colorMap.set(v.color, v.colorHex || '#ccc');
      }
    });
  return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
}

export function getVariant(product: Product, size: string, color: string) {
  return product.variants.find(v => v.size === size && v.color === color);
}

export function isInStock(variant: { quantity: number; reservedQuantity: number }): boolean {
  return variant.quantity - variant.reservedQuantity > 0;
}

export function getAvailableQuantity(variant: { quantity: number; reservedQuantity: number }): number {
  return Math.max(0, variant.quantity - variant.reservedQuantity);
}

// ── Demo Vendors ─────────────────────────────────────────────

export const demoVendors: Vendor[] = [
  {
    id: 'ven-001',
    name: 'Lucknow Chikan House',
    contactPerson: 'Rafiq Ahmed',
    phone: '+91 98765 43210',
    email: 'rafiq@lucknowchikan.demo',
    address: 'Aminabad, Lucknow, Uttar Pradesh 226018',
    notes: 'Premium Chikankari artisan workshop. 15-day lead time for custom orders.',
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'ven-002',
    name: 'Jaipur Block Arts',
    contactPerson: 'Priya Meena',
    phone: '+91 87654 32109',
    email: 'priya@jaipurblockarts.demo',
    address: 'Sanganer, Jaipur, Rajasthan 302029',
    notes: 'Natural dye block-printing collective. Minimum order: 50 pieces per design.',
    isActive: true,
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'ven-003',
    name: 'Deccan Handlooms',
    contactPerson: 'Sudha Reddy',
    phone: '+91 76543 21098',
    email: 'sudha@deccanhandlooms.demo',
    address: 'Pochampally, Telangana 508284',
    notes: 'Ikat and handloom weaving cooperative. 20-day lead time.',
    isActive: true,
    createdAt: '2026-03-10T10:00:00Z',
  },
];

// ── Demo Orders (sample) ────────────────────────────────────

export const demoOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'LDI-2026-0001',
    userId: 'demo-user-001',
    items: [
      {
        id: 'oi-001',
        orderId: 'ord-001',
        productId: 'prod-001',
        variantId: 'var-003',
        name: 'Anaya Chikankari Kurti',
        image: '/demo/products/kurti-1a.jpg',
        size: 'M',
        color: 'White',
        price: 2499,
        quantity: 1,
      },
    ],
    deliveryAddress: {
      id: 'addr-001',
      fullName: 'Priya Sharma',
      phone: '+91 98765 00001',
      addressLine1: '42, Green Park Extension',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
    },
    subtotal: 2499,
    deliveryCharge: 0,
    total: 2499,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    orderStatus: 'delivered',
    createdAt: '2026-10-05T14:30:00Z',
    updatedAt: '2026-10-10T11:00:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'LDI-2026-0002',
    userId: 'demo-user-002',
    items: [
      {
        id: 'oi-002',
        orderId: 'ord-002',
        productId: 'prod-002',
        variantId: 'var-010',
        name: 'Meera Block-Print Co-ord Set',
        image: '/demo/products/coord-1a.jpg',
        size: 'M',
        color: 'Indigo',
        price: 3299,
        quantity: 1,
      },
      {
        id: 'oi-003',
        orderId: 'ord-002',
        productId: 'prod-006',
        variantId: 'var-039',
        name: 'Riya Pintuck Cotton Kurti',
        image: '/demo/products/kurti-2a.jpg',
        size: 'M',
        color: 'Mustard',
        price: 1899,
        quantity: 2,
      },
    ],
    deliveryAddress: {
      id: 'addr-002',
      fullName: 'Anita Desai',
      phone: '+91 98765 00002',
      addressLine1: '15, Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
    },
    subtotal: 7097,
    deliveryCharge: 0,
    total: 7097,
    paymentMethod: 'cod',
    paymentStatus: 'cod_pending',
    orderStatus: 'shipped',
    createdAt: '2026-10-12T09:15:00Z',
    updatedAt: '2026-10-14T16:00:00Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'LDI-2026-0003',
    items: [
      {
        id: 'oi-004',
        orderId: 'ord-003',
        productId: 'prod-003',
        variantId: 'var-018',
        name: 'Zara Silk Anarkali Dress',
        image: '/demo/products/anarkali-1a.jpg',
        size: 'M',
        color: 'Dusty Rose',
        price: 5999,
        quantity: 1,
      },
    ],
    deliveryAddress: {
      id: 'addr-003',
      fullName: 'Meena Iyer',
      phone: '+91 98765 00003',
      addressLine1: '28, MG Road',
      addressLine2: 'Apt 3B, Sunflower Residency',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
    },
    subtotal: 5999,
    deliveryCharge: 0,
    total: 5999,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    createdAt: '2026-10-16T11:45:00Z',
    updatedAt: '2026-10-16T12:00:00Z',
  },
];

// ── Demo Shipments ───────────────────────────────────────────

export const demoShipments: Shipment[] = [
  {
    id: 'ship-001',
    orderId: 'ord-001',
    courierName: 'Manual Update',
    awbNumber: 'DEMO-AWB-001',
    status: 'delivered',
    events: [
      { id: 'se-001', shipmentId: 'ship-001', status: 'created', description: 'Shipment created', timestamp: '2026-10-06T10:00:00Z', isManual: true },
      { id: 'se-002', shipmentId: 'ship-001', status: 'picked_up', description: 'Package picked up from warehouse', location: 'Delhi', timestamp: '2026-10-07T09:00:00Z', isManual: true },
      { id: 'se-003', shipmentId: 'ship-001', status: 'in_transit', description: 'Package in transit', location: 'Delhi Hub', timestamp: '2026-10-07T18:00:00Z', isManual: true },
      { id: 'se-004', shipmentId: 'ship-001', status: 'out_for_delivery', description: 'Out for delivery', location: 'New Delhi', timestamp: '2026-10-10T08:00:00Z', isManual: true },
      { id: 'se-005', shipmentId: 'ship-001', status: 'delivered', description: 'Delivered — [DEMO DATA]', location: 'New Delhi', timestamp: '2026-10-10T11:00:00Z', isManual: true },
    ],
    createdAt: '2026-10-06T10:00:00Z',
    updatedAt: '2026-10-10T11:00:00Z',
  },
  {
    id: 'ship-002',
    orderId: 'ord-002',
    courierName: 'Manual Update',
    awbNumber: 'DEMO-AWB-002',
    status: 'in_transit',
    estimatedDelivery: '2026-10-19T18:00:00Z',
    events: [
      { id: 'se-006', shipmentId: 'ship-002', status: 'created', description: 'Shipment created', timestamp: '2026-10-13T10:00:00Z', isManual: true },
      { id: 'se-007', shipmentId: 'ship-002', status: 'picked_up', description: 'Package picked up from warehouse', location: 'Delhi', timestamp: '2026-10-14T09:00:00Z', isManual: true },
      { id: 'se-008', shipmentId: 'ship-002', status: 'in_transit', description: 'Package in transit — [DEMO DATA]', location: 'Bengaluru Hub', timestamp: '2026-10-14T16:00:00Z', isManual: true },
    ],
    createdAt: '2026-10-13T10:00:00Z',
    updatedAt: '2026-10-14T16:00:00Z',
  },
];

// ── Demo COD Settlements ────────────────────────────────────

export const demoCodSettlements: CodSettlement[] = [
  {
    id: 'set-001',
    orderId: 'ord-001',
    orderNumber: 'LDI-2026-0001',
    expectedAmount: 2499,
    collectedAmount: 2499,
    deductions: 50,
    settledAmount: 2449,
    settlementReference: 'DEMO-SETTLE-001',
    settlementDate: '2026-10-15T10:00:00Z',
    status: 'settled',
    courierName: 'Manual Update',
    notes: '[DEMO DATA] Settlement example',
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-10-15T10:00:00Z',
  },
];

// ── Demo Purchase Orders ────────────────────────────────────

export const demoPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-2026-001',
    vendorId: 'ven-001',
    vendorName: 'Lucknow Chikan House',
    items: [
      {
        id: 'poi-001', purchaseOrderId: 'po-001',
        productId: 'prod-001', variantId: 'var-001',
        productName: 'Anaya Chikankari Kurti', size: 'XS', color: 'White',
        orderedQuantity: 20, receivedQuantity: 20, damagedQuantity: 0,
        costPerUnit: 950,
      },
      {
        id: 'poi-002', purchaseOrderId: 'po-001',
        productId: 'prod-001', variantId: 'var-002',
        productName: 'Anaya Chikankari Kurti', size: 'S', color: 'White',
        orderedQuantity: 25, receivedQuantity: 25, damagedQuantity: 1,
        costPerUnit: 950,
      },
    ],
    status: 'received',
    orderDate: '2026-08-15T10:00:00Z',
    expectedArrival: '2026-09-01T10:00:00Z',
    trackingNumber: 'DEMO-VENDOR-SHIP-001',
    totalCost: 42750,
    notes: '[DEMO DATA] Initial stock order',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
];

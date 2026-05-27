import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Limpiar datos anteriores ──────────────────────────
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('🗑️  Datos anteriores eliminados');

  // ── Categorías ────────────────────────────────────────
  const cats = await prisma.category.createMany({
    data: [
      { name: 'Laptops',           slug: 'laptops' },
      { name: 'Monitores',         slug: 'monitores' },
      { name: 'Teclados',          slug: 'teclados' },
      { name: 'Mouse',             slug: 'mouse' },
      { name: 'Auriculares',       slug: 'auriculares' },
      { name: 'Placas de Video',   slug: 'placas-de-video' },
      { name: 'Procesadores',      slug: 'procesadores' },
      { name: 'Memorias RAM',      slug: 'memorias-ram' },
      { name: 'Almacenamiento',    slug: 'almacenamiento' },
      { name: 'Gabinetes',         slug: 'gabinetes' },
    ],
  });
  console.log(`✅ ${cats.count} categorías creadas`);

  const categories = await prisma.category.findMany();
  const catMap: Record<string, number> = {};
  categories.forEach(c => { catMap[c.slug] = c.id; });

  // ── Helper para crear producto ────────────────────────
  const makeProduct = async (
    name: string,
    slug: string,
    description: string,
    categorySlug: string,
    images: { url: string; alt: string; isPrimary: boolean; sortOrder: number }[],
    variants: { sku: string; price: number; stock: number; attributes: Record<string, string> }[]
  ) => {
    return prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: catMap[categorySlug],
        images:   { create: images },
        variants: { create: variants },
      },
    });
  };

  const products = [
    // ── LAPTOPS (15) ──────────────────────────────────────
    await makeProduct(
      'ASUS ROG Strix G16', 'asus-rog-strix-g16',
      'Laptop gamer con pantalla 165Hz y RTX 4070',
      'laptops',
      [
        { url: 'https://placehold.co/800x800?text=ROG+Strix+G16', alt: 'ASUS ROG Strix G16', isPrimary: true, sortOrder: 0 },
        { url: 'https://placehold.co/800x800?text=ROG+Strix+Teclado', alt: 'Teclado ROG', isPrimary: false, sortOrder: 1 },
      ],
      [
        { sku: 'ROG-G16-16-512', price: 1499, stock: 8,  attributes: { ram: '16GB', storage: '512GB', color: 'Negro' } },
        { sku: 'ROG-G16-32-1TB', price: 1899, stock: 4,  attributes: { ram: '32GB', storage: '1TB',   color: 'Negro' } },
      ]
    ),
    await makeProduct(
      'Lenovo ThinkPad X1 Carbon', 'lenovo-thinkpad-x1-carbon',
      'Ultrabook empresarial liviana y resistente',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=ThinkPad+X1', alt: 'ThinkPad X1 Carbon', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'X1C-16-512-W11', price: 1699, stock: 6,  attributes: { ram: '16GB', storage: '512GB', os: 'Windows 11' } },
        { sku: 'X1C-32-1TB-W11', price: 2099, stock: 3,  attributes: { ram: '32GB', storage: '1TB',   os: 'Windows 11' } },
      ]
    ),
    await makeProduct(
      'MacBook Air M3', 'macbook-air-m3',
      'La laptop más delgada de Apple con chip M3',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=MacBook+Air+M3', alt: 'MacBook Air M3', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MBA-M3-8-256-PLT', price: 1299, stock: 10, attributes: { ram: '8GB',  storage: '256GB', color: 'Plata'    } },
        { sku: 'MBA-M3-8-512-MED', price: 1499, stock: 7,  attributes: { ram: '8GB',  storage: '512GB', color: 'Medianoche' } },
        { sku: 'MBA-M3-16-512-PLT',price: 1699, stock: 4,  attributes: { ram: '16GB', storage: '512GB', color: 'Plata'    } },
      ]
    ),
    await makeProduct(
      'HP Pavilion 15', 'hp-pavilion-15',
      'Laptop para uso diario con buena relación precio-calidad',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=HP+Pavilion+15', alt: 'HP Pavilion 15', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'HPP15-8-512-AZL',  price: 699,  stock: 15, attributes: { ram: '8GB',  storage: '512GB', color: 'Azul'   } },
        { sku: 'HPP15-16-512-SIL', price: 849,  stock: 10, attributes: { ram: '16GB', storage: '512GB', color: 'Plata'  } },
      ]
    ),
    await makeProduct(
      'Dell XPS 15', 'dell-xps-15',
      'Laptop premium con pantalla OLED 4K',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=Dell+XPS+15', alt: 'Dell XPS 15', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'XPS15-16-512', price: 1899, stock: 5,  attributes: { ram: '16GB', storage: '512GB', pantalla: 'FHD' } },
        { sku: 'XPS15-32-1TB', price: 2399, stock: 3,  attributes: { ram: '32GB', storage: '1TB',   pantalla: '4K OLED' } },
      ]
    ),
    await makeProduct(
      'Acer Nitro 5', 'acer-nitro-5',
      'Laptop gaming de entrada con RTX 3050',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=Acer+Nitro+5', alt: 'Acer Nitro 5', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'AN5-8-512-NGR',  price: 799,  stock: 12, attributes: { ram: '8GB',  storage: '512GB', color: 'Negro' } },
        { sku: 'AN5-16-512-NGR', price: 999,  stock: 8,  attributes: { ram: '16GB', storage: '512GB', color: 'Negro' } },
      ]
    ),
    await makeProduct(
      'MSI Prestige 14', 'msi-prestige-14',
      'Laptop creativa ultradelgada para diseñadores',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=MSI+Prestige+14', alt: 'MSI Prestige 14', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MSI-P14-16-512-ROS', price: 1099, stock: 6, attributes: { ram: '16GB', storage: '512GB', color: 'Rosa'  } },
        { sku: 'MSI-P14-16-512-BLK', price: 1099, stock: 6, attributes: { ram: '16GB', storage: '512GB', color: 'Negro' } },
      ]
    ),
    await makeProduct(
      'Lenovo IdeaPad Gaming 3', 'lenovo-ideapad-gaming-3',
      'Gaming asequible con pantalla 120Hz',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=IdeaPad+Gaming+3', alt: 'IdeaPad Gaming 3', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'IPG3-8-512',  price: 749,  stock: 14, attributes: { ram: '8GB',  storage: '512GB' } },
        { sku: 'IPG3-16-1TB', price: 949,  stock: 7,  attributes: { ram: '16GB', storage: '1TB'   } },
      ]
    ),
    await makeProduct(
      'Samsung Galaxy Book4 Pro', 'samsung-galaxy-book4-pro',
      'Laptop premium con pantalla AMOLED 3K',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=Galaxy+Book4+Pro', alt: 'Galaxy Book4 Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'GB4P-16-512-GRF', price: 1399, stock: 5, attributes: { ram: '16GB', storage: '512GB', color: 'Grafito' } },
        { sku: 'GB4P-32-1TB-GRF', price: 1799, stock: 3, attributes: { ram: '32GB', storage: '1TB',   color: 'Grafito' } },
      ]
    ),
    await makeProduct(
      'ASUS ZenBook 14 OLED', 'asus-zenbook-14-oled',
      'Ultrabook con pantalla OLED vibrante',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=ZenBook+14+OLED', alt: 'ZenBook 14 OLED', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'ZB14-16-512-BEI', price: 1099, stock: 8, attributes: { ram: '16GB', storage: '512GB', color: 'Beige' } },
        { sku: 'ZB14-16-512-BLK', price: 1099, stock: 6, attributes: { ram: '16GB', storage: '512GB', color: 'Negro' } },
      ]
    ),
    await makeProduct(
      'Razer Blade 15', 'razer-blade-15',
      'Laptop gaming premium con diseño fino',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=Razer+Blade+15', alt: 'Razer Blade 15', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'RB15-16-512', price: 2299, stock: 4, attributes: { ram: '16GB', storage: '512GB', gpu: 'RTX 4070' } },
        { sku: 'RB15-32-1TB', price: 2799, stock: 2, attributes: { ram: '32GB', storage: '1TB',   gpu: 'RTX 4080' } },
      ]
    ),
    await makeProduct(
      'Huawei MateBook D15', 'huawei-matebook-d15',
      'Laptop elegante para trabajo y estudio',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=MateBook+D15', alt: 'MateBook D15', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MBD15-8-256-GRI',  price: 599,  stock: 20, attributes: { ram: '8GB',  storage: '256GB', color: 'Gris'  } },
        { sku: 'MBD15-16-512-GRI', price: 749,  stock: 12, attributes: { ram: '16GB', storage: '512GB', color: 'Gris'  } },
      ]
    ),
    await makeProduct(
      'HP OMEN 16', 'hp-omen-16',
      'Laptop gaming con pantalla QHD 165Hz',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=HP+OMEN+16', alt: 'HP OMEN 16', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'OMEN16-16-512', price: 1299, stock: 7, attributes: { ram: '16GB', storage: '512GB', gpu: 'RTX 4060' } },
        { sku: 'OMEN16-32-1TB', price: 1699, stock: 4, attributes: { ram: '32GB', storage: '1TB',   gpu: 'RTX 4070' } },
      ]
    ),
    await makeProduct(
      'Apple MacBook Pro 14 M3', 'macbook-pro-14-m3',
      'El MacBook Pro más potente con chip M3 Pro',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=MacBook+Pro+14', alt: 'MacBook Pro 14', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MBP14-18-512-SPC', price: 1999, stock: 5, attributes: { ram: '18GB', storage: '512GB', color: 'Gris espacial' } },
        { sku: 'MBP14-36-1TB-SPC', price: 2799, stock: 3, attributes: { ram: '36GB', storage: '1TB',   color: 'Gris espacial' } },
      ]
    ),
    await makeProduct(
      'Gigabyte AORUS 15', 'gigabyte-aorus-15',
      'Laptop gaming con pantalla OLED 240Hz',
      'laptops',
      [{ url: 'https://placehold.co/800x800?text=AORUS+15', alt: 'AORUS 15', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'ARS15-16-1TB', price: 1599, stock: 5, attributes: { ram: '16GB', storage: '1TB', gpu: 'RTX 4070' } },
        { sku: 'ARS15-32-2TB', price: 2099, stock: 3, attributes: { ram: '32GB', storage: '2TB', gpu: 'RTX 4080' } },
      ]
    ),

    // ── MONITORES (10) ────────────────────────────────────
    await makeProduct(
      'LG UltraGear 27GP850', 'lg-ultragear-27gp850',
      'Monitor gaming 27" QHD 165Hz Nano IPS',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=LG+UltraGear+27', alt: 'LG UltraGear 27', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'LGG27-QHD-165', price: 349, stock: 15, attributes: { resolucion: 'QHD', frecuencia: '165Hz', panel: 'Nano IPS' } }]
    ),
    await makeProduct(
      'Samsung Odyssey G7 32"', 'samsung-odyssey-g7-32',
      'Monitor curvo 4K 144Hz para gaming y productividad',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=Odyssey+G7', alt: 'Samsung Odyssey G7', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'ODG7-4K-144', price: 699, stock: 8, attributes: { resolucion: '4K', frecuencia: '144Hz', curvatura: '1000R' } }]
    ),
    await makeProduct(
      'ASUS ProArt PA278QV', 'asus-proart-pa278qv',
      'Monitor profesional 27" QHD para diseño gráfico',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=ProArt+PA278', alt: 'ASUS ProArt PA278', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'PA278-QHD-75', price: 449, stock: 10, attributes: { resolucion: 'QHD', frecuencia: '75Hz', colorSpace: '100% sRGB' } }]
    ),
    await makeProduct(
      'Dell S2722DGM', 'dell-s2722dgm',
      'Monitor gaming curvo 27" QHD 165Hz',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=Dell+S2722', alt: 'Dell S2722DGM', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'DS27-QHD-165', price: 329, stock: 12, attributes: { resolucion: 'QHD', frecuencia: '165Hz', curvatura: '1500R' } }]
    ),
    await makeProduct(
      'BenQ MOBIUZ EX2710Q', 'benq-mobiuz-ex2710q',
      'Monitor gaming 27" QHD 165Hz con HDRi',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=BenQ+EX2710Q', alt: 'BenQ EX2710Q', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'BEX27-QHD-165', price: 379, stock: 9, attributes: { resolucion: 'QHD', frecuencia: '165Hz', hdr: 'HDRi' } }]
    ),
    await makeProduct(
      'Acer Predator XB273U', 'acer-predator-xb273u',
      'Monitor gaming 27" QHD 270Hz G-Sync',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=Predator+XB273', alt: 'Acer Predator XB273U', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'PXB27-QHD-270', price: 599, stock: 6, attributes: { resolucion: 'QHD', frecuencia: '270Hz', sync: 'G-Sync' } }]
    ),
    await makeProduct(
      'LG 34WN80C-B UltraWide', 'lg-34wn80c-ultrawide',
      'Monitor ultrawide 34" WQHD para productividad',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=LG+UltraWide+34', alt: 'LG UltraWide 34', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'LGW34-WQHD-75', price: 499, stock: 7, attributes: { resolucion: 'WQHD', frecuencia: '75Hz', aspecto: '21:9' } }]
    ),
    await makeProduct(
      'MSI Optix MAG274QRF', 'msi-optix-mag274qrf',
      'Monitor gaming 27" QHD 165Hz Rapid IPS',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=MSI+MAG274', alt: 'MSI MAG274QRF', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'MAG27-QHD-165', price: 359, stock: 11, attributes: { resolucion: 'QHD', frecuencia: '165Hz', panel: 'Rapid IPS' } }]
    ),
    await makeProduct(
      'Samsung 32" Smart Monitor M8', 'samsung-smart-monitor-m8',
      'Monitor inteligente 4K con Smart TV integrado',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=Samsung+M8', alt: 'Samsung M8', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'SM8-4K-BLC', price: 699, stock: 6, attributes: { resolucion: '4K', color: 'Blanco' } },
        { sku: 'SM8-4K-NGR', price: 699, stock: 5, attributes: { resolucion: '4K', color: 'Negro'  } },
      ]
    ),
    await makeProduct(
      'Gigabyte M27Q', 'gigabyte-m27q',
      'Monitor gaming 27" QHD 170Hz KVM',
      'monitores',
      [{ url: 'https://placehold.co/800x800?text=Gigabyte+M27Q', alt: 'Gigabyte M27Q', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'GM27Q-170', price: 299, stock: 14, attributes: { resolucion: 'QHD', frecuencia: '170Hz', kvm: 'Sí' } }]
    ),

    // ── TECLADOS (10) ─────────────────────────────────────
    await makeProduct(
      'Logitech G Pro X TKL', 'logitech-g-pro-x-tkl',
      'Teclado mecánico gaming TKL para esports',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=G+Pro+X+TKL', alt: 'Logitech G Pro X', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'GPROX-BLU-TKL', price: 149, stock: 20, attributes: { switch: 'GX Blue', layout: 'TKL', retroiluminacion: 'RGB' } },
        { sku: 'GPROX-RED-TKL', price: 149, stock: 18, attributes: { switch: 'GX Red',  layout: 'TKL', retroiluminacion: 'RGB' } },
      ]
    ),
    await makeProduct(
      'Keychron K8 Pro', 'keychron-k8-pro',
      'Teclado mecánico inalámbrico TKL para Mac y Windows',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Keychron+K8+Pro', alt: 'Keychron K8 Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'K8P-RED-BLK', price: 99,  stock: 25, attributes: { switch: 'Red', carcasa: 'Aluminio', conexion: 'BT/USB' } },
        { sku: 'K8P-BRW-BLK', price: 99,  stock: 20, attributes: { switch: 'Brown', carcasa: 'Aluminio', conexion: 'BT/USB' } },
      ]
    ),
    await makeProduct(
      'Corsair K70 RGB MK.2', 'corsair-k70-rgb-mk2',
      'Teclado mecánico gaming full size con Cherry MX',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Corsair+K70', alt: 'Corsair K70 RGB', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'K70-RED-FS',  price: 139, stock: 15, attributes: { switch: 'Cherry MX Red',   layout: 'Full Size' } },
        { sku: 'K70-BLUE-FS', price: 139, stock: 12, attributes: { switch: 'Cherry MX Blue',  layout: 'Full Size' } },
        { sku: 'K70-SPED-FS', price: 139, stock: 10, attributes: { switch: 'Cherry MX Speed', layout: 'Full Size' } },
      ]
    ),
    await makeProduct(
      'Razer BlackWidow V4', 'razer-blackwidow-v4',
      'Teclado mecánico gaming con Razer Green switches',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=BlackWidow+V4', alt: 'Razer BlackWidow V4', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'BWV4-GRN-FS', price: 159, stock: 14, attributes: { switch: 'Razer Green',  layout: 'Full Size' } },
        { sku: 'BWV4-YLW-FS', price: 159, stock: 11, attributes: { switch: 'Razer Yellow', layout: 'Full Size' } },
      ]
    ),
    await makeProduct(
      'SteelSeries Apex Pro TKL', 'steelseries-apex-pro-tkl',
      'Teclado con switches ajustables OmniPoint 2.0',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Apex+Pro+TKL', alt: 'SteelSeries Apex Pro', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'APRO-TKL-BLK', price: 199, stock: 10, attributes: { switch: 'OmniPoint 2.0', layout: 'TKL', display: 'OLED' } }]
    ),
    await makeProduct(
      'Logitech MX Keys S', 'logitech-mx-keys-s',
      'Teclado inalámbrico premium para productividad',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=MX+Keys+S', alt: 'Logitech MX Keys S', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MXKS-GRF-ESP', price: 119, stock: 18, attributes: { color: 'Grafito', layout: 'Español', conexion: 'BT/USB' } },
        { sku: 'MXKS-PAL-ESP', price: 119, stock: 15, attributes: { color: 'Pálido',  layout: 'Español', conexion: 'BT/USB' } },
      ]
    ),
    await makeProduct(
      'HyperX Alloy Origins 65', 'hyperx-alloy-origins-65',
      'Teclado mecánico compacto 65% con switches HyperX',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Alloy+Origins+65', alt: 'HyperX Origins 65', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'AO65-RED', price: 89,  stock: 22, attributes: { switch: 'HyperX Red',   layout: '65%' } },
        { sku: 'AO65-AQU', price: 89,  stock: 18, attributes: { switch: 'HyperX Aqua',  layout: '65%' } },
      ]
    ),
    await makeProduct(
      'Ducky One 3 Mini', 'ducky-one-3-mini',
      'Teclado mecánico 60% de alta calidad',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Ducky+One+3', alt: 'Ducky One 3 Mini', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'DO3M-RED-BLK', price: 109, stock: 12, attributes: { switch: 'Cherry Red',   layout: '60%', color: 'Negro' } },
        { sku: 'DO3M-BRW-WHT', price: 109, stock: 10, attributes: { switch: 'Cherry Brown', layout: '60%', color: 'Blanco' } },
      ]
    ),
    await makeProduct(
      'ASUS ROG Claymore II', 'asus-rog-claymore-ii',
      'Teclado mecánico modular con numpad desmontable',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=ROG+Claymore+II', alt: 'ROG Claymore II', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'ROGCII-RED', price: 249, stock: 6, attributes: { switch: 'ROG RX Red', layout: 'Modular', conexion: 'BT/USB' } }]
    ),
    await makeProduct(
      'Anne Pro 2', 'anne-pro-2',
      'Teclado mecánico 60% inalámbrico económico',
      'teclados',
      [{ url: 'https://placehold.co/800x800?text=Anne+Pro+2', alt: 'Anne Pro 2', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'AP2-RED-BLK', price: 69,  stock: 30, attributes: { switch: 'Gateron Red',   layout: '60%', color: 'Negro' } },
        { sku: 'AP2-BRW-WHT', price: 69,  stock: 25, attributes: { switch: 'Gateron Brown', layout: '60%', color: 'Blanco' } },
      ]
    ),

    // ── MOUSE (10) ────────────────────────────────────────
    await makeProduct(
      'Logitech G502 X Plus', 'logitech-g502-x-plus',
      'Mouse gaming inalámbrico con sensor HERO 25K',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=G502+X+Plus', alt: 'G502 X Plus', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'G502XP-BLK', price: 159, stock: 15, attributes: { color: 'Negro', dpi: '25600', conexion: 'Inalámbrico' } },
        { sku: 'G502XP-WHT', price: 159, stock: 10, attributes: { color: 'Blanco', dpi: '25600', conexion: 'Inalámbrico' } },
      ]
    ),
    await makeProduct(
      'Razer DeathAdder V3', 'razer-deathadder-v3',
      'Mouse ergonómico ultra liviano para gaming',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=DeathAdder+V3', alt: 'DeathAdder V3', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'DAV3-BLK', price: 99, stock: 20, attributes: { color: 'Negro', peso: '59g', dpi: '30000' } }]
    ),
    await makeProduct(
      'SteelSeries Rival 650', 'steelseries-rival-650',
      'Mouse gaming inalámbrico con carga rápida',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Rival+650', alt: 'SteelSeries Rival 650', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RL650-BLK', price: 119, stock: 12, attributes: { color: 'Negro', dpi: '12000', conexion: 'Inalámbrico' } }]
    ),
    await makeProduct(
      'Logitech MX Master 3S', 'logitech-mx-master-3s',
      'Mouse para productividad con scroll MagSpeed',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=MX+Master+3S', alt: 'MX Master 3S', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MXM3S-GRF', price: 99, stock: 20, attributes: { color: 'Grafito', conexion: 'BT/USB', dpi: '8000' } },
        { sku: 'MXM3S-PAL', price: 99, stock: 15, attributes: { color: 'Pálido',  conexion: 'BT/USB', dpi: '8000' } },
      ]
    ),
    await makeProduct(
      'Finalmouse Starlight-12', 'finalmouse-starlight-12',
      'Mouse gaming ultra premium de magnesio',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Starlight-12', alt: 'Finalmouse Starlight-12', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'FSL12-SM', price: 189, stock: 5, attributes: { talla: 'Small',  peso: '42g' } },
        { sku: 'FSL12-MD', price: 189, stock: 5, attributes: { talla: 'Medium', peso: '47g' } },
      ]
    ),
    await makeProduct(
      'Corsair M75 Air', 'corsair-m75-air',
      'Mouse gaming inalámbrico ultraliviano',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Corsair+M75', alt: 'Corsair M75 Air', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'CM75-BLK', price: 109, stock: 14, attributes: { color: 'Negro', peso: '60g', conexion: 'Inalámbrico' } },
        { sku: 'CM75-WHT', price: 109, stock: 10, attributes: { color: 'Blanco', peso: '60g', conexion: 'Inalámbrico' } },
      ]
    ),
    await makeProduct(
      'ASUS ROG Harpe Ace', 'asus-rog-harpe-ace',
      'Mouse gaming ultraliviano 54g para esports',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=ROG+Harpe+Ace', alt: 'ROG Harpe Ace', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'ROGHA-BLK', price: 99, stock: 16, attributes: { color: 'Negro', peso: '54g', dpi: '36000' } }]
    ),
    await makeProduct(
      'Zowie EC2-C', 'zowie-ec2-c',
      'Mouse gaming ergonómico para esports profesional',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Zowie+EC2-C', alt: 'Zowie EC2-C', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'ZEC2C-BLK', price: 69, stock: 22, attributes: { color: 'Negro', dpi: '3200', conexion: 'Cable' } }]
    ),
    await makeProduct(
      'HyperX Pulsefire Haste 2', 'hyperx-pulsefire-haste-2',
      'Mouse gaming con diseño honeycomb ultraliviano',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Pulsefire+Haste+2', alt: 'Pulsefire Haste 2', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'PFH2-BLK', price: 59, stock: 25, attributes: { color: 'Negro', peso: '53g', conexion: 'Cable' } },
        { sku: 'PFH2-WHT', price: 59, stock: 20, attributes: { color: 'Blanco', peso: '53g', conexion: 'Cable' } },
      ]
    ),
    await makeProduct(
      'Glorious Model O 2', 'glorious-model-o-2',
      'Mouse gaming liviano con sensor de 26000 DPI',
      'mouse',
      [{ url: 'https://placehold.co/800x800?text=Model+O+2', alt: 'Glorious Model O 2', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'GMO2-BLK', price: 79, stock: 18, attributes: { color: 'Negro', peso: '59g', dpi: '26000' } },
        { sku: 'GMO2-WHT', price: 79, stock: 15, attributes: { color: 'Blanco', peso: '59g', dpi: '26000' } },
      ]
    ),

    // ── AURICULARES (10) ──────────────────────────────────
    await makeProduct(
      'SteelSeries Arctis Nova Pro', 'steelseries-arctis-nova-pro',
      'Auricular gaming con cancelación de ruido activa',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=Arctis+Nova+Pro', alt: 'Arctis Nova Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'ANP-BLK', price: 349, stock: 8, attributes: { color: 'Negro', conexion: 'Inalámbrico', anc: 'Sí' } },
        { sku: 'ANP-WHT', price: 349, stock: 6, attributes: { color: 'Blanco', conexion: 'Inalámbrico', anc: 'Sí' } },
      ]
    ),
    await makeProduct(
      'Logitech G Pro X 2 Lightspeed', 'logitech-g-pro-x-2',
      'Auricular gaming inalámbrico profesional',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=G+Pro+X+2', alt: 'G Pro X 2', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'GPRX2-BLK', price: 249, stock: 10, attributes: { color: 'Negro', conexion: 'Lightspeed' } },
        { sku: 'GPRX2-WHT', price: 249, stock: 8,  attributes: { color: 'Blanco', conexion: 'Lightspeed' } },
      ]
    ),
    await makeProduct(
      'Razer BlackShark V2 Pro', 'razer-blackshark-v2-pro',
      'Auricular gaming inalámbrico con micrófono HyperClear',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=BlackShark+V2', alt: 'BlackShark V2 Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'BSV2P-BLK', price: 199, stock: 12, attributes: { color: 'Negro', conexion: 'Inalámbrico' } },
        { sku: 'BSV2P-WHT', price: 199, stock: 9,  attributes: { color: 'Blanco', conexion: 'Inalámbrico' } },
      ]
    ),
    await makeProduct(
      'HyperX Cloud III', 'hyperx-cloud-iii',
      'Auricular gaming con audio espacial DTS',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=Cloud+III', alt: 'HyperX Cloud III', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'HC3-BLK', price: 99,  stock: 20, attributes: { color: 'Negro', conexion: 'Cable' } },
        { sku: 'HC3-RED', price: 99,  stock: 15, attributes: { color: 'Rojo',  conexion: 'Cable' } },
      ]
    ),
    await makeProduct(
      'ASUS ROG Delta S', 'asus-rog-delta-s',
      'Auricular gaming USB-C con DAC ESS quad',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=ROG+Delta+S', alt: 'ROG Delta S', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'ROGDS-BLK', price: 149, stock: 10, attributes: { color: 'Negro', conexion: 'USB-C' } }]
    ),
    await makeProduct(
      'Corsair HS80 RGB Wireless', 'corsair-hs80-rgb-wireless',
      'Auricular gaming inalámbrico con Dolby Atmos',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=HS80+Wireless', alt: 'Corsair HS80', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'HS80-BLK', price: 129, stock: 14, attributes: { color: 'Negro', conexion: 'Inalámbrico', dolby: 'Sí' } },
        { sku: 'HS80-WHT', price: 129, stock: 10, attributes: { color: 'Blanco', conexion: 'Inalámbrico', dolby: 'Sí' } },
      ]
    ),
    await makeProduct(
      'Beyerdynamic DT 990 Pro', 'beyerdynamic-dt-990-pro',
      'Auricular de estudio abierto de alta fidelidad',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=DT+990+Pro', alt: 'DT 990 Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'DT990-80',  price: 159, stock: 8, attributes: { impedancia: '80 Ohm',  tipo: 'Abierto' } },
        { sku: 'DT990-250', price: 169, stock: 6, attributes: { impedancia: '250 Ohm', tipo: 'Abierto' } },
      ]
    ),
    await makeProduct(
      'Jabra Evolve2 85', 'jabra-evolve2-85',
      'Auricular profesional ANC para trabajo remoto',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=Evolve2+85', alt: 'Jabra Evolve2 85', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'JE85-BLK', price: 379, stock: 6, attributes: { color: 'Negro', anc: 'Sí', certificacion: 'Teams/Zoom' } },
        { sku: 'JE85-BEI', price: 379, stock: 4, attributes: { color: 'Beige', anc: 'Sí', certificacion: 'Teams/Zoom' } },
      ]
    ),
    await makeProduct(
      'Sennheiser HD 560S', 'sennheiser-hd-560s',
      'Auricular audiófilo abierto para análisis de audio',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=HD+560S', alt: 'Sennheiser HD 560S', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'HD560S-BLK', price: 199, stock: 10, attributes: { tipo: 'Abierto', impedancia: '120 Ohm' } }]
    ),
    await makeProduct(
      'Astro A50 Gen 5', 'astro-a50-gen-5',
      'Auricular gaming premium con base dock de carga',
      'auriculares',
      [{ url: 'https://placehold.co/800x800?text=Astro+A50', alt: 'Astro A50 Gen 5', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'A50G5-BLK', price: 299, stock: 7, attributes: { color: 'Negro', plataforma: 'PC/PS5' } },
        { sku: 'A50G5-WHT', price: 299, stock: 5, attributes: { color: 'Blanco', plataforma: 'PC/Xbox' } },
      ]
    ),

    // ── PLACAS DE VIDEO (10) ──────────────────────────────
    await makeProduct(
      'NVIDIA RTX 4090 Founders Edition', 'nvidia-rtx-4090-fe',
      'La GPU más potente del mercado para gaming y creación',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4090', alt: 'RTX 4090 FE', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4090-FE', price: 1599, stock: 4, attributes: { vram: '24GB GDDR6X', tdp: '450W' } }]
    ),
    await makeProduct(
      'ASUS ROG Strix RTX 4080 Super', 'asus-rog-strix-rtx-4080-super',
      'RTX 4080 Super con refrigeración triple ventilador',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4080+Super', alt: 'RTX 4080 Super', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4080S-ROG', price: 1099, stock: 6, attributes: { vram: '16GB GDDR6X', tdp: '320W', cooler: 'Triple' } }]
    ),
    await makeProduct(
      'MSI Gaming RTX 4070 Ti Super', 'msi-gaming-rtx-4070-ti-super',
      'RTX 4070 Ti Super ideal para gaming 4K',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4070+Ti', alt: 'RTX 4070 Ti Super', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4070TIS-MSI', price: 799, stock: 8, attributes: { vram: '16GB GDDR6X', tdp: '285W' } }]
    ),
    await makeProduct(
      'Sapphire Pulse RX 7900 XTX', 'sapphire-pulse-rx-7900-xtx',
      'La GPU top de AMD para gaming 4K ultra',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RX+7900+XTX', alt: 'RX 7900 XTX', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RX7900XTX-SAP', price: 999, stock: 5, attributes: { vram: '24GB GDDR6', tdp: '355W' } }]
    ),
    await makeProduct(
      'Gigabyte RTX 4070 Super Eagle OC', 'gigabyte-rtx-4070-super-eagle',
      'RTX 4070 Super para gaming 1440p fluido',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4070+Super', alt: 'RTX 4070 Super', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4070S-GIG', price: 599, stock: 10, attributes: { vram: '12GB GDDR6X', tdp: '220W' } }]
    ),
    await makeProduct(
      'XFX Speedster MERC RX 7800 XT', 'xfx-speedster-rx-7800-xt',
      'GPU AMD excelente para 1440p al mejor precio',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RX+7800+XT', alt: 'RX 7800 XT', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RX7800XT-XFX', price: 499, stock: 12, attributes: { vram: '16GB GDDR6', tdp: '263W' } }]
    ),
    await makeProduct(
      'ASUS Dual RTX 4060 OC', 'asus-dual-rtx-4060-oc',
      'RTX 4060 para gaming 1080p con DLSS 3',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4060', alt: 'RTX 4060', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4060-ASUS', price: 299, stock: 18, attributes: { vram: '8GB GDDR6', tdp: '115W' } }]
    ),
    await makeProduct(
      'MSI Ventus RX 7600', 'msi-ventus-rx-7600',
      'GPU entrada gama media de AMD para 1080p',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RX+7600', alt: 'RX 7600', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RX7600-MSI', price: 269, stock: 20, attributes: { vram: '8GB GDDR6', tdp: '165W' } }]
    ),
    await makeProduct(
      'Gigabyte RTX 4080 Super Windforce', 'gigabyte-rtx-4080-super-windforce',
      'RTX 4080 Super con triple ventilador Windforce',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RTX+4080S+WF', alt: 'RTX 4080 Super WF', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RTX4080S-WF', price: 1049, stock: 5, attributes: { vram: '16GB GDDR6X', tdp: '320W', cooler: 'Windforce' } }]
    ),
    await makeProduct(
      'PowerColor Hellhound RX 7700 XT', 'powercolor-hellhound-rx-7700-xt',
      'GPU AMD 1440p con 12GB de VRAM',
      'placas-de-video',
      [{ url: 'https://placehold.co/800x800?text=RX+7700+XT', alt: 'RX 7700 XT', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'RX7700XT-PC', price: 449, stock: 9, attributes: { vram: '12GB GDDR6', tdp: '245W' } }]
    ),

    // ── PROCESADORES (10) ─────────────────────────────────
    await makeProduct(
      'Intel Core i9-14900K', 'intel-core-i9-14900k',
      'Procesador Intel de 24 núcleos para máximo rendimiento',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=i9-14900K', alt: 'i9-14900K', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'I9-14900K', price: 549, stock: 8, attributes: { nucleos: '24', threads: '32', socket: 'LGA1700', turbo: '6.0GHz' } }]
    ),
    await makeProduct(
      'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x',
      'Procesador AMD de 16 núcleos para workstation',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=Ryzen+9+7950X', alt: 'Ryzen 9 7950X', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'R9-7950X', price: 699, stock: 6, attributes: { nucleos: '16', threads: '32', socket: 'AM5', turbo: '5.7GHz' } }]
    ),
    await makeProduct(
      'Intel Core i7-14700K', 'intel-core-i7-14700k',
      'Procesador de alto rendimiento para gaming y creación',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=i7-14700K', alt: 'i7-14700K', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'I7-14700K', price: 389, stock: 12, attributes: { nucleos: '20', threads: '28', socket: 'LGA1700', turbo: '5.6GHz' } }]
    ),
    await makeProduct(
      'AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d',
      'El mejor procesador para gaming con tecnología 3D V-Cache',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=Ryzen+7+7800X3D', alt: 'Ryzen 7 7800X3D', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'R7-7800X3D', price: 449, stock: 10, attributes: { nucleos: '8', threads: '16', socket: 'AM5', cache: '96MB 3D V-Cache' } }]
    ),
    await makeProduct(
      'Intel Core i5-14600K', 'intel-core-i5-14600k',
      'Procesador mid-range ideal para gaming 1440p',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=i5-14600K', alt: 'i5-14600K', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'I5-14600K', price: 289, stock: 18, attributes: { nucleos: '14', threads: '20', socket: 'LGA1700', turbo: '5.3GHz' } }]
    ),
    await makeProduct(
      'AMD Ryzen 5 7600X', 'amd-ryzen-5-7600x',
      'Excelente procesador de 6 núcleos para gaming',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=Ryzen+5+7600X', alt: 'Ryzen 5 7600X', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'R5-7600X', price: 229, stock: 22, attributes: { nucleos: '6', threads: '12', socket: 'AM5', turbo: '5.3GHz' } }]
    ),
    await makeProduct(
      'Intel Core i9-13900KS', 'intel-core-i9-13900ks',
      'Versión especial del i9 con boost de 6.0GHz de fábrica',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=i9-13900KS', alt: 'i9-13900KS', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'I9-13900KS', price: 599, stock: 5, attributes: { nucleos: '24', threads: '32', socket: 'LGA1700', turbo: '6.0GHz' } }]
    ),
    await makeProduct(
      'AMD Ryzen 9 7900X', 'amd-ryzen-9-7900x',
      'Procesador de 12 núcleos para creación de contenido',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=Ryzen+9+7900X', alt: 'Ryzen 9 7900X', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'R9-7900X', price: 449, stock: 9, attributes: { nucleos: '12', threads: '24', socket: 'AM5', turbo: '5.6GHz' } }]
    ),
    await makeProduct(
      'Intel Core i3-14100', 'intel-core-i3-14100',
      'Procesador entry level para PC de oficina',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=i3-14100', alt: 'i3-14100', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'I3-14100', price: 129, stock: 30, attributes: { nucleos: '4', threads: '8', socket: 'LGA1700', turbo: '4.7GHz' } }]
    ),
    await makeProduct(
      'AMD Ryzen 5 8600G', 'amd-ryzen-5-8600g',
      'Procesador con gráficos integrados Radeon 760M',
      'procesadores',
      [{ url: 'https://placehold.co/800x800?text=Ryzen+5+8600G', alt: 'Ryzen 5 8600G', isPrimary: true, sortOrder: 0 }],
      [{ sku: 'R5-8600G', price: 229, stock: 20, attributes: { nucleos: '6', threads: '12', socket: 'AM5', gpu: 'Radeon 760M' } }]
    ),

    // ── MEMORIAS RAM (10) ─────────────────────────────────
    await makeProduct(
      'Corsair Vengeance DDR5 32GB', 'corsair-vengeance-ddr5-32gb',
      'Kit de RAM DDR5 6000MHz para plataformas Intel/AMD',
      'memorias-ram',
      [{ url: 'https://placehold.co/800x800?text=Vengeance+DDR5', alt: 'Corsair Vengeance DDR5', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'CV-DDR5-32-6000-BLK', price: 119, stock: 20, attributes: { capacidad: '32GB', velocidad: '6000MHz', color: 'Negro' } },
        { sku: 'CV-DDR5-32-6000-WHT', price: 119, stock: 15, attributes: { capacidad: '32GB', velocidad: '6000MHz', color: 'Blanco' } },
        { sku: 'CV-DDR5-64-6000-BLK', price: 219, stock: 10, attributes: { capacidad: '64GB', velocidad: '6000MHz', color: 'Negro' } },
      ]
    ),
    await makeProduct(
      'G.Skill Trident Z5 RGB DDR5', 'gskill-trident-z5-rgb',
      'RAM DDR5 de alto rendimiento con RGB',
      'memorias-ram',
      [{ url: 'https://placehold.co/800x800?text=Trident+Z5+RGB', alt: 'Trident Z5 RGB', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'TZ5-32-6400-SIL', price: 139, stock: 14, attributes: { capacidad: '32GB', velocidad: '6400MHz', color: 'Plata' } },
        { sku: 'TZ5-64-6400-SIL', price: 259, stock: 8,  attributes: { capacidad: '64GB', velocidad: '6400MHz', color: 'Plata' } },
      ]
    ),
    await makeProduct(
      'Kingston Fury Beast DDR5', 'kingston-fury-beast-ddr5',
      'RAM DDR5 económica para gaming sin RGB',
      'memorias-ram',
      [{ url: 'https://placehold.co/800x800?text=Fury+Beast+DDR5', alt: 'Kingston Fury Beast', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'KFB-DDR5-32-5200', price: 89,  stock: 25, attributes: { capacidad: '32GB', velocidad: '5200MHz' } },
        { sku: 'KFB-DDR5-64-5200', price: 169, stock: 12, attributes: { capacidad: '64GB', velocidad: '5200MHz' } },
      ]
    ),
    await makeProduct(
      'TeamGroup T-Force Delta RGB DDR5', 'teamgroup-t-force-delta-rgb',
      'RAM DDR5 con RGB mirror design',
      'memorias-ram',
      [{ url: 'https://placehold.co/800x800?text=T-Force+Delta', alt: 'T-Force Delta RGB', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'TFD-32-6000-WHT', price: 109, stock: 18, attributes: { capacidad: '32GB', velocidad: '6000MHz', color: 'Blanco' } },
        { sku: 'TFD-32-6000-BLK', price: 109, stock: 15, attributes: { capacidad: '32GB', velocidad: '6000MHz', color: 'Negro'  } },
      ]
    ),
    await makeProduct(
      'Crucial Pro DDR5 32GB', 'crucial-pro-ddr5-32gb',
      'RAM confiable para workstation sin RGB',
      'memorias-ram',
      [{ url: 'https://placehold.co/800x800?text=Crucial+Pro+DDR5', alt: 'Crucial Pro DDR5', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'CPD5-32-5600', price: 79,  stock: 30, attributes: { capacidad: '32GB', velocidad: '5600MHz' } },
        { sku: 'CPD5-64-5600', price: 149, stock: 15, attributes: { capacidad: '64GB', velocidad: '5600MHz' } },
      ]
    ),

    // ── ALMACENAMIENTO (10) ───────────────────────────────
    await makeProduct(
      'Samsung 990 Pro NVMe SSD', 'samsung-990-pro-nvme',
      'SSD NVMe PCIe 4.0 con velocidades de 7450 MB/s',
      'almacenamiento',
      [{ url: 'https://placehold.co/800x800?text=990+Pro+NVMe', alt: 'Samsung 990 Pro', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'S990P-1TB',  price: 109, stock: 20, attributes: { capacidad: '1TB',  lectura: '7450 MB/s' } },
        { sku: 'S990P-2TB',  price: 189, stock: 15, attributes: { capacidad: '2TB',  lectura: '7450 MB/s' } },
        { sku: 'S990P-4TB',  price: 349, stock: 8,  attributes: { capacidad: '4TB',  lectura: '7450 MB/s' } },
      ]
    ),
    await makeProduct(
      'WD Black SN850X NVMe', 'wd-black-sn850x-nvme',
      'SSD Gaming NVMe con velocidades de 7300 MB/s',
      'almacenamiento',
      [{ url: 'https://placehold.co/800x800?text=SN850X+NVMe', alt: 'WD Black SN850X', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'SN850X-1TB', price: 99,  stock: 22, attributes: { capacidad: '1TB', lectura: '7300 MB/s' } },
        { sku: 'SN850X-2TB', price: 179, stock: 14, attributes: { capacidad: '2TB', lectura: '7300 MB/s' } },
      ]
    ),
    await makeProduct(
      'Seagate Barracuda HDD 4TB', 'seagate-barracuda-hdd-4tb',
      'Disco rígido para almacenamiento masivo',
      'almacenamiento',
      [{ url: 'https://placehold.co/800x800?text=Barracuda+HDD', alt: 'Barracuda HDD 4TB', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'BRCDA-4TB',  price: 79,  stock: 25, attributes: { capacidad: '4TB',  rpm: '5400' } },
        { sku: 'BRCDA-8TB',  price: 149, stock: 15, attributes: { capacidad: '8TB',  rpm: '5400' } },
      ]
    ),
    await makeProduct(
      'Crucial MX500 SATA SSD', 'crucial-mx500-sata-ssd',
      'SSD SATA para actualizar laptops y PCs antiguas',
      'almacenamiento',
      [{ url: 'https://placehold.co/800x800?text=MX500+SATA', alt: 'Crucial MX500', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'MX500-500GB', price: 49,  stock: 30, attributes: { capacidad: '500GB', tipo: 'SATA', lectura: '560 MB/s' } },
        { sku: 'MX500-1TB',   price: 79,  stock: 25, attributes: { capacidad: '1TB',   tipo: 'SATA', lectura: '560 MB/s' } },
        { sku: 'MX500-2TB',   price: 149, stock: 15, attributes: { capacidad: '2TB',   tipo: 'SATA', lectura: '560 MB/s' } },
      ]
    ),
    await makeProduct(
      'Kingston NV3 NVMe SSD', 'kingston-nv3-nvme',
      'SSD NVMe económico PCIe 4.0',
      'almacenamiento',
      [{ url: 'https://placehold.co/800x800?text=Kingston+NV3', alt: 'Kingston NV3', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'KNV3-1TB', price: 69,  stock: 30, attributes: { capacidad: '1TB', lectura: '6000 MB/s' } },
        { sku: 'KNV3-2TB', price: 119, stock: 20, attributes: { capacidad: '2TB', lectura: '6000 MB/s' } },
      ]
    ),

    // ── GABINETES (10) ────────────────────────────────────
    await makeProduct(
      'Lian Li PC-O11 Dynamic EVO', 'lian-li-o11-dynamic-evo',
      'Gabinete premium con soporte para watercooling',
      'gabinetes',
      [{ url: 'https://placehold.co/800x800?text=O11+Dynamic+EVO', alt: 'O11 Dynamic EVO', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'O11EVO-BLK', price: 179, stock: 10, attributes: { color: 'Negro', formato: 'Mid Tower', vidrio: 'Doble' } },
        { sku: 'O11EVO-WHT', price: 179, stock: 8,  attributes: { color: 'Blanco', formato: 'Mid Tower', vidrio: 'Doble' } },
      ]
    ),
    await makeProduct(
      'Fractal Design Torrent', 'fractal-design-torrent',
      'Gabinete con máximo airflow para cooling pasivo',
      'gabinetes',
      [{ url: 'https://placehold.co/800x800?text=Fractal+Torrent', alt: 'Fractal Torrent', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'FDT-BLK-TG', price: 189, stock: 7, attributes: { color: 'Negro', vidrio: 'Templado', airflow: 'Alto' } },
        { sku: 'FDT-WHT-TG', price: 189, stock: 5, attributes: { color: 'Blanco', vidrio: 'Templado', airflow: 'Alto' } },
      ]
    ),
    await makeProduct(
      'NZXT H9 Flow', 'nzxt-h9-flow',
      'Gabinete doble cámara con vidrio panorámico',
      'gabinetes',
      [{ url: 'https://placehold.co/800x800?text=NZXT+H9+Flow', alt: 'NZXT H9 Flow', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'H9F-BLK', price: 159, stock: 9,  attributes: { color: 'Negro',  formato: 'Mid Tower', camaras: 'Doble' } },
        { sku: 'H9F-WHT', price: 159, stock: 7,  attributes: { color: 'Blanco', formato: 'Mid Tower', camaras: 'Doble' } },
      ]
    ),
    await makeProduct(
      'Corsair 4000D Airflow', 'corsair-4000d-airflow',
      'Gabinete con excelente flujo de aire y buen precio',
      'gabinetes',
      [{ url: 'https://placehold.co/800x800?text=4000D+Airflow', alt: 'Corsair 4000D', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'C4000D-BLK', price: 99,  stock: 15, attributes: { color: 'Negro',  vidrio: 'Templado' } },
        { sku: 'C4000D-WHT', price: 99,  stock: 12, attributes: { color: 'Blanco', vidrio: 'Templado' } },
      ]
    ),
    await makeProduct(
      'be quiet! Silent Base 802', 'bequiet-silent-base-802',
      'Gabinete silencioso para builds tranquilas',
      'gabinetes',
      [{ url: 'https://placehold.co/800x800?text=Silent+Base+802', alt: 'Silent Base 802', isPrimary: true, sortOrder: 0 }],
      [
        { sku: 'SB802-BLK-TG', price: 169, stock: 8,  attributes: { color: 'Negro',  vidrio: 'Templado', silencioso: 'Sí' } },
        { sku: 'SB802-WHT-TG', price: 169, stock: 6,  attributes: { color: 'Blanco', vidrio: 'Templado', silencioso: 'Sí' } },
      ]
    ),
  ];

  console.log(`✅ ${products.length} productos creados`);
  console.log('🎉 Seed completado con éxito!');
  console.log('\n📊 Resumen:');
  console.log(`   Categorías: 10`);
  console.log(`   Productos:  ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    // Con solo el console.error ya te enterás si algo falló
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
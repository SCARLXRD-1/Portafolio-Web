import fs from 'node:fs';
import path from 'node:path';

const userTags = [
    // Original list
    'vue', 'angular', 'svelte', 'nuxt', 'nest', 'express', 'django', 'flask', 'spring',
    'bootstrap', 'mongodb', 'firebase', 'docker', 'kubernetes', 'git', 'github', 'gitlab',
    'aws', 'azure', 'cloudflare', 'linux', 'nginx', 'apache', 'figma', 'postman', 'graphql',
    'prisma', 'electron', 'ionic', 'react native', 'kotlin', 'swift', 'ai', 'openai',
    'tensorflow', 'pytorch', 'machine learning', 'arduino', 'raspberry pi', 'c++', 'c#',
    'java', 'go', 'rust', 'wordpress', 'shopify', 'woocommerce', 'elementor', 'magento',
    'drupal', 'jira', 'trello', 'notion', 'unity', 'unreal engine', 'blender', 'photoshop',
    'illustrator', 'premiere pro',
    
    // Second list
    'redux', 'zustand', 'pinia', 'rxjs', 'three.js', 'framer motion', 'socket.io', 'fastapi',
    'codeigniter', 'symfony', 'adonisjs', 'fastify', 'qwik', 'solidjs', 'fresh', 'htmx',
    'alpine.js', 'livewire', 'inertia.js', 'filament', 'tall stack', 'medusa', 'payload cms',
    'directus', 'appwrite', 'pocketbase', 'redis', 'sqlite', 'mariadb', 'oracle database',
    'sql server', 'firestore', 'google cloud', 'oracle cloud', 'digitalocean', 'railway',
    'render', 'netlify', 'heroku', 'github actions', 'jenkins', 'terraform', 'ansible',
    'xamarin', 'swiftui', 'jetpack compose', 'capacitor', 'langchain', 'llamaindex',
    'ollama', 'hugging face', 'stable diffusion', 'deep learning', 'computer vision',
    'gemini', 'claude', 'intellij idea', 'webstorm', 'phpstorm', 'android studio',
    'visual studio', 'vs code', 'insomnia', 'adobe xd', 'canva', 'after effects',
    'lightroom', 'wireshark', 'nmap', 'burp suite', 'metasploit', 'kali linux', 'owasp',
    'godot', 'cryengine', 'gamemaker', 'joomla', 'prestashop', 'strapi', 'sanity',
    'contentful', 'babel', 'webpack', 'rollup', 'eslint', 'prettier', 'pnpm', 'yarn',
    'npm', 'bun', 'turborepo', 'nx', 'superset', 'power bi', 'tableau', 'opencv', 'keras',
    'scikit-learn', 'pandas', 'numpy', 'jupyter', 'selenium', 'playwright', 'cypress',
    'rabbitmq', 'apache kafka', 'elasticsearch', 'logstash', 'kibana', 'grafana',
    'prometheus', 'minio', 'storybook', 'chakra ui', 'material ui', 'ant design',
    'shadcn ui', 'bulma', 'sass', 'less', 'tailwind ui', 'astro db', 'drizzle', 'typeorm',
    'sequelize', 'mongoose', 'passport.js', 'auth0', 'clerk', 'keycloak', 'firebase auth',
    'supabase auth', 'websocket', 'grpc', 'soap', 'microservices', 'serverless', 'linux mint',
    'ubuntu', 'debian', 'fedora', 'arch linux', 'rocky linux', 'almalinux', 'proxmox',
    'virtualbox', 'vmware', 'docker compose', 'traefik', 'caddy', 'apache tomcat', 'iis',
    'wordpress api', 'woocommerce api', 'shopify api', 'electron forge', 'tauri', 'pwa',
    'webassembly', 'wasm', 'zig', 'elixir', 'phoenix', 'haskell', 'dart frog', 'flutterflow',
    'lovable', 'bolt.new', 'cursor', 'windsurf', 'copilot', 'chatgpt', 'openrouter',
    'deepseek', 'mistral', 'groq', 'anthropic', 'replicate', 'pinecone', 'weaviate',
    'qdrant', 'chroma', 'vite'
];

const slugMapping = {
    'vue': 'vuedotjs',
    'angular': 'angular',
    'svelte': 'svelte',
    'nuxt': 'nuxtdotjs',
    'nest': 'nestjs',
    'express': 'express',
    'django': 'django',
    'flask': 'flask',
    'spring': 'springboot',
    'bootstrap': 'bootstrap',
    'mongodb': 'mongodb',
    'firebase': 'firebase',
    'docker': 'docker',
    'kubernetes': 'kubernetes',
    'git': 'git',
    'github': 'github',
    'gitlab': 'gitlab',
    'aws': 'amazonaws',
    'azure': 'microsoftazure',
    'cloudflare': 'cloudflare',
    'linux': 'linux',
    'nginx': 'nginx',
    'apache': 'apache',
    'figma': 'figma',
    'postman': 'postman',
    'graphql': 'graphql',
    'prisma': 'prisma',
    'electron': 'electron',
    'ionic': 'ionic',
    'react native': 'react',
    'kotlin': 'kotlin',
    'swift': 'swift',
    'openai': 'openai',
    'tensorflow': 'tensorflow',
    'pytorch': 'pytorch',
    'arduino': 'arduino',
    'raspberry pi': 'raspberrypi',
    'c++': 'cplusplus',
    'c#': 'csharp',
    'java': 'openjdk',
    'go': 'go',
    'rust': 'rust',
    'wordpress': 'wordpress',
    'shopify': 'shopify',
    'woocommerce': 'woocommerce',
    'elementor': 'elementor',
    'magento': 'magento',
    'drupal': 'drupal',
    'jira': 'jira',
    'trello': 'trello',
    'notion': 'notion',
    'unity': 'unity',
    'unreal engine': 'unrealengine',
    'blender': 'blender',
    'photoshop': 'adobephotoshop',
    'illustrator': 'adobeillustrator',
    'premiere pro': 'adobepremierepro',
    
    // Second list
    'redux': 'redux',
    'zustand': 'redux',
    'pinia': 'vuedotjs',
    'rxjs': 'reactivex',
    'three.js': 'threedotjs',
    'framer motion': 'framer',
    'socket.io': 'socketdotio',
    'fastapi': 'fastapi',
    'codeigniter': 'codeigniter',
    'symfony': 'symfony',
    'adonisjs': 'adonisjs',
    'fastify': 'fastify',
    'qwik': 'qwik',
    'solidjs': 'solid',
    'fresh': 'fresh',
    'htmx': 'htmx',
    'alpine.js': 'alpinedotjs',
    'livewire': 'laravel',
    'inertia.js': 'inertiadotjs',
    'filament': 'laravel',
    'medusa': 'medusajs',
    'payload cms': 'payload',
    'directus': 'directus',
    'appwrite': 'appwrite',
    'pocketbase': 'pocketbase',
    'redis': 'redis',
    'sqlite': 'sqlite',
    'mariadb': 'mariadb',
    'oracle database': 'oracle',
    'sql server': 'microsoftsqlserver',
    'firestore': 'firebase',
    'google cloud': 'googlecloud',
    'oracle cloud': 'oracle',
    'digitalocean': 'digitalocean',
    'railway': 'railway',
    'render': 'render',
    'netlify': 'netlify',
    'heroku': 'heroku',
    'github actions': 'githubactions',
    'jenkins': 'jenkins',
    'terraform': 'terraform',
    'ansible': 'ansible',
    'xamarin': 'xamarin',
    'swiftui': 'swift',
    'jetpack compose': 'android',
    'capacitor': 'capacitor',
    'langchain': 'langchain',
    'llamaindex': 'python',
    'ollama': 'ollama',
    'hugging face': 'huggingface',
    'stable diffusion': 'stabilityai',
    'gemini': 'google-gemini',
    'claude': 'anthropic',
    'intellij idea': 'intellijidea',
    'webstorm': 'webstorm',
    'phpstorm': 'phpstorm',
    'android studio': 'androidstudio',
    'visual studio': 'visualstudio',
    'vs code': 'visualstudiocode',
    'insomnia': 'insomnia',
    'adobe xd': 'adobexd',
    'canva': 'canva',
    'after effects': 'adobeaftereffects',
    'lightroom': 'adobelightroom',
    'wireshark': 'wireshark',
    'nmap': 'nmap',
    'burp suite': 'portswigger',
    'metasploit': 'rapid7',
    'kali linux': 'kalilinux',
    'owasp': 'owasp',
    'godot': 'godotengine',
    'cryengine': 'cryengine',
    'gamemaker': 'gamemaker',
    'joomla': 'joomla',
    'prestashop': 'prestashop',
    'strapi': 'strapi',
    'sanity': 'sanity',
    'contentful': 'contentful',
    'babel': 'babel',
    'webpack': 'webpack',
    'rollup': 'rollup',
    'eslint': 'eslint',
    'prettier': 'prettier',
    'pnpm': 'pnpm',
    'yarn': 'yarn',
    'npm': 'npm',
    'bun': 'bun',
    'turborepo': 'turborepo',
    'nx': 'nx',
    'superset': 'apachesuperset',
    'power bi': 'microsoftpowerbi',
    'tableau': 'tableau',
    'opencv': 'opencv',
    'keras': 'keras',
    'scikit-learn': 'scikitlearn',
    'pandas': 'pandas',
    'numpy': 'numpy',
    'jupyter': 'jupyter',
    'selenium': 'selenium',
    'playwright': 'playwright',
    'cypress': 'cypress',
    'rabbitmq': 'rabbitmq',
    'apache kafka': 'apachekafka',
    'elasticsearch': 'elasticsearch',
    'logstash': 'logstash',
    'kibana': 'kibana',
    'grafana': 'grafana',
    'prometheus': 'prometheus',
    'minio': 'minio',
    'storybook': 'storybook',
    'chakra ui': 'chakraui',
    'material ui': 'mui',
    'ant design': 'antdesign',
    'shadcn ui': 'shadcnui',
    'bulma': 'bulma',
    'sass': 'sass',
    'less': 'less',
    'tailwind ui': 'tailwindcss',
    'astro db': 'astro',
    'drizzle': 'drizzle',
    'typeorm': 'typescript',
    'sequelize': 'sequelize',
    'mongoose': 'mongodb',
    'passport.js': 'passport',
    'auth0': 'auth0',
    'clerk': 'clerk',
    'keycloak': 'keycloak',
    'firebase auth': 'firebase',
    'supabase auth': 'supabase',
    'grpc': 'grpc',
    'soap': 'xml',
    'microservices': 'docker',
    'serverless': 'serverless',
    'linux mint': 'linuxmint',
    'ubuntu': 'ubuntu',
    'debian': 'debian',
    'fedora': 'fedora',
    'arch linux': 'archlinux',
    'rocky linux': 'rockylinux',
    'almalinux': 'almalinux',
    'proxmox': 'proxmox',
    'virtualbox': 'virtualbox',
    'vmware': 'vmware',
    'docker compose': 'docker',
    'traefik': 'traefik',
    'caddy': 'caddy',
    'apache tomcat': 'apachetomcat',
    'iis': 'microsoft',
    'wordpress api': 'wordpress',
    'woocommerce api': 'woocommerce',
    'shopify api': 'shopify',
    'electron forge': 'electron',
    'tauri': 'tauri',
    'pwa': 'pwa',
    'webassembly': 'webassembly',
    'wasm': 'webassembly',
    'zig': 'zig',
    'elixir': 'elixir',
    'phoenix': 'phoenixframework',
    'haskell': 'haskell',
    'dart frog': 'dart',
    'flutterflow': 'flutter',
    'copilot': 'githubcopilot',
    'chatgpt': 'openai',
    'openrouter': 'openrouter',
    'deepseek': 'deepseek',
    'mistral': 'mistralai',
    'groq': 'groq',
    'anthropic': 'anthropic',
    'replicate': 'replicate',
    'pinecone': 'pinecone',
    'weaviate': 'weaviate',
    'qdrant': 'qdrant',
    'chroma': 'chromadb',
    'vite': 'vite'
};

const customTags = {
    'ai': {
        color: '#9C27B0',
        isStroke: true,
        svg: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>'
    },
    'machine learning': {
        color: '#3F51B5',
        isStroke: true,
        svg: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3.001 3.001 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3.001 3.001 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"/>'
    },
    'deep learning': {
        color: '#3F51B5',
        isStroke: true,
        svg: '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3.001 3.001 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3.001 3.001 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z"/>'
    },
    'computer vision': {
        color: '#00bcd4',
        isStroke: true,
        svg: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>'
    },
    'tall stack': {
        color: '#06B6D4',
        isStroke: true,
        svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>'
    },
    'websocket': {
        color: '#4caf50',
        isStroke: true,
        svg: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.38 7.78a16 16 0 0 1 21.24 0M8.59 17.22a6 6 0 0 1 6.82 0M12 22v-.01"/>'
    },
    'lovable': {
        color: '#E91E63',
        isStroke: true,
        svg: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
    },
    'bolt.new': {
        color: '#FFEB3B',
        isStroke: true,
        svg: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
    },
    'cursor': {
        color: '#00E676',
        isStroke: true,
        svg: '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6"/>'
    },
    'windsurf': {
        color: '#00E5FF',
        isStroke: true,
        svg: '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M10 8c2 2 3 5 2 8M14 6c3 3 4 8 2 12"/>'
    }
};

async function getIcon(slug) {
    try {
        const res = await fetch(`https://unpkg.com/simple-icons@16.22.0/icons/${slug}.svg`);
        if (!res.ok) throw new Error(`Not found: ${slug}`);
        const text = await res.text();
        const pathMatch = /<path d="([^"]+)"/.exec(text);
        return pathMatch ? pathMatch[1] : null;
    } catch (e) {
        console.error(`Error fetching SVG for ${slug}:`, e.message);
        return null;
    }
}

async function getMetadata() {
    const res = await fetch('https://raw.githubusercontent.com/simple-icons/simple-icons/master/data/simple-icons.json');
    if (!res.ok) {
        console.error("Fetch failed with status:", res.status);
        throw new Error("Failed to fetch simple-icons.json");
    }
    const data = await res.json();
    return data;
}

async function start() {
    console.log("Fetching simple-icons metadata...");
    const icons = await getMetadata();
    const iconMap = {};
    for (const icon of icons) {
        iconMap[icon.slug || icon.title.toLowerCase().replace(/[^a-z0-9]/g, '')] = icon;
    }

    const newConfig = {};

    console.log("Fetching SVGs from unpkg...");
    for (const tag of userTags) {
        if (customTags[tag]) {
            newConfig[tag] = customTags[tag];
            continue;
        }

        const slug = slugMapping[tag] || tag.toLowerCase().replace(/[^a-z0-9]/g, '');
        const meta = iconMap[slug];
        let color = '#888888';
        if (meta) {
            color = `#${meta.hex}`;
            // Adjust white or near-white colors to black for visibility
            if (meta.hex.toLowerCase() === 'ffffff' || meta.hex.toLowerCase() === 'fff') {
                color = '#000000';
            }
        }

        const pathD = await getIcon(slug);
        if (pathD) {
            newConfig[tag] = {
                color,
                svg: `<path d="${pathD}"/>`
            };
        } else {
            console.warn(`Skipping tag ${tag} due to missing SVG.`);
        }
    }

    console.log(`Generated ${Object.keys(newConfig).length} tag configurations.`);

    // 1. Update Tag.astro
    const tagAstroPath = path.resolve('src/components/ui/Tag.astro');
    let tagAstroContent = fs.readFileSync(tagAstroPath, 'utf8');

    const configStartIndex = tagAstroContent.indexOf('const tagConfig: Record<string, { color: string, svg: string, isStroke?: boolean }> = {');
    const configEndIndex = tagAstroContent.indexOf('};', configStartIndex);

    if (configStartIndex !== -1 && configEndIndex !== -1) {
        const beforeConfig = tagAstroContent.substring(0, configStartIndex);
        const afterConfig = tagAstroContent.substring(configEndIndex + 2); // skip the }; to avoid duplication

        let newConfigBlock = 'const tagConfig: Record<string, { color: string, svg: string, isStroke?: boolean }> = {\n';
        
        // Merge with existing config from current file
        const configText = tagAstroContent.substring(configStartIndex, configEndIndex + 2);
        const regex = /^\s*'([^']+)':\s*({[^}]+}),?/gm;
        let match;
        const mergedConfig = {};
        while ((match = regex.exec(configText)) !== null) {
            mergedConfig[match[1]] = match[2];
        }

        // Add/Overwrite with new config
        for (const [key, val] of Object.entries(newConfig)) {
            const isStrokeStr = val.isStroke ? ', isStroke: true' : '';
            mergedConfig[key] = `{ color: '${val.color}'${isStrokeStr}, svg: '${val.svg}' }`;
        }

        for (const [key, val] of Object.entries(mergedConfig)) {
            newConfigBlock += `    '${key}': ${val},\n`;
        }
        newConfigBlock += '};';

        fs.writeFileSync(tagAstroPath, beforeConfig + newConfigBlock + afterConfig, 'utf8');
        console.log("Successfully updated Tag.astro");
    }

    // 2. Update TagInput.astro
    const tagInputAstroPath = path.resolve('src/components/admin/TagInput.astro');
    let tagInputAstroContent = fs.readFileSync(tagInputAstroPath, 'utf8');

    const availableTagsStartIndex = tagInputAstroContent.indexOf('const availableTags = [');
    const availableTagsEndIndex = tagInputAstroContent.indexOf('].sort();', availableTagsStartIndex);

    if (availableTagsStartIndex !== -1 && availableTagsEndIndex !== -1) {
        const beforeTags = tagInputAstroContent.substring(0, availableTagsStartIndex);
        const afterTags = tagInputAstroContent.substring(availableTagsEndIndex);

        // Get current tags
        const tagsText = tagInputAstroContent.substring(availableTagsStartIndex, availableTagsEndIndex);
        const tagRegex = /"([^"]+)"/g;
        let tagMatch;
        const existingAvailableTags = new Set();
        while ((tagMatch = tagRegex.exec(tagsText)) !== null) {
            existingAvailableTags.add(tagMatch[1]);
        }

        // Add user tags to availableTags
        const capitalize = (s) => {
            if (s === 'c++') return 'C++';
            if (s === 'c#') return 'C#';
            if (s === 'ai') return 'AI';
            if (s === 'aws') return 'AWS';
            if (s === 'git') return 'Git';
            if (s === 'github') return 'GitHub';
            if (s === 'gitlab') return 'GitLab';
            if (s === 'graphql') return 'GraphQL';
            if (s === 'api') return 'API';
            if (s === 'rest api') return 'REST API';
            if (s === 'seo') return 'SEO';
            if (s === 'php') return 'PHP';
            if (s === 'mysql') return 'MySQL';
            if (s === 'ajax') return 'AJAX';
            if (s === 'pdf') return 'PDF';
            if (s === 'gps') return 'GPS';
            if (s === 'pwa') return 'PWA';
            if (s === 'wasm') return 'Wasm';
            if (s === 'cms') return 'CMS';
            if (s === 'tall stack') return 'TALL Stack';
            if (s === 'three.js') return 'Three.js';
            if (s === 'socket.io') return 'Socket.io';
            if (s === 'fastapi') return 'FastAPI';
            if (s === 'adonisjs') return 'AdonisJS';
            if (s === 'fresh') return 'Fresh';
            if (s === 'htmx') return 'htmx';
            if (s === 'alpine.js') return 'Alpine.js';
            if (s === 'inertia.js') return 'Inertia.js';
            if (s === 'mariadb') return 'MariaDB';
            if (s === 'digitalocean') return 'DigitalOcean';
            if (s === 'vs code') return 'VS Code';
            
            // Title case
            return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        };

        for (const tag of userTags) {
            existingAvailableTags.add(capitalize(tag));
        }

        // Rebuild availableTags block
        let newTagsBlock = 'const availableTags = [\n';
        const sortedTags = Array.from(existingAvailableTags).sort((a, b) => a.localeCompare(b));
        for (let i = 0; i < sortedTags.length; i += 4) {
            const chunk = sortedTags.slice(i, i + 4).map(t => `"${t}"`).join(', ');
            newTagsBlock += `    ${chunk}${i + 4 < sortedTags.length ? ',' : ''}\n`;
        }
        newTagsBlock += '].sort();';

        fs.writeFileSync(tagInputAstroPath, beforeTags + newTagsBlock + afterTags, 'utf8');
        console.log("Successfully updated TagInput.astro");
    }
}

start();

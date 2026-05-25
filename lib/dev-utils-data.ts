export type DevUtil = {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  language: string;
  label: string;
  filename: string;
  codeLanguage: string;
  preview: string;
};

export const DEV_UTILS_REPO = "https://github.com/10shubham01/utils";

export const DEV_UTILS: DevUtil[] = [
  {
    id: "delete-unused-public",
    title: "Unused public assets",
    description: "Scans public/ and your source tree, then prompts before deleting files nothing references.",
    githubUrl: `${DEV_UTILS_REPO}/blob/main/delete.js`,
    language: "Node.js",
    label: "DELETE.JS",
    filename: "delete.js",
    codeLanguage: "javascript",
    preview: `const PUBLIC_DIR = join(process.cwd(), 'public');
const searchPattern = '/' + relativePath.split(sep).join('/');

for (const projectFile of projectFiles) {
  if (readFileSync(projectFile, 'utf8').includes(searchPattern)) {
    isUsed = true;
  }
}

if (!isUsed) unusedFiles.push(publicFile);`,
  },
  {
    id: "convert-to-webp",
    title: "PNG to WebP",
    description: "Converts PNGs under a folder to WebP with sharp, reports space saved, and rewrites imports across the repo.",
    githubUrl: `${DEV_UTILS_REPO}/blob/main/convertToWebp.mjs`,
    language: "Node.js",
    label: "WEBP",
    filename: "convertToWebp.mjs",
    codeLanguage: "javascript",
    preview: `await sharp(inputPath).webp({ lossless: false }).toFile(outputPath);
fs.unlinkSync(inputPath);

console.log(\`Space saved: \${formatSize(sizeSaved)}\`);

for (const codeFile of codeFiles) {
  updateFileReferences(codeFile, replacements);
}`,
  },
  {
    id: "update-nuxt-meta",
    title: "Nuxt meta updater",
    description: "Patches title, description, and Open Graph fields in nuxt.config.ts from a single config object.",
    githubUrl: `${DEV_UTILS_REPO}/blob/main/updateMeta.js`,
    language: "Node.js",
    label: "NUXT META",
    filename: "updateMeta.js",
    codeLanguage: "javascript",
    preview: `const META_UPDATES = {
  title: '...',
  ogTitle: '...',
  description: '...',
  ogDescription: '...',
};

content = content.replace(titleRegex, \`title: '\${META_UPDATES.title}'\`);`,
  },
  {
    id: "compare-video-sizes",
    title: "Video size compare",
    description: "Prints a table of original vs 720p MP4 sizes and how many megabytes each transcode saved.",
    githubUrl: `${DEV_UTILS_REPO}/blob/main/compare_sizes.sh`,
    language: "Shell",
    label: "COMPARE",
    filename: "compare_sizes.sh",
    codeLanguage: "shell",
    preview: `for f in *.mp4; do
  orig_size=$(du -m "$orig" | cut -f1)
  conv_size=$(du -m "$conv" | cut -f1)
  saved=$((orig_size - conv_size))
  printf "%-40s %12d %12d %12d\\n" "$f" ...
done`,
  },
  {
    id: "1080p-to-720p",
    title: "1080p to 720p",
    description: "Batch-downscales MP4, MKV, and MOV files to 720p with FFmpeg into a 720p_videos/ folder.",
    githubUrl: `${DEV_UTILS_REPO}/blob/main/1080p%20to%20720p`,
    language: "Shell",
    label: "FFMPEG",
    filename: "1080p to 720p",
    codeLanguage: "shell",
    preview: `mkdir -p 720p_videos

for f in *.mp4 *.mkv *.mov; do
  ffmpeg -i "$f" -vf scale=-2:720 \\
    -c:v libx264 -crf 18 -preset slow \\
    -c:a copy "720p_videos/$f"
done`,
  },
];

export function getDevUtilHref(id: string) {
  return `/writings/utils/${id}`;
}

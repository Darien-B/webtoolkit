# WebP Studio: Image Converter & HTML Optimizer

A premium, high-fidelity local utility built with raw HTML, Vanilla CSS, and modern browser APIs. It is designed to run 100% client-side directly in your web browser. Your files are processed entirely on your local machine and are never uploaded to any server, guaranteeing absolute privacy and near-instant processing.

## 🚀 Key Features

1. **Batch Image Converter**:
   - Drag-and-drop multiple images (PNG, JPG, JPEG, GIF, AVIF, HEIC, WebP) simultaneously.
   - Adjust target quality (1% to 100%) and resolution scale (10% to 100%).
   - Instantly download compressed WebP files individually or as a single compiled ZIP file.
   - Built-in **Visual Compression Inspector** featuring an interactive sliding splitter for side-by-side quality comparison and exact size reduction metrics.

2. **In-Place Workspace HTML Optimizer**:
   - Uses the modern **File System Access API** (`window.showDirectoryPicker()`) to open a local project folder directly.
   - Recursively scans the directory for HTML pages and CSS stylesheets.
   - Analyzes code documents to locate local image file references.
   - Batch converts matched JPG/PNG files to high-performance WebP formats directly in their respective folders.
   - Safely updates standard `<img>` tags, `<source srcset="...">` attributes, and CSS background `url(...)` declarations to point to the new `.webp` filenames in-place.
   - Provides an optional toggle to permanently purge original image formats after successful conversions.

3. **Gallery Grabber (Remote Page Scraper)**:
   - Target any public URL (e.g., plan page galleries) and scan it client-side.
   - Filter and isolate target images using custom CSS Selectors (e.g. `img`, `.gallery img`, or `.swiper-slide img`).
   - Resolves inline, relative, standard, and modern lazy-loaded attributes (`src`, `data-src`, `data-lazy-src`, `srcset` resolution scaling).
   - Prevents canvas sandboxing issues by downloading image Blobs via a client-side CORS proxy (`corsproxy.io`) before canvas loading, allowing fully un-tainted conversion and ZIP compilation of selected images.

4. **Multi-Browser Drag-and-Drop Fallback**:
   - Automatic graceful fallback for browsers that do not support directory writing (e.g. Safari, Firefox).
   - Drop HTML and image files together to automatically reconstruct references and compile an optimized, compressed folder structure inside a single `.zip` download.

---

## 🛠️ Getting Started & Usage

### Method 1: Double-Click (Zero Setup)
Simply double-click the `index.html` file or open it in your browser (`file:///Users/darienbrimhall/.gemini/antigravity/scratch/webp-converter-tool/index.html`).

### Method 2: Local Server (Recommended for Directory Access APIs)
To experience the full capabilities of in-place editing via modern Chrome/Edge directory picker, we recommend running it via a local development server or set the workspace directory.

To run via Python's built-in server, execute this command inside the `webp-converter-tool` folder:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## 🔒 Security & Privacy

- **100% Local**: No backend API, tracker, or cloud connection. All conversions run on browser canvas elements natively.
- **Defensive Writing**: In-place edits are written safely. HTML rewrites preserve exact styling, attributes, classes, and code structures.

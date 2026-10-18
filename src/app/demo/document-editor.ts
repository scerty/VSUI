import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, signal } from '@angular/core';
import { Download, LucideAngularModule } from 'lucide-angular';
import type Editor from '@toast-ui/editor';

interface DemoDocument {
  readonly id: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly markdown: string;
  readonly tags: readonly string[];
}

interface ArticleDraft {
  readonly title: string;
  readonly markdown: string;
}

const DOCUMENTS: readonly DemoDocument[] = [
  {
    id: 'workbench-brief',
    title: 'Workbench Brief',
    eyebrow: 'Design note / 01',
    markdown: 'A workbench keeps the user in a durable context. Views stay available while editors open the current piece of work.\n\n## A durable place to think\n\nThe editor keeps the article close to the tools that shape it. Write in **WYSIWYG mode**, or switch to Markdown when you want precise control.\n\n- Keep context visible\n- Make state recoverable\n- Let features stay focused',
    tags: ['context', 'composition'],
  },
  {
    id: 'extension-contracts',
    title: 'Extension Contracts',
    eyebrow: 'Architecture note / 02',
    markdown: 'Features contribute descriptors through a registry. The shell renders those descriptors without importing feature code.\n\n## Contracts over coupling\n\nEach feature contributes a small descriptor and keeps its implementation local. That gives the workbench room to grow without turning the shell into a catalogue of special cases.',
    tags: ['registry', 'isolation'],
  },
  {
    id: 'restoration-notes',
    title: 'Restoration Notes',
    eyebrow: 'Workspace note / 03',
    markdown: 'Only editor identities and active editor state are persisted here. Domain data remains owned by the consuming application.\n\n> Restore the workspace structure, not the application\'s ownership boundaries.\n\nThis keeps persistence useful and predictable while leaving article data with the feature that understands it.',
    tags: ['state', 'persistence'],
  },
];

const EXPORT_STYLES = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #172033; background: #ffffff; font-family: Georgia, 'Times New Roman', serif; }
  .article { width: min(100%, 980px); margin: 0 auto; padding: 56px 28px 72px; }
  .article[dir="rtl"] { text-align: right; }
  .article[dir="ltr"] { text-align: left; }
  .article-header { margin-bottom: 38px; }
  .article-eyebrow { color: #2563eb; font: 700 12px/1.4 'Segoe UI', sans-serif; letter-spacing: .14em; text-transform: uppercase; }
  h1 { margin: 10px 0 0; font: 700 clamp(32px, 5vw, 54px)/1.08 'Segoe UI', sans-serif; letter-spacing: -.02em; }
  .article-content { font-size: 19px; line-height: 1.75; }
  .article-content h2, .article-content h3 { margin: 1.8em 0 .55em; font-family: 'Segoe UI', sans-serif; line-height: 1.2; }
  .article-content p, .article-content ul, .article-content ol, .article-content blockquote { margin: 0 0 1.1em; }
  .article-content blockquote { padding-inline-start: 1.2em; border-inline-start: 4px solid #2563eb; color: #475569; }
  .article-content img { max-width: 100%; }
  .article-content img:not([width]):not([height]) { height: auto; }
  .article-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
  .article-content th, .article-content td { padding: 10px 12px; border: 1px solid #cbd5e1; text-align: start; }
  .article-content th { background: #eff6ff; font-family: 'Segoe UI', sans-serif; }
  .article-content pre { overflow-x: auto; padding: 16px; color: #e2e8f0; background: #172033; direction: ltr; text-align: start; }
  @media (max-width: 700px) { .article { padding: 32px 18px 48px; } .article-content { font-size: 17px; } }
`;

@Component({
  selector: 'demo-document-editor',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <article class="document-editor">
      <header class="document-header">
        <div>
          <span class="document-eyebrow">{{ document.eyebrow }}</span>
          <input class="article-title" aria-label="Article title" [value]="articleTitle()" (input)="updateTitle($event)" />
        </div>
        <div class="document-header-meta">
          <button class="export-button" type="button" aria-label="Export article as HTML" title="Export article as HTML" (click)="exportHtml()">
            <lucide-icon [img]="icons.download" [size]="13"></lucide-icon>
            <span>Export HTML</span>
          </button>
          <span class="document-state">{{ saveState() }}</span>
          <span class="editor-mode">WYSIWYG</span>
        </div>
      </header>
      <div class="editor-frame">
        <div #editorHost class="article-editor" aria-label="Article editor"><span class="editor-loading">Loading editor...</span></div>
      </div>
      <div class="document-tags">
        @for (tag of document.tags; track tag) { <span>{{ tag }}</span> }
      </div>
      <footer class="document-footer">Article draft <span>Saved locally in this workspace</span></footer>
    </article>
  `,
  styles: `
    :host { display: block; min-height: 100%; }
    .document-editor { width: 100%; max-width: none; margin: 0; padding: 34px clamp(16px, 2vw, 28px) 42px; }
    .document-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
    .document-eyebrow { color: var(--wb-accent); font-size: .62rem; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; }
    .article-title { display: block; width: min(680px, 100%); margin-top: 9px; padding: 0; border: 0; outline: 0; color: var(--wb-text); background: transparent; font-family: var(--wb-mono-font); font-size: 1.8rem; font-weight: 600; letter-spacing: 0; }
    .article-title:focus { border-bottom: 1px solid var(--wb-accent); }
    .document-header-meta { display: flex; align-items: center; gap: 7px; padding-top: 4px; }
    .export-button { display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border: 1px solid var(--wb-border); border-radius: 3px; color: var(--wb-text-soft); background: var(--wb-surface-raised); cursor: pointer; font: inherit; font-size: .6rem; }
    .export-button:hover { color: var(--wb-text); border-color: var(--wb-accent); background: var(--wb-accent-soft); }
    .document-state, .editor-mode { padding: 5px 8px; border: 1px solid var(--wb-border); border-radius: 3px; color: var(--wb-green); font-size: .6rem; white-space: nowrap; }
    .editor-mode { color: var(--wb-muted); }
    .editor-frame { overflow: hidden; border: 1px solid var(--wb-border); border-radius: 5px; background: var(--wb-surface); box-shadow: 0 5px 20px rgb(0 0 0 / 12%); }
    .article-editor { min-height: 380px; }
    .editor-loading { display: grid; min-height: 380px; place-items: center; color: var(--wb-muted); font-size: .72rem; }
    .document-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 18px; }
    .document-tags span { padding: 5px 8px; border: 1px solid var(--wb-border); border-radius: 3px; color: var(--wb-muted); font-size: .62rem; }
    .document-footer { display: flex; justify-content: space-between; gap: 10px; margin-top: 28px; padding-top: 12px; border-top: 1px solid var(--wb-border); color: var(--wb-muted); font-size: .6rem; }
    @media (max-width: 700px) {
      .document-editor { padding: 24px 14px 30px; }
      .document-header { display: block; }
      .document-header-meta { padding-top: 12px; }
      .article-title { font-size: 1.35rem; }
      .article-editor, .editor-loading { min-height: 320px; }
      .document-footer { display: block; line-height: 1.6; }
    }
  `,
})
export class DemoDocumentEditor implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @Input() documentId = 'workbench-brief';
  @ViewChild('editorHost', { static: true }) private editorHost!: ElementRef<HTMLDivElement>;

  readonly articleTitle = signal('');
  readonly saveState = signal('Saved locally');
  readonly icons = { download: Download };
  private editor?: Editor;
  private destroyed = false;
  private initializationVersion = 0;
  private readonly storagePrefix = 'vsui.article-draft.';

  get document(): DemoDocument {
    return DOCUMENTS.find((entry) => entry.id === this.documentId) ?? DOCUMENTS[0];
  }

  ngOnInit(): void {
    this.articleTitle.set(this.readDraft().title);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initializeEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['documentId'] || changes['documentId'].firstChange || !this.editorHost) {
      return;
    }
    this.articleTitle.set(this.readDraft().title);
    this.saveState.set('Saved locally');
    this.editor?.destroy();
    this.editor = undefined;
    void this.initializeEditor();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.initializationVersion += 1;
    this.editor?.destroy();
  }

  private async initializeEditor(): Promise<void> {
    const version = ++this.initializationVersion;
    const draft = this.readDraft();
    try {
      const { default: ToastEditor } = await import('./toast-ui-loader');
      if (this.destroyed || version !== this.initializationVersion) {
        return;
      }
      const host = this.editorHost.nativeElement;
      host.replaceChildren();
      const editor = new ToastEditor({
        el: host,
        initialValue: draft.markdown,
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        height: 'min(560px, calc(100vh - 270px))',
        hideModeSwitch: false,
        usageStatistics: false,
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike'],
          ['table', 'image', 'link'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task'],
          ['code', 'codeblock'],
        ],
        hooks: {
          addImageBlobHook: (blob, callback) => this.addImage(blob, callback),
        },
      });
      this.editor = editor;
      editor.on('change', () => this.saveDraft());
    } catch {
      if (this.destroyed || version !== this.initializationVersion) {
        return;
      }
      this.saveState.set('Editor unavailable');
      this.editorHost.nativeElement.textContent = 'Editor could not load.';
    }
  }

  updateTitle(event: Event): void {
    this.articleTitle.set((event.target as HTMLInputElement).value);
    this.saveDraft();
  }

  async exportHtml(): Promise<void> {
    if (!this.editor) {
      this.saveState.set('Editor is still loading');
      return;
    }
    try {
      const { strToU8, zipSync } = await import('fflate');
      const exportDocument = this.createExportDocument(this.editor.getHTML());
      const assets = await this.extractImageAssets(exportDocument);
      const files: Record<string, Uint8Array> = {
        'index.html': strToU8(`<!doctype html>\n${exportDocument.documentElement.outerHTML}`),
      };
      for (const asset of assets) {
        files[asset.path] = asset.bytes;
      }
      const archive = new Blob([zipSync(files)], { type: 'application/zip' });
      this.downloadBlob(archive, `${this.slugify(this.articleTitle()) || 'article'}.zip`);
      this.saveState.set('HTML exported');
    } catch {
      this.saveState.set('Export failed');
    }
  }

  private createExportDocument(editorHtml: string): Document {
    const parsed = new DOMParser().parseFromString('<!doctype html><html><head></head><body></body></html>', 'text/html');
    const direction = this.detectDirection(editorHtml);
    parsed.documentElement.lang = direction === 'rtl' ? 'ar' : 'en';
    parsed.documentElement.dir = direction;
    const title = parsed.createElement('title');
    title.textContent = this.articleTitle().trim() || this.document.title;
    const style = parsed.createElement('style');
    style.textContent = EXPORT_STYLES;
    parsed.head.append(title, style);

    const article = parsed.createElement('article');
    article.className = 'article';
    article.dir = direction;
    const header = parsed.createElement('header');
    header.className = 'article-header';
    const eyebrow = parsed.createElement('div');
    eyebrow.className = 'article-eyebrow';
    eyebrow.textContent = this.document.eyebrow;
    const heading = parsed.createElement('h1');
    heading.textContent = this.articleTitle().trim() || this.document.title;
    header.append(eyebrow, heading);
    const content = parsed.createElement('main');
    content.className = 'article-content';
    const fragment = parsed.createElement('template');
    fragment.innerHTML = editorHtml;
    content.append(fragment.content.cloneNode(true));
    article.append(header, content);
    parsed.body.replaceChildren(article);

    content.querySelectorAll('p, h1, h2, h3, h4, li, blockquote, th, td').forEach((element) => {
      const text = element.textContent?.trim() ?? '';
      if (text && this.containsArabic(text)) {
        element.setAttribute('dir', 'rtl');
      }
    });
    return parsed;
  }

  private async extractImageAssets(exportDocument: Document): Promise<readonly { path: string; bytes: Uint8Array }[]> {
    const assets: { path: string; bytes: Uint8Array }[] = [];
    const images = [...exportDocument.querySelectorAll('img')];
    for (const [index, image] of images.entries()) {
      const source = image.getAttribute('src');
      if (!source?.startsWith('data:')) {
        continue;
      }
      const decoded = this.decodeDataUrl(source);
      if (!decoded) {
        continue;
      }
      const path = `assets/image-${index + 1}.${decoded.extension}`;
      image.setAttribute('src', path);
      assets.push({ path, bytes: decoded.bytes });
    }
    return assets;
  }

  private decodeDataUrl(dataUrl: string): { bytes: Uint8Array; extension: string } | null {
    const match = dataUrl.match(/^data:([^;,]+)(;base64)?,(.*)$/s);
    if (!match) {
      return null;
    }
    const mimeType = match[1].toLowerCase();
    const extension = ({
      'image/gif': 'gif',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/svg+xml': 'svg',
      'image/webp': 'webp',
    } as Record<string, string>)[mimeType] ?? 'bin';
    if (match[2]) {
      const binary = atob(match[3]);
      return { bytes: Uint8Array.from(binary, (character) => character.charCodeAt(0)), extension };
    }
    return { bytes: new TextEncoder().encode(decodeURIComponent(match[3])), extension };
  }

  private detectDirection(value: string): 'rtl' | 'ltr' {
    const arabicCharacters = value.match(/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/g)?.length ?? 0;
    const latinCharacters = value.match(/[A-Za-z]/g)?.length ?? 0;
    return arabicCharacters > latinCharacters ? 'rtl' : 'ltr';
  }

  private containsArabic(value: string): boolean {
    return /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/.test(value);
  }

  private slugify(value: string): string {
    return value.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private saveDraft(): void {
    if (!this.editor) {
      return;
    }
    const title = this.articleTitle().trim() || this.document.title;
    const draft: ArticleDraft = { title, markdown: this.editor.getMarkdown() };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(draft));
      this.saveState.set('Saved locally');
    } catch {
      this.saveState.set('Local save unavailable');
    }
  }

  private async addImage(blob: Blob, callback: (url: string, text?: string) => void): Promise<void> {
    if (blob.size > 2_000_000) {
      this.saveState.set('Image must be under 2 MB');
      return;
    }
    try {
      const dataUrl = await this.readBlobAsDataUrl(blob);
      const altText = blob instanceof File ? blob.name : 'Inserted image';
      callback(dataUrl, altText);
    } catch {
      this.saveState.set('Image could not be inserted');
    }
  }

  private readBlobAsDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Image data is not readable'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('Image read failed'));
      reader.readAsDataURL(blob);
    });
  }

  private readDraft(): ArticleDraft {
    const fallback = { title: this.document.title, markdown: this.document.markdown };
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return fallback;
    }
    try {
      const draft = JSON.parse(stored) as Partial<ArticleDraft>;
      return {
        title: typeof draft.title === 'string' && draft.title.trim() ? draft.title : fallback.title,
        markdown: typeof draft.markdown === 'string' ? draft.markdown : fallback.markdown,
      };
    } catch {
      return fallback;
    }
  }

  private get storageKey(): string {
    return `${this.storagePrefix}${this.document.id}`;
  }
}
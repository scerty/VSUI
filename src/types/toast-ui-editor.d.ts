declare module '@toast-ui/editor' {
  interface EditorOptions {
    readonly el: HTMLElement;
    readonly initialValue?: string;
    readonly initialEditType?: 'markdown' | 'wysiwyg';
    readonly previewStyle?: 'tab' | 'vertical';
    readonly height?: string;
    readonly hideModeSwitch?: boolean;
    readonly usageStatistics?: boolean;
    readonly toolbarItems?: readonly (readonly string[])[];
    readonly hooks?: {
      readonly addImageBlobHook?: (blob: Blob | File, callback: (url: string, text?: string) => void) => void;
    };
  }

  export default class Editor {
    constructor(options: EditorOptions);
    on(event: 'change', handler: () => void): void;
    getMarkdown(): string;
    getHTML(): string;
    destroy(): void;
  }
}

declare module '@toast-ui/editor/dist/toastui-editor.css';

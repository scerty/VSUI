import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { type FC, useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: 'dark' | 'light';
}

const containsHtml = (value: string) => /<([a-z][\w-]*)\b[^>]*>/i.test(value);

const RichTextEditor: FC<RichTextEditorProps> = ({ value, onChange, placeholder, theme = 'dark' }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const onChangeRef = useRef(onChange);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [saveState, setSaveState] = useState('جاهز للتحرير');

  onChangeRef.current = onChange;

  useEffect(() => {
    if (!hostRef.current) {
      return undefined;
    }

    const editor = new Editor({
      el: hostRef.current,
      height: 'min(560px, calc(100vh - 310px))',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      initialValue: containsHtml(value) ? '' : value,
      placeholder,
      hideModeSwitch: false,
      usageStatistics: false,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote', 'ul', 'ol', 'task'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
      ],
      hooks: {
        addImageBlobHook: (blob, callback) => {
          if (blob.size > 2_000_000) {
            setSaveState('الصورة أكبر من 2MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              callback(reader.result);
              setSaveState('تمت إضافة الصورة');
            }
          };
          reader.readAsDataURL(blob);
        },
      },
    });

    if (containsHtml(value)) {
      editor.setHTML(value);
    }

    const updateMetrics = () => {
      const text = editor.getMarkdown().replace(/[#*_`>\[\]()!-]/g, ' ');
      setCharCount(text.replace(/\s/g, '').length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setSaveState('تعديلات غير محفوظة');
      onChangeRef.current(editor.getHTML());
    };

    editor.on('change', updateMetrics);
    editorRef.current = editor;

    return () => {
      editor.off('change', updateMetrics);
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const exportHtml = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const blob = new Blob([editor.getHTML()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ssb-article.html';
    link.click();
    URL.revokeObjectURL(url);
    setSaveState('تم تصدير المقال');
  };

  return (
    <section className={`rich-editor-shell rich-editor-shell--${theme} ${isFullscreen ? 'rich-editor-shell--fullscreen' : ''}`} aria-label="محرر المقال">
      <div className="rich-editor-toolbar">
        <div className="flex items-center gap-2">
          <span className="rich-editor-dot" />
          <span className="text-xs font-semibold text-slate-300">محرر المقال</span>
          <span className="text-[11px] text-slate-500">يدعم الكتابة المرئية و Markdown</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={exportHtml} className="rich-editor-action" title="تصدير HTML">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
            <span className="hidden sm:inline">تصدير</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen((current) => !current)}
            className="rich-editor-action"
            title={isFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={isFullscreen ? 'M9 9 4 4m0 0v4m0-4h4m7 7 5 5m0 0v-4m0 4h-4M9 15l-5 5m0 0h4m-4 0v-4m11-1 5-5m0 0h-4m4 0v4' : 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0-5 5M4 16v4m0 0h4m-4 0 5-5m11 5-5-5m5 5v-4m0 4h-4'} /></svg>
            <span className="hidden sm:inline">{isFullscreen ? 'إغلاق' : 'ملء الشاشة'}</span>
          </button>
        </div>
      </div>

      <div ref={hostRef} className="rich-editor-host" />

      <div className="rich-editor-status">
        <div className="flex items-center gap-3">
          <span>{wordCount} كلمة</span>
          <span>{charCount} حرف</span>
        </div>
        <span>{saveState}</span>
      </div>
    </section>
  );
};

export default RichTextEditor;
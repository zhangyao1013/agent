import { dismissMarquee } from "../lib/storage";

type Props = {
  messages: string[];
  onClose: () => void;
};

export function MarqueeBanner({ messages, onClose }: Props) {
  if (messages.length === 0) return null;

  const doubled = [...messages, ...messages];

  return (
    <div className="marquee-bar" role="status" aria-live="polite">
      <span className="pill pill-orange" style={{ flexShrink: 0 }}>
        新报告
      </span>
      <div className="marquee-track-wrap">
        <div className="marquee-track">
          {doubled.map((msg, i) => (
            <span key={`${msg}-${i}`}>{msg}</span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="marquee-close"
        aria-label="关闭滚动通知"
        onClick={() => {
          dismissMarquee();
          onClose();
        }}
      >
        ×
      </button>
    </div>
  );
}

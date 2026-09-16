import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Feather,
  Landmark,
  Maximize2,
  Menu,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const storage = import.meta.env.PROD ? `${import.meta.env.BASE_URL}assets/` : "/manus-storage/";
const brandLogo = `${import.meta.env.BASE_URL}assets/vq-logo.jpg`;

const timeline = [
  {
    year: "1070",
    title: "Văn Miếu được dựng lập",
    text: "Vua Lý Thánh Tông cho xây Văn Miếu ở phía nam kinh thành Thăng Long, thờ Khổng Tử và các bậc hiền triết.",
    tag: "Khởi nguyên",
  },
  {
    year: "1076",
    title: "Quốc Tử Giám khai mở",
    text: "Nhà Lý lập Quốc Tử Giám — trường đại học đầu tiên của Đại Việt, trước hết dành cho hoàng tử và quý tộc.",
    tag: "Giáo dục",
  },
  {
    year: "1484",
    title: "Bia Tiến sĩ ra đời",
    text: "Dưới triều Lê Thánh Tông, những tấm bia đầu tiên được dựng để ghi danh người đỗ đại khoa và lưu khuyến học cho muôn đời.",
    tag: "Ký ức",
  },
  {
    year: "1802",
    title: "Sang trang dưới triều Nguyễn",
    text: "Khi kinh đô chuyển vào Huế, Quốc Tử Giám Thăng Long trở thành Văn Miếu Hà Nội, tiếp tục là biểu tượng của đạo học.",
    tag: "Chuyển tiếp",
  },
];

const architecture = [
  {
    no: "01",
    title: "Khuê Văn Các",
    text: "Gác sao Khuê là biểu tượng thị giác của Hà Nội: hình vuông, bốn mặt tròn như mặt trời, gợi ánh sáng của tri thức.",
  },
  {
    no: "02",
    title: "Giếng Thiên Quang",
    text: "Mặt nước vuông như chiếc gương trời, giữ lại bóng Khuê Văn Các và mở ra khoảng thở tĩnh tại giữa quần thể.",
  },
  {
    no: "03",
    title: "Bia Tiến sĩ",
    text: "82 tấm bia trên lưng rùa đá là kho lưu trữ tên tuổi, quê quán và tinh thần trọng học của Đại Việt.",
  },
];

const tourStops = [
  ["Văn Miếu Môn", "Cổng nghi môn mở vào trục đạo học"],
  ["Đại Trung Môn", "Bước qua lớp sân cây xanh và tĩnh lặng"],
  ["Khuê Văn Các", "Nơi ánh sáng của chữ nghĩa được biểu trưng"],
  ["Bia Tiến sĩ", "82 câu chuyện về tài năng và chí học"],
  ["Đại Thành Môn", "Điểm tụ của không gian thờ Khổng Tử"],
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getOfflineAnswer(question: string) {
  const q = normalize(question).replace(/[?!.,;:]/g, " ").replace(/\s+/g, " ").trim();
  const has = (...terms: string[]) => terms.some((term) => q.includes(term));

  if (!q) return "Bạn muốn khám phá điều gì ở Văn Miếu? Hãy thử hỏi về lịch sử, Khuê Văn Các, bia Tiến sĩ, kiến trúc hoặc thông tin tham quan.";
  if (has("xin chao", "hello", "ban la ai", "gioi thieu")) {
    return "Xin chào, tôi là Sử Ký — trợ lý AI offline của trang. Tôi được xây dựng từ một kho tri thức nhỏ về Văn Miếu–Quốc Tử Giám và có thể giúp bạn tìm nhanh những câu chuyện đáng nhớ.";
  }
  if (has("xay", "dung", "xay dung", "lich su", "khai lap", "thanh lap", "ra doi", "bat dau", "nam nao", "the ky")) {
    return "Văn Miếu được dựng năm 1070 dưới triều Lý Thánh Tông. Đến năm 1076, vua Lý Nhân Tông lập Quốc Tử Giám — trường đại học đầu tiên của Đại Việt. Hai không gian này cùng tạo nên một trung tâm văn hóa, giáo dục kéo dài nhiều thế kỷ.";
  }
  if (has("khue", "van cac", "sao khue", "gac sao", "y nghia bieu tuong")) {
    return "Khuê Văn Các được dựng năm 1805 dưới triều Nguyễn. Gác có nền vuông, bốn mặt tròn như mặt trời và tám mái. Hình ảnh ấy thường được đọc như biểu tượng của sao Khuê — ngôi sao chủ về văn chương — soi sáng con đường học vấn.";
  }
  if (has("bia", "tien si", "tien", "rua", "ghi danh", "unesco", "ky uc the gioi")) {
    return "Văn Miếu hiện còn 82 bia Tiến sĩ, dựng từ năm 1484 đến 1780 để ghi danh các khoa thi Nho học triều Lê–Mạc. Bia đặt trên lưng rùa đá, biểu trưng cho sự trường tồn của tri thức. Năm 2010, toàn bộ 82 bia được UNESCO ghi danh trong Chương trình Ký ức Thế giới.";
  }
  if (has("kien truc", "khong gian", "quy hoach", "cac khu", "gom nhung", "cong nao", "van mieu mon", "dai trung", "dai thanh", "gieng thien quang")) {
    return "Quần thể được tổ chức theo trục Bắc–Nam với nhiều lớp cổng và sân: Văn Miếu Môn, Đại Trung Môn, Khuê Văn Các, giếng Thiên Quang, khu bia Tiến sĩ và Đại Thành. Hãy đi chậm để cảm nhận sự chuyển tiếp từ phố thị vào không gian tĩnh học.";
  }
  if (has("gio", "mo cua", "dia chi", "o dau", "nam o", "duong nao", "gia ve", "ve vao", "di den")) {
    return "Văn Miếu–Quốc Tử Giám nằm tại 58 Quốc Tử Giám, quận Đống Đa, Hà Nội. Khi làm bài tập, bạn nên kiểm tra website chính thức hoặc kênh thông tin của điểm di sản để cập nhật giờ mở cửa, giá vé và quy định tham quan mới nhất.";
  }
  if (has("khong tu", "dao hoc", "giao duc", "truong dai hoc", "hoc tap", "thi cu", "nho hoc")) {
    return "Quốc Tử Giám là trường đại học đầu tiên của Đại Việt, được lập năm 1076 để đào tạo nhân tài. Tinh thần cốt lõi của di sản là tôn sư trọng đạo, khuyến học và coi hiền tài là nền tảng của quốc gia.";
  }
  if (has("cam on", "thanks", "thank you")) {
    return "Rất vui được đồng hành cùng bạn. Nếu muốn tìm hiểu sâu hơn, hãy hỏi tôi về bia Tiến sĩ, Khuê Văn Các hoặc tuyến tham quan năm điểm dừng.";
  }
  if (has("van mieu", "quoc tu giam", "di san", "ha noi")) {
    return "Văn Miếu–Quốc Tử Giám là quần thể di tích gắn với đạo học và lịch sử giáo dục Việt Nam. Nơi đây gồm Văn Miếu thờ Khổng Tử và Quốc Tử Giám — trường đại học đầu tiên của Đại Việt. Bạn có thể hỏi tiếp về lịch sử, kiến trúc, bia Tiến sĩ hoặc thông tin tham quan.";
  }
  return "Tôi chưa có dữ liệu đủ chắc cho câu hỏi này, nhưng vẫn có thể giúp bạn theo các chủ đề: lịch sử hình thành, Quốc Tử Giám, Khuê Văn Các, bia Tiến sĩ, kiến trúc quần thể hoặc thông tin tham quan.";
}

const DEEPSEEK_API_URL = "https://deepseek-free-api-production-2e5e.up.railway.app/v1/chat/completions";
// Token được lấy tự động từ file token.txt trên GitHub, không hard-code trong code nữa.
// Cập nhật token: chỉ cần sửa nội dung file này, không cần build lại web.
const DEEPSEEK_TOKEN_URL = "https://raw.githubusercontent.com/jeuwiw36/api-deepseek/main/token.txt";
const DEEPSEEK_MODEL = "deepseek-chat";
const DEEPSEEK_SYSTEM_PROMPT = `Bạn là Sử Ký, hướng dẫn viên AI về Văn Miếu–Quốc Tử Giám tại Hà Nội. Trả lời bằng tiếng Việt, ngắn gọn từ 2 đến 5 câu, thân thiện và dễ hiểu cho học sinh. Ưu tiên thông tin lịch sử đáng tin cậy: Văn Miếu 1070, Quốc Tử Giám 1076, Khuê Văn Các 1805, 82 bia Tiến sĩ và UNESCO ghi danh năm 2010. Nếu câu hỏi cần giờ mở cửa, giá vé hoặc thông tin có thể thay đổi, hãy nói rõ người dùng cần kiểm tra nguồn chính thức. Không bịa nguồn hoặc khẳng định điều không chắc chắn. QUAN TRỌNG: luôn bắt đầu câu trả lời bằng đúng tiền tố [SK_START], sau đó mới viết nội dung trả lời.`;

// Cache token trong bộ nhớ để không phải tải lại file trên mỗi tin nhắn.
let cachedDeepSeekToken: string | null = null;
let cachedDeepSeekTokenAt = 0;
const TOKEN_CACHE_MS = 5 * 60 * 1000; // cache 5 phút

async function fetchDeepSeekToken(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedDeepSeekToken && now - cachedDeepSeekTokenAt < TOKEN_CACHE_MS) {
    return cachedDeepSeekToken;
  }

  // Thêm tham số thời gian để tránh bị cache bởi trình duyệt / CDN khi cần lấy bản mới nhất.
  const response = await fetch(`${DEEPSEEK_TOKEN_URL}?t=${now}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Không tải được token DeepSeek từ GitHub (HTTP ${response.status})`);
  }

  const text = (await response.text()).trim();
  if (!text) throw new Error("File token.txt trên GitHub đang trống");

  cachedDeepSeekToken = text;
  cachedDeepSeekTokenAt = now;
  return text;
}

async function callDeepSeek(question: string, history: ChatMessage[], token: string) {
  const recentMessages = history.slice(-6).map((message) => ({ role: message.role, content: message.text }));
  const payload = {
    model: DEEPSEEK_MODEL,
    messages: [
      { role: "system", content: DEEPSEEK_SYSTEM_PROMPT },
      ...recentMessages,
      { role: "user", content: question },
    ],
  };

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`DeepSeek API HTTP ${response.status}`);
  const data = await response.json();
  if (data?.message && !data?.choices) throw new Error(String(data.message));
  const answer = data?.choices?.[0]?.message?.content;
  if (!answer) throw new Error("DeepSeek returned an empty answer");
  return answer;
}

async function getDeepSeekAnswer(question: string, history: ChatMessage[]) {
  let token = await fetchDeepSeekToken();
  let rawAnswer: string;

  try {
    rawAnswer = String(await callDeepSeek(question, history, token)).trim();
  } catch (error) {
    // Nếu token đang cache bị coi là invalid/hết hạn, thử tải lại token mới nhất từ GitHub rồi gọi lại 1 lần.
    const message = error instanceof Error ? error.message : String(error);
    const looksLikeAuthError = /invalid token|authorization failed|401|403/i.test(message);
    if (!looksLikeAuthError) throw error;

    token = await fetchDeepSeekToken(true);
    rawAnswer = String(await callDeepSeek(question, history, token)).trim();
  }

  const markerStart = rawAnswer.toUpperCase().indexOf("SK_START");
  if (markerStart >= 0) {
    const markerEnd = rawAnswer.indexOf("]", markerStart);
    if (markerEnd >= 0) return rawAnswer.slice(markerEnd + 1).trim();
  }
  return rawAnswer;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeEra, setActiveEra] = useState(0);
  const [eraDirection, setEraDirection] = useState<"up" | "down">("up");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = window.localStorage.getItem("van-mieu-chat-history");
      return saved ? JSON.parse(saved) : [{
        role: "assistant",
        text: "Chào bạn. Tôi là Sử Ký — trợ lý DeepSeek về Văn Miếu–Quốc Tử Giám. Hãy hỏi tôi về lịch sử, kiến trúc hoặc hành trình tham quan.",
      }];
    } catch {
      return [{
        role: "assistant",
        text: "Chào bạn. Tôi là Sử Ký — trợ lý DeepSeek về Văn Miếu–Quốc Tử Giám. Hãy hỏi tôi về lịch sử, kiến trúc hoặc hành trình tham quan.",
      }];
    }
  });
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const chatMessages = messagesRef.current;
    if (!chatMessages) return;
    const frame = window.requestAnimationFrame(() => {
      chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages, chatOpen]);

  useEffect(() => {
    window.localStorage.setItem("van-mieu-chat-history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = chatExpanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [chatExpanded]);

  useEffect(() => {
    const showDelay = 1500;
    const showTimer = window.setTimeout(() => {
      setAboutVisible(true);
    }, showDelay);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!revealItems.length) return;
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const currentEra = useMemo(() => timeline[activeEra], [activeEra]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const selectEra = (index: number) => {
    if (index === activeEra) return;
    setEraDirection(index > activeEra ? "up" : "down");
    setActiveEra(index);
  };

  const askQuestion = (preset?: string) => {
    const text = (preset ?? question).trim();
    if (!text || isTyping) return;
    setChatOpen(true);
    setChatExpanded(true);
    const history = messages;
    setMessages((current) => [...current, { role: "user", text }]);
    setQuestion("");
    setIsTyping(true);
    void getDeepSeekAnswer(text, history)
      .then((answer) => setMessages((current) => [...current, { role: "assistant", text: answer }]))
      .catch((error: unknown) => {
        console.error("Lỗi gọi DeepSeek API:", error);
        const detail = error instanceof Error ? error.message : "Không xác định";
        setMessages((current) => [...current, {
          role: "assistant",
          text: `DeepSeek chưa thể trả lời. API báo: ${detail}. Vui lòng kiểm tra lại token hoặc trạng thái server Railway.`,
        }]);
      })
      .finally(() => setIsTyping(false));
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", text: "Cuộc trò chuyện mới đã sẵn sàng. Bạn muốn khám phá câu chuyện nào của Văn Miếu?" }]);
    setQuestion("");
    setIsTyping(false);
  };

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={() => scrollTo("top")}>
          <img className="brand-mark" src={brandLogo} alt="Biểu trưng Văn Miếu" />
          <span className="brand-copy">
            <strong>Văn Miếu</strong>
            <small>Quốc Tử Giám · 1070</small>
          </span>
        </a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Điều hướng chính">
          <a href="#di-san" onClick={() => setMenuOpen(false)}>Di sản</a>
          <a href="#dong-chay" onClick={() => setMenuOpen(false)}>Dòng thời gian</a>
          <a href="#kien-truc" onClick={() => setMenuOpen(false)}>Kiến trúc</a>
          <a href="#tro-ly" onClick={() => setMenuOpen(false)} className="nav-ai"><Sparkles size={14} /> Hỏi Sử Ký</a>
        </nav>
        <button className="menu-toggle" type="button" aria-label="Mở menu" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-noise" />
          <div className="hero-grid-line hero-grid-line-one" />
          <div className="hero-grid-line hero-grid-line-two" />
          <div className="hero-content page-width">
            <div className="hero-copy reveal-up">
              <div className="eyebrow eyebrow-light"><span /> DI SẢN SỐ · HÀ NỘI</div>
              <p className="hero-date">1070 — 2026</p>
              <h1>Nơi chữ nghĩa<br /><em>soi đường</em><br />qua chín thế kỷ.</h1>
              <p className="hero-description">Một chuyến đi chậm qua Văn Miếu–Quốc Tử Giám — nơi ký ức giáo dục của Đại Việt vẫn còn ngân trong từng mái ngói, hàng cây và nét khắc trên bia đá.</p>
              <div className="hero-actions">
                <button className="button button-coral" type="button" onClick={() => scrollTo("di-san")}>Bắt đầu khám phá <ArrowRight size={17} /></button>
                <button className="text-link light-link" type="button" onClick={() => scrollTo("dong-chay")}>Xem dòng thời gian <ArrowUpRight size={16} /></button>
              </div>
            </div>
            <div className="hero-visual reveal-fade">
              <div className="hero-image-wrap">
                <img src={`${storage}khue-van-cac-hero_7c9bcbf8.jpg`} alt="Khuê Văn Các giữa tán cây xanh" />
                <div className="hero-image-caption"><span>01</span><span>Khuê Văn Các · ánh sáng của văn chương</span></div>
              </div>
              <div className="hero-stamp"><span>DI SẢN</span><strong>VQ</strong><span>HÀ NỘI</span></div>
            </div>
          </div>
          <div className="hero-bottom page-width">
            <div className="scroll-cue"><span className="scroll-line" /> Cuộn để đi qua ký ức</div>
            <div className="hero-stat"><strong>950+</strong><span>năm bồi đắp<br />đạo học</span></div>
            <div className="hero-stat"><strong>82</strong><span>bia Tiến sĩ<br />được lưu giữ</span></div>
          </div>
        </section>

        <section className="intro-section page-width" id="di-san" data-reveal>
          <div className="section-kicker"><span>01</span><span className="kicker-rule" /><span>DI SẢN TRONG MỘT NHỊP NHÌN</span></div>
          <div className="intro-grid">
            <div>
              <h2 className="display-title">Một không gian,<br /><em>nhiều lớp ký ức.</em></h2>
            </div>
            <div className="intro-lead">
              <p>Văn Miếu–Quốc Tử Giám không chỉ là một điểm đến. Đó là nơi kiến trúc, thiên nhiên và lịch sử cùng kể một câu chuyện về cách người Việt trân trọng việc học.</p>
              <button className="text-link dark-link" type="button" onClick={() => scrollTo("kien-truc")}>Đọc câu chuyện kiến trúc <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="feature-grid">
            <article className="feature-card feature-card-dark">
              <div className="feature-icon"><Landmark size={21} /></div>
              <span className="feature-number">01 / 03</span>
              <h3>Trường đại học đầu tiên</h3>
              <p>Quốc Tử Giám mở ra truyền thống giáo dục bác học của Đại Việt từ năm 1076.</p>
              <button className="circle-arrow" type="button" onClick={() => scrollTo("dong-chay")} aria-label="Xem lịch sử"><ArrowUpRight size={18} /></button>
            </article>
            <article className="feature-card feature-card-cream">
              <div className="feature-icon"><Feather size={21} /></div>
              <span className="feature-number">02 / 03</span>
              <h3>82 bia đá, 2.000 tên tuổi</h3>
              <p>Mỗi tấm bia là một mảnh ký ức về những người đã đi qua các khoa thi và lịch sử.</p>
              <button className="circle-arrow" type="button" onClick={() => scrollTo("bia-da")} aria-label="Xem bia đá"><ArrowUpRight size={18} /></button>
            </article>
            <article className="feature-card feature-card-coral">
              <div className="feature-icon"><Compass size={21} /></div>
              <span className="feature-number">03 / 03</span>
              <h3>Đi chậm để nhìn sâu</h3>
              <p>Trục không gian được mở dần qua những lớp cổng, sân, cây xanh và mặt nước.</p>
              <button className="circle-arrow" type="button" onClick={() => scrollTo("tour")} aria-label="Xem hành trình"><ArrowUpRight size={18} /></button>
            </article>
          </div>
        </section>

        <section className="timeline-section" id="dong-chay" data-reveal>
          <div className="page-width">
            <div className="section-kicker light-kicker"><span>02</span><span className="kicker-rule" /><span>DÒNG CHẢY HỌC THUẬT</span></div>
            <div className="timeline-heading">
              <h2 className="display-title light-title">Một nghìn năm<br /><em>không đứng yên.</em></h2>
              <p>Lịch sử nơi đây không phải là một đường thẳng. Đó là những lớp thời gian chồng lên nhau, được giữ lại bằng đá, gỗ, nước và ký ức.</p>
            </div>
            <div className="timeline-layout">
              <div className="timeline-list" role="tablist" aria-label="Các mốc lịch sử">
                {timeline.map((item, index) => (
                  <button className={`timeline-item ${activeEra === index ? "is-active" : ""}`} type="button" key={item.year} onClick={() => selectEra(index)} role="tab" aria-selected={activeEra === index}>
                    <span className="timeline-year">{item.year}</span>
                    <span className="timeline-item-title">{item.title}</span>
                    <ChevronDown className="timeline-chevron" size={18} />
                  </button>
                ))}
              </div>
              <div className="timeline-detail" role="tabpanel" aria-live="polite">
                <div className={`timeline-detail-content direction-${eraDirection}`} key={currentEra.year}>
                  <div className="detail-topline"><span className="detail-tag">{currentEra.tag}</span><span className="detail-index">0{activeEra + 1} / 04</span></div>
                  <div className="detail-year">{currentEra.year}</div>
                  <h3>{currentEra.title}</h3>
                  <p>{currentEra.text}</p>
                  <div className="detail-ornament"><span /><span /><span /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="architecture-section page-width" id="kien-truc" data-reveal>
          <div className="section-kicker"><span>03</span><span className="kicker-rule" /><span>KIẾN TRÚC KỂ CHUYỆN</span></div>
          <div className="architecture-heading">
            <h2 className="display-title">Mỗi cánh cổng là<br /><em>một lớp nghĩa.</em></h2>
            <p>Từ ngoài vào trong, không gian được tiết chế để tâm trí tự nhiên lắng xuống. Một hệ trục vuông vức, nhưng trải nghiệm luôn mềm mại như một khu vườn.</p>
          </div>
          <div className="architecture-feature">
            <div className="architecture-photo">
              <img src={`${storage}cong-van-mieu_fd3193fc.jpg`} alt="Cổng Văn Miếu giữa hàng cây" />
              <div className="photo-label">VĂN MIẾU MÔN <span>·</span> 01</div>
            </div>
            <div className="architecture-copy">
              <span className="red-script">Không gian của sự tĩnh</span>
              <h3>Đi qua từng lớp<br /><em>để gặp chính mình.</em></h3>
              <p>Quần thể được tổ chức theo một trục thần đạo Nam–Bắc, với những cổng nối tiếp nhau. Càng đi sâu, phố thị càng lùi lại; tiếng cây và bóng mái ngói trở thành ngôn ngữ chính.</p>
              <div className="architecture-list">
                {architecture.map((item) => (
                  <div className="architecture-row" key={item.no}>
                    <span>{item.no}</span>
                    <div><strong>{item.title}</strong><p>{item.text}</p></div>
                    <ArrowUpRight size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="stele-section" id="bia-da" data-reveal>
          <div className="page-width stele-grid">
            <div className="stele-copy">
              <div className="section-kicker light-kicker"><span>04</span><span className="kicker-rule" /><span>KÝ ỨC TRÊN LƯNG RÙA</span></div>
              <h2 className="display-title light-title">Đá có thể<br /><em>kể chuyện.</em></h2>
              <blockquote>“Hiền tài là nguyên khí của quốc gia.”</blockquote>
              <p className="quote-note">— Thân Nhân Trung, bài ký bia Tiến sĩ khoa Nhâm Tuất (1442)</p>
              <div className="stele-metrics">
                <div><strong>82</strong><span>bia Tiến sĩ</span></div>
                <div><strong>2.000+</strong><span>tên tuổi được ghi</span></div>
                <div><strong>2010</strong><span>được UNESCO ghi danh</span></div>
              </div>
            </div>
            <div className="stele-photo-wrap">
              <img src={`${storage}bia-tien-si_fd360ad1.jpg`} alt="Bia Tiến sĩ trên lưng rùa đá" />
              <div className="stele-photo-caption"><span>DI SẢN TƯ LIỆU</span><strong>Ký ức Thế giới</strong><small>Memory of the World · UNESCO</small></div>
            </div>
          </div>
        </section>

        <section className="tour-section page-width" id="tour" data-reveal>
          <div className="section-kicker"><span>05</span><span className="kicker-rule" /><span>MỘT VÒNG KÝ ỨC</span></div>
          <div className="tour-heading"><h2 className="display-title">Năm điểm dừng<br /><em>cho một buổi chiều.</em></h2><p>Không cần vội. Hãy để một vòng đi bộ trở thành một cách đọc di sản — bằng mắt, bằng bước chân, bằng cả những khoảng im lặng.</p></div>
          <div className="tour-track">
            {tourStops.map(([title, text], index) => (
              <button type="button" className="tour-stop" key={title} onClick={() => setChatOpen(true)}>
                <span className="tour-dot">0{index + 1}</span>
                <span className="tour-stop-title">{title}</span>
                <span className="tour-stop-text">{text}</span>
                {index < tourStops.length - 1 && <span className="tour-connector" />}
              </button>
            ))}
          </div>
        </section>

        <section className="knowledge-section page-width" id="gia-tri" data-reveal>
          <div className="section-kicker"><span>06</span><span className="kicker-rule" /><span>GÓC NHÌN DI SẢN</span></div>
          <div className="knowledge-heading"><h2 className="display-title">Một di sản,<br /><em>nhiều cách đọc.</em></h2><p>Văn Miếu–Quốc Tử Giám không chỉ lưu giữ những công trình cổ. Nơi đây còn kể về cách một xã hội từng đặt tri thức, người thầy và việc học vào vị trí trung tâm.</p></div>
          <div className="knowledge-grid">
            <article><span className="knowledge-number">01</span><Landmark size={23} /><h3>Không gian giáo dục</h3><p>Quốc Tử Giám mở ra truyền thống đào tạo nhân tài của Đại Việt, gắn với các kỳ thi Nho học và lý tưởng học để phụng sự đất nước.</p></article>
            <article><span className="knowledge-number">02</span><Feather size={23} /><h3>Ngôn ngữ kiến trúc</h3><p>Cổng, sân, hồ nước, cây xanh và mái ngói được xếp thành từng lớp. Mỗi bước đi là một nhịp chuyển từ ồn ào sang tĩnh tại.</p></article>
            <article><span className="knowledge-number">03</span><BookOpen size={23} /><h3>Ký ức được trao truyền</h3><p>Những tấm bia Tiến sĩ ghi lại tên tuổi, quê quán và tinh thần trọng học, để câu chuyện của tiền nhân tiếp tục đến với thế hệ hôm nay.</p></article>
          </div>
        </section>

        <section className="ai-section" id="tro-ly" data-reveal>
          <div className="page-width ai-inner">
            <div className="ai-orbit orbit-one" /><div className="ai-orbit orbit-two" />
            <div className="ai-copy">
              <div className="eyebrow eyebrow-light"><span /> TRỢ LÝ DI SẢN · OFFLINE AI</div>
              <h2 className="display-title light-title">Hỏi một câu,<br /><em>mở một cánh cửa.</em></h2>
              <p>Sử Ký là trợ lý DeepSeek được tích hợp trực tiếp vào trang. Bạn có thể hỏi tự nhiên về lịch sử và kiến trúc; hệ thống vẫn có câu trả lời dự phòng khi API tạm thời không phản hồi.</p>
              <div className="ai-pills"><span><Check size={14} /> Không API key</span><span><Check size={14} /> Chạy trên trình duyệt</span></div>
            </div>
            <div className="ai-card">
              <div className="ai-card-head"><div className="ai-avatar"><Sparkles size={17} /></div><div><strong>Sử Ký</strong><span>Trợ lý di sản · đang trực tuyến</span></div><span className="online-dot" /></div>
              <div className="ai-suggestions">
                {["Văn Miếu được xây năm nào?", "Khuê Văn Các có ý nghĩa gì?", "Có bao nhiêu bia Tiến sĩ?"] .map((item) => <button type="button" key={item} onClick={() => askQuestion(item)}>{item}<ArrowUpRight size={14} /></button>)}
              </div>
              <form className="ai-input-row" onSubmit={(event) => { event.preventDefault(); askQuestion(); }}>
                <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Hỏi về di sản..." aria-label="Nhập câu hỏi" />
                <button type="submit" aria-label="Gửi câu hỏi"><Send size={17} /></button>
              </form>
              <button className="open-chat-link" type="button" onClick={() => setChatOpen(true)}>Mở toàn bộ cuộc trò chuyện <ArrowRight size={15} /></button>
            </div>
          </div>
        </section>
      </main>

      {aboutVisible && <aside className="about-popover" aria-label="Giới thiệu người thực hiện">
        <div className="about-popover-topline"><span className="about-label">GHI CHÚ TỪ NGƯỜI THỰC HIỆN</span><button type="button" onClick={() => setAboutVisible(false)} aria-label="Ẩn giới thiệu" title="Ẩn"><X size={15} /></button></div>
        <h2>Kính chào Ban Giám khảo<br /><em>và các thầy cô giáo!</em></h2>
        <p>Em tên là <strong>Nguyễn Trung Hởi</strong>, học sinh lớp <strong>9A3</strong>, trường <strong>THCS Cao Viên</strong>.</p>
        <p>Em xây dựng website để giới thiệu Văn Miếu–Quốc Tử Giám trực quan, hiện đại và dễ tiếp cận, giúp học sinh hiểu thêm về lịch sử, văn hóa và truyền thống hiếu học.</p>
        <p>Em tự chọn lọc tư liệu, xây dựng nội dung, bố cục và hình ảnh; sau đó kiểm tra, sửa lỗi và tối ưu giao diện trên máy tính lẫn điện thoại.</p>
        <p>Website dùng <strong>HTML, React, CSS và JavaScript/TypeScript</strong> cho dòng thời gian, hiệu ứng và các tương tác. Phần hỏi đáp tham khảo mã nguồn mở <strong>deepseek4free</strong> của xtekky, triển khai API riêng trên <strong>Railway</strong> và kết nối endpoint <strong>/v1/chat/completions</strong>; em cũng xử lý token, JSON, trạng thái đang gõ và lỗi máy chủ.</p>
        <p>Sản phẩm lấy cảm hứng từ kế hoạch tìm hiểu Văn Miếu–Quốc Tử Giám nhân dịp 950 năm Quốc học Việt Nam, với mong muốn lan tỏa tình yêu lịch sử và tinh thần hiếu học.</p>
        <div className="about-source"><span>NGUỒN CẢM HỨNG</span><strong>Kế hoạch liên tịch số 4639/KHLT-GDĐT-VHTTDL · 03/09/2026</strong></div>
      </aside>}

      <footer className="site-footer">
        <div className="page-width footer-top"><div className="footer-brand"><img className="brand-mark" src={brandLogo} alt="Biểu trưng Văn Miếu" /><div><strong>Văn Miếu · Quốc Tử Giám</strong><p>Một trang giới thiệu di sản số<br />cho những người còn yêu việc học.</p></div></div><div className="footer-links"><a href="#di-san">Khám phá</a><a href="#dong-chay">Lịch sử</a><a href="#tro-ly">Hỏi Sử Ký</a><button type="button" onClick={() => setAboutVisible(true)}>Giới thiệu về em</button></div><div className="footer-note"><Clock3 size={16} /><span>1070 — 2026<br />Hà Nội, Việt Nam</span></div></div>
        <div className="page-width footer-bottom"><span>Được làm cho một bài tập, bằng tất cả sự tò mò.</span><span>© 2026 · Di sản thuộc về mọi người</span></div>
      </footer>

      {!chatExpanded && <button className={`chat-launcher ${chatOpen ? "is-open" : ""}`} type="button" onClick={() => { setChatOpen((open) => !open); setChatExpanded(false); }} aria-label="Mở trợ lý Sử Ký">{chatOpen ? <X size={21} /> : <MessageCircle size={21} />}<span>Sử Ký</span></button>}
      {chatOpen && <><div className={`chat-backdrop ${chatExpanded ? "is-visible" : ""}`} onClick={() => setChatExpanded(false)} aria-hidden="true" /><aside className={`chat-panel ${chatExpanded ? "is-expanded" : ""}`} aria-label="Trợ lý Sử Ký">
        <div className="chat-panel-head"><div className="ai-avatar"><Sparkles size={17} /></div><div><strong>Sử Ký</strong><span>DeepSeek AI · Văn Miếu</span></div><div className="chat-head-actions"><button type="button" onClick={() => setChatExpanded((expanded) => !expanded)} aria-label={chatExpanded ? "Thu nhỏ khung chat" : "Phóng to khung chat"} title={chatExpanded ? "Thu nhỏ" : "Phóng to"}>{chatExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button><button type="button" onClick={clearChat} aria-label="Bắt đầu cuộc trò chuyện mới" title="Cuộc trò chuyện mới"><BookOpen size={16} /></button><button type="button" onClick={() => { setChatOpen(false); setChatExpanded(false); }} aria-label="Đóng trợ lý"><X size={17} /></button></div></div>
        <div className="chat-messages" ref={messagesRef} aria-live="polite">{messages.map((message, index) => <div className={`chat-bubble ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}{isTyping && <div className="chat-bubble assistant typing-bubble" aria-label="Sử Ký đang gõ"><span>Sử Ký đang gõ</span><i /><i /><i /></div>}</div>
        <div className="chat-quick"><button type="button" onClick={() => askQuestion("Khuê Văn Các có ý nghĩa gì?")}>Khuê Văn Các</button><button type="button" onClick={() => askQuestion("Có bao nhiêu bia Tiến sĩ?")}>Bia Tiến sĩ</button></div>
        <form className="chat-form" onSubmit={(event) => { event.preventDefault(); askQuestion(); }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Đặt câu hỏi..." /><button type="submit" aria-label="Gửi"><Send size={16} /></button></form>
      </aside></>}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Expand,
  Gift,
  Heart,
  Info,
  Menu,
  Pause,
  Play,
  Plus,
  Search,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

const profileImage = '/images/photo_2026-09-07_15-56-35.jpg';
const featureImage = '/images/photo_2026-09-07_15-56-15.jpg';
const palmaImage = '/images/palma.jpg';
// const antonioImage = '/images/photo_2026-09-07_15-56-35.jpg';

// Put your birthday video file at: public/videos/manuela-birthday.mp4
const videoUrl = '/videos/manuela-birthday.mp4';

type MemoryPhoto = { url: string; name: string };

// Default photos for each row — no upload needed.
// Put your image files at: public/images/memories/1.jpg through public/images/memories/9.jpg
// (jpg, png, or webp all work — just update the extension below if a file isn't .jpg)
const memoryRows = [
  {
    title: 'Because It’s Your Birthday',
    note: 'A little celebration of you',
    tone: 'sunset',
    photos: [
      { url: '/images/memories/1.jpg', name: 'Memory 1' },
      { url: '/images/memories/2.jpg', name: 'Memory 2' },
      { url: '/images/memories/3.jpg', name: 'Memory 3' },
    ] as MemoryPhoto[],
  },
  {
    title: "Manuela's Greatest Moments",
    note: 'The star of every story',
    tone: 'rose',
    photos: [
      { url: '/images/memories/4.jpg', name: 'Memory 4' },
      { url: '/images/memories/5.jpg', name: 'Memory 5' },
      { url: '/images/memories/6.jpg', name: 'Memory 6' },
    ] as MemoryPhoto[],
  },
  {
    title: 'A Collection of Beautiful Memories',
    note: 'More chapters coming soon',
    tone: 'night',
    photos: [
      { url: '/images/memories/7.png', name: 'Memory 7' },
      { url: '/images/memories/8.png', name: 'Memory 8' },
      { url: '/images/memories/9.png', name: 'Memory 9' },
    ] as MemoryPhoto[],
  },
];

const profiles = [
  { name: 'Manuela', image: profileImage, active: true },
  { name: 'Palma', image: palmaImage, active: false },
  { name: 'Antonio', image: null, active: false, initials: 'A' },
];

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function App() {
  const [isWatching, setIsWatching] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const startWatching = () => {
    setIsWatching(true);
    window.setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  };

  const goFullscreen = () => {
    if (playerRef.current?.requestFullscreen) {
      playerRef.current.requestFullscreen();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPhotos = files.map((file) => ({ url: URL.createObjectURL(file), name: file.name }));
    setMemories((prev) => [...prev, ...newPhotos]);
  };

  useEffect(() => {
    return () => {
      memories.forEach((m) => URL.revokeObjectURL(m.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isWatching) {
    return (
      <main className="profile-screen">
        <div className="profile-vignette" />
        <header className="profile-brand" aria-label="ManuelaFlix">MANUELA<span>FLIX</span></header>
        <section className="profile-content">
          <div className="eyebrow"><Sparkles size={14} /> A private birthday premiere</div>
          <h1>Who’s watching?</h1>
          <p className="profile-intro">Choose your profile to enter Manuela's very own world.</p>
          <div className="profiles" role="list">
            {profiles.map((profile) => (
              <button
                className={`profile-card ${profile.active ? 'is-active' : 'is-locked'}`}
                key={profile.name}
                onClick={profile.active ? () => setIsWatching(true) : undefined}
                aria-label={profile.active ? `Watch as ${profile.name}` : `${profile.name} profile unavailable`}
                type="button"
              >
                <span className="profile-avatar">
                  {profile.image ? <img src={profile.image} alt="Manuela" /> : <span className={`avatar-initial ${profile.name.toLowerCase()}`}>{profile.initials}</span>}
                  {profile.active && <span className="profile-ring" />}
                </span>
                <span className="profile-name">{profile.name}</span>
                {profile.active && <span className="profile-hint">Enter your celebration</span>}
              </button>
            ))}
          </div>
          <div className="manage-profiles"><CircleUserRound size={15} /> A celebration made just for one</div>
        </section>
        <footer className="profile-footer">MANUELAFLIX <span>•</span> made especially for Manuela</footer>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} hidden />

      <header className="nav-bar">
        <div className="nav-inner">
          <button className="mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <a className="wordmark" href="#top">MANUELA<span>FLIX</span></a>
          <nav className={`main-nav ${showMobileMenu ? 'open' : ''}`}>
            <a className="selected" href="#top" onClick={() => setShowMobileMenu(false)}>Home</a>
            <a href="#birthday" onClick={() => setShowMobileMenu(false)}>Birthday</a>
            <a href="#memories" onClick={() => setShowMobileMenu(false)}>Memories</a>
            <a href="#for-manuela" onClick={() => setShowMobileMenu(false)}>For Manuela</a>
          </nav>
          <div className="nav-actions">
            <button type="button" aria-label="Search"><Search size={19} /></button>
            <button className="mini-profile" type="button" onClick={() => setIsWatching(false)} aria-label="Change profile"><img src={profileImage} alt="Manuela profile" /><ChevronDown size={14} /></button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero" id="birthday">
          <div className="hero-image" />
          <div className="hero-gradient" />
          <div className="hero-content">
            <div className="hero-kicker"><Gift size={15} /> Tonight's feature</div>
            <h1>Manuela's<br /><em>Birthday</em></h1>
            <p className="hero-description">A whole streaming service made for the most unforgettable girl we know.</p>
            <div className="hero-meta"><span>2026</span><span className="dot">•</span><span className="rating">ALL</span><span className="dot">•</span><span>1 special feature</span></div>
            <div className="hero-buttons">
              <button className="button button-light" type="button" onClick={startWatching}><Play size={18} fill="currentColor" /> Play</button>
              <a className="button button-muted" href="#memories"><Info size={18} /> More info</a>
            </div>
          </div>
          <div className="hero-side-note"><span>01</span><div className="side-line" /><span>01</span></div>
        </section>

        <section className="content-area" id="memories">
          <div className="welcome-line"><span>Welcome back, Manuela.</span><span className="welcome-rule" /><span>Made with love</span><Heart size={13} fill="currentColor" /></div>
          <div className="section-heading"><div><p className="section-label">Your private collection</p><h2>Keep celebrating</h2></div><span className="collection-count">3 collections <ChevronRight size={15} /></span></div>

          <section className="featured-card" ref={playerRef} aria-label="Birthday video">
            <div className={`featured-visual ${isPlaying ? 'playing' : ''}`}>
              <video
                ref={videoRef}
                src={videoUrl}
                poster={featureImage}
                className="featured-video"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  setCurrentTime(v.currentTime);
                  setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
                }}
                onClick={togglePlay}
              />
              <div className={`visual-wash ${isPlaying ? 'faded' : ''}`} />
              {isPlaying && <div className="playback-glow" />}
              <div className={`featured-copy ${isPlaying ? 'hidden' : ''}`}>
                <p className="feature-tag"><Sparkles size={13} /> Original birthday feature</p>
                <h2>Happy Birthday,<br /><span>Manuela</span> <Heart size={24} fill="currentColor" /></h2>
                <p>A special birthday message made just for you.</p>
                <div className="featured-actions">
                  <button className="round-play" type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause birthday video' : 'Play birthday video'}>
                    {isPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
                  </button>
                </div>
              </div>
              <div className="player-controls">
                <div className="progress-track" onClick={seek}><span style={{ width: `${progress}%` }} /></div>
                <div className="controls-row">
                  <button type="button" onClick={togglePlay} aria-label={isPlaying ? 'Pause video' : 'Play video'}>
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                  <button type="button" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <span className="time-display">{formatTime(currentTime)} <i>•</i> {formatTime(duration)}</span>
                  <button className="expand-button" type="button" onClick={goFullscreen} aria-label="Fullscreen"><Expand size={18} /></button>
                </div>
              </div>
            </div>
          </section>

          <div className="rows-wrap">
            {memoryRows.map((row, index) => {
              const rowPhotos = index === 0 ? [...row.photos, ...memories] : row.photos;
              return (
                <section className="memory-row" key={row.title}>
                  <div className="row-heading">
                    <div><h3>{row.title} <Heart size={16} fill="currentColor" /></h3><p>{row.note}</p></div>
                    {index === 0 && (
                      <button type="button" onClick={() => photoInputRef.current?.click()} aria-label="Upload photos">
                        <Upload size={15} /><span>Add photos</span>
                      </button>
                    )}
                    {index !== 0 && (
                      <button type="button" aria-label={`View ${row.title}`}><span>View all</span><ChevronRight size={17} /></button>
                    )}
                  </div>
                  <div className="memory-cards">
                    {rowPhotos.map((photo, pi) => (
                      <div className="memory-card photo-card" key={pi}>
                        <img src={photo.url} alt={`Memory of Manuela ${pi + 1}`} />
                        <div className="photo-card-overlay" />
                      </div>
                    ))}
                    {rowPhotos.length === 0 && (
                      <>
                        <div className={`memory-card empty-card ${row.tone}`}>
                          <div className="memory-card-overlay" />
                          <div className="empty-copy">
                            <Plus size={19} />
                            <span>Memory {index + 1}</span>
                            <small>Your next favorite moment</small>
                          </div>
                        </div>
                        <div className={`memory-card quote-card ${row.tone}`}>
                          <div className="quote-mark">"</div>
                          <p>Every beautiful<br />thing starts<br /><strong>with you.</strong></p>
                          <small>MANUELAFLIX ORIGINAL</small>
                        </div>
                        <div className={`memory-card empty-card ${row.tone} shifted`}>
                          <div className="memory-card-overlay" />
                          <div className="empty-copy">
                            <Sparkles size={18} />
                            <span>Coming soon</span>
                            <small>More memories to add</small>
                          </div>
                        </div>
                      </>
                    )}
                    {rowPhotos.length > 0 && rowPhotos.length < 3 && (
                      <div className={`memory-card empty-card ${row.tone}`}>
                        <div className="memory-card-overlay" />
                        <div className="empty-copy">
                          <Plus size={19} />
                          <span>Add more</span>
                          <small>More memories to come</small>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>
      <footer className="site-footer" id="for-manuela">
        <div className="footer-mark">M<span>F</span></div>
        <div><strong>Made especially for Manuela.</strong><p>Your own little corner of the universe, always on.</p></div>
        <span className="footer-heart"><Heart size={16} fill="currentColor" /></span>
      </footer>
    </div>
  );
}

export default App;
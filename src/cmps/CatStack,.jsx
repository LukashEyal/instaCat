import cat1 from "../assets/img/1.jpg"
import cat2 from "../assets/img/2.jpg"
import cat5 from "../assets/img/5.jpg"


export  function CatStack() {
  return (
    <div className="catstack" aria-hidden="true">
      {/* back cards */}
   <div
  className="catstack__card catstack__card--left"
  style={{ backgroundImage: `url(${cat2})` }}
/>

<div
  className="catstack__card catstack__card--right"
  style={{ backgroundImage: `url(${cat5})` }}
/>
      

      {/* center phone-like frame */}
      <div className="catstack__phone">
        <img
          src={cat1}
          alt=""
          className="catstack__img"
          loading="lazy"
        />

        {/* reactions & UI bits */}
        <div className="catstack__bubble" title="Reactions">
          <span role="img" aria-label="fire">🔥</span>
          <span role="img" aria-label="paw">🐾</span>
          <span role="img" aria-label="purple heart">💜</span>
        </div>

        <div className="catstack__scrubber" />
        <button className="catstack__like" aria-label="Like">
          {/* heart icon */}
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              d="M12 21s-7.3-4.6-9.6-8C.8 9.8 2.4 6 5.9 6c2 0 3.3 1 4.1 2.2C10.9 7 12.2 6 14.2 6c3.5 0 5.1 3.8 3.5 7-2.3 3.4-9.7 8-9.7 8z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* story ring avatar */}
      <div className="catstack__story" title="instaCat story">
        <img src="https://placekitten.com/110/110" alt="" />
        <div className="catstack__story-badge" title="featured">
          {/* star icon */}
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path
              d="M12 2l2.9 6.7 7.1.6-5.4 4.7 1.7 6.9L12 17.6 5.7 20.9l1.7-6.9L2 9.3l7.1-.6L12 2z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

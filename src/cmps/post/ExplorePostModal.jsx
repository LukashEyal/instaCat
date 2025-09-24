export function ExplorePostModal({ post, onBackDropClick }) {
  return (
    <section className='explore-post-modal-backdrop'>
      <div
        className='explore-post-modal-container'
        onClick={() => onBackDropClick()}
      >
        <div
          className='explore-post-modal'
          onClick={(ev) => ev.stopPropagation()}
        >
          <div className='explore-post-modal-left-pane'>
            <img src={post.imageUrl} alt='Explore Post' />
          </div>
          <div className='explore-post-modal-right-pane'>
            <header className='explore-post-modal-header'>Something</header>
            <div className='explore-post-modal-body'>Something</div>
          </div>
        </div>
      </div>
    </section>
  )
}

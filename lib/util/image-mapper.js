export default img => {
  let tags =  [{
    value: "Tag1",
    title: "Tag one"
  },
  {
    value: "Tag2",
    title: "Tag two"
  }
]
  return {
    caption: img.name,
    src: img.url,
    thumbnail: img.url,
    thumbnailWidth: img.dimension.width,
    thumbnailHeight: img.dimension.height,
    // thumbnailCaption: img.name,
    tags,
    customOverlay: (
      <div style={captionStyle}>
          <div>{img.name}</div>
          {ownerLabel(img)} {setCustomTags(img, tags)}
      </div>
    )
  }
}

const ownerLabel = i => { return i.is_owner ? (
  <div
      style={{ ...customTagStyle, backgroundColor: 'cyan' }}>
      Owner
    </div>
) : ''}

const setCustomTags = (i, tags) => {
  return (
      tags.map((t) => {
          return (
            <div
              key={t.value}
              style={customTagStyle}>
              {t.title}
            </div>
          );
      })
  );
}

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.84)",
  // height: "100%",
  overflow: "hidden",
  position: "absolute",
  bottom: "0",
  width: "100%",
  color: "white",
  padding: "2px",
  fontSize: "90%",
  // diaplay: 'flex',
  // alignContent: 'center',
  // justifyContent: 'center'
};

const customTagStyle = {
  wordWrap: "break-word",
  display: "inline-block",
  backgroundColor: "white",
  height: "auto",
  fontSize: "75%",
  fontWeight: "600",
  lineHeight: "1",
  padding: ".2em .6em .3em",
  borderRadius: ".25em",
  color: "black",
  verticalAlign: "baseline",
  margin: "2px"
};